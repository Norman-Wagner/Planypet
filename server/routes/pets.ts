import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { pets, petShares, activities, invitations } from "../../drizzle/schema";
import { eq, and, or } from "drizzle-orm";
import { randomBytes } from "crypto";

export const petsRouter = router({
  // Get all pets (owned + shared with user)
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    // Get owned pets
    const ownedPets = await db.select().from(pets).where(eq(pets.ownerId, userId));

    // Get shared pets
    const sharedPetIds = await db
      .select({ petId: petShares.petId })
      .from(petShares)
      .where(eq(petShares.userId, userId));

    const sharedPets = sharedPetIds.length > 0
      ? await db.select().from(pets).where(
          or(...sharedPetIds.map((s: { petId: number }) => eq(pets.id, s.petId)))
        )
      : [];

    return { owned: ownedPets, shared: sharedPets };
  }),

  // Create a new pet
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
        breed: z.string().optional(),
        birthDate: z.string().optional(),
        weight: z.string().optional(),
        microchipId: z.string().optional(),
        insurance: z.string().optional(),
        notes: z.string().optional(),
        avatar: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const [newPet] = await db.insert(pets).values({
        ownerId: ctx.user.id,
        ...input,
      });

      return newPet;
    }),

  // Update pet
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        type: z.string().optional(),
        breed: z.string().optional(),
        birthDate: z.string().optional(),
        weight: z.string().optional(),
        microchipId: z.string().optional(),
        insurance: z.string().optional(),
        notes: z.string().optional(),
        avatar: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const { id, ...updates } = input;

      // Check if user has edit permission
      const pet = await db.select().from(pets).where(eq(pets.id, id)).limit(1);
      if (!pet[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Pet not found" });
      }

      const isOwner = pet[0].ownerId === ctx.user.id;
      if (!isOwner) {
        const share = await db
          .select()
          .from(petShares)
          .where(and(eq(petShares.petId, id), eq(petShares.userId, ctx.user.id)))
          .limit(1);

        if (!share[0] || !share[0].canEdit) {
          throw new TRPCError({ code: "FORBIDDEN", message: "No edit permission" });
        }
      }

      await db.update(pets).set(updates).where(eq(pets.id, id));
      return { success: true };
    }),

  // Delete pet
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const pet = await db.select().from(pets).where(eq(pets.id, input.id)).limit(1);
      if (!pet[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Pet not found" });
      }

      const isOwner = pet[0].ownerId === ctx.user.id;
      if (!isOwner) {
        const share = await db
          .select()
          .from(petShares)
          .where(and(eq(petShares.petId, input.id), eq(petShares.userId, ctx.user.id)))
          .limit(1);

        if (!share[0] || !share[0].canDelete) {
          throw new TRPCError({ code: "FORBIDDEN", message: "No delete permission" });
        }
      }

      await db.delete(pets).where(eq(pets.id, input.id));
      return { success: true };
    }),

  // Create invitation
  createInvitation: protectedProcedure
    .input(
      z.object({
        petId: z.number(),
        inviteeEmail: z.string().email().optional(),
        role: z.enum(["owner", "member"]).default("member"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Verify ownership
      const pet = await db.select().from(pets).where(eq(pets.id, input.petId)).limit(1);
      if (!pet[0] || pet[0].ownerId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only owner can invite" });
      }

      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const [invitation] = await db.insert(invitations).values({
        petId: input.petId,
        invitedBy: ctx.user.id,
        inviteeEmail: input.inviteeEmail,
        token,
        role: input.role,
        expiresAt,
      });

      return { token, invitation };
    }),

  // Accept invitation
  acceptInvitation: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const invitation = await db
        .select()
        .from(invitations)
        .where(eq(invitations.token, input.token))
        .limit(1);

      if (!invitation[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invitation not found" });
      }

      if (invitation[0].acceptedAt) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invitation already accepted" });
      }

      if (new Date() > invitation[0].expiresAt) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invitation expired" });
      }

      // Create pet share
      await db.insert(petShares).values({
        petId: invitation[0].petId,
        userId: ctx.user.id,
        role: invitation[0].role,
        canEdit: 1,
        canDelete: invitation[0].role === "owner" ? 1 : 0,
        invitedBy: invitation[0].invitedBy,
      });

      // Mark invitation as accepted
      await db
        .update(invitations)
        .set({ acceptedAt: new Date() })
        .where(eq(invitations.id, invitation[0].id));

      return { success: true };
    }),

  // Get activity feed for a pet
  getActivityFeed: protectedProcedure
    .input(z.object({ petId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Verify access
      const pet = await db.select().from(pets).where(eq(pets.id, input.petId)).limit(1);
      if (!pet[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Pet not found" });
      }

      const hasAccess =
        pet[0].ownerId === ctx.user.id ||
        (
          await db
            .select()
            .from(petShares)
            .where(and(eq(petShares.petId, input.petId), eq(petShares.userId, ctx.user.id)))
            .limit(1)
        ).length > 0;

      if (!hasAccess) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No access to this pet" });
      }

      const feed = await db
        .select()
        .from(activities)
        .where(eq(activities.petId, input.petId));

      return feed;
    }),

  // Log activity
  logActivity: protectedProcedure
    .input(
      z.object({
        petId: z.number(),
        type: z.enum(["feeding", "walk", "symptom", "medication", "vaccination", "note"]),
        title: z.string(),
        description: z.string().optional(),
        metadata: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const [activity] = await db.insert(activities).values({
        petId: input.petId,
        userId: ctx.user.id,
        type: input.type,
        title: input.title,
        description: input.description,
        metadata: input.metadata,
      });

      return activity;
    }),
});
