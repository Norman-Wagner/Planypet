import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { chipRegistrations, chipRegHistory, pets } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

// Chip registration database URLs and email templates
const CHIP_DATABASES = {
  tasso: {
    name: "Tasso e.V.",
    url: "https://www.tasso.net",
    registrationUrl: "https://www.tasso.net/anmeldung",
    cost: "kostenlos",
    email: "info@tasso.net",
    description: "Deutschlands größte Haustier-Registrierungsdatenbank",
  },
  findefix: {
    name: "Findefix",
    url: "https://www.findefix.de",
    registrationUrl: "https://www.findefix.de/tierhalter/registrierung",
    cost: "kostenlos",
    email: "info@findefix.de",
    description: "Deutsches Haustier-Register des Deutschen Tierschutzbundes",
  },
  tiermeldezentrale: {
    name: "Tiermeldezentrale",
    url: "https://www.tiermeldezentrale.de",
    registrationUrl: "https://www.tiermeldezentrale.de/anmeldung",
    cost: "kostenpflichtig (ca. 10-15€)",
    email: "info@tiermeldezentrale.de",
    description: "Internationale Haustier-Registrierungsdatenbank",
  },
};

export const chipsRouter = router({
  // Get chip registration status for a pet
  getChipStatus: protectedProcedure
    .input(z.object({ petId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Verify access
      const pet = await db.select().from(pets).where(eq(pets.id, input.petId)).limit(1);
      if (!pet[0]) throw new TRPCError({ code: "NOT_FOUND" });

      const isOwner = pet[0].ownerId === ctx.user.id;
      if (!isOwner) throw new TRPCError({ code: "FORBIDDEN" });

      const chipReg = await db
        .select()
        .from(chipRegistrations)
        .where(eq(chipRegistrations.petId, input.petId))
        .limit(1);

      if (!chipReg[0]) {
        return { registered: false, chip: null };
      }

      return {
        registered: true,
        chip: {
          chipNumber: chipReg[0].chipNumber,
          chipBrand: chipReg[0].chipBrand,
          implantDate: chipReg[0].implantDate,
          implantVet: chipReg[0].implantVet,
          registrations: {
            tasso: {
              registered: !!chipReg[0].tassoRegistered,
              registeredAt: chipReg[0].tassoRegisteredAt,
              emailSent: !!chipReg[0].tassoEmailSent,
            },
            findefix: {
              registered: !!chipReg[0].findifixRegistered,
              registeredAt: chipReg[0].findifixRegisteredAt,
              emailSent: !!chipReg[0].findifixEmailSent,
            },
            tiermeldezentrale: {
              registered: !!chipReg[0].tiermeldezentraleRegistered,
              registeredAt: chipReg[0].tiermeldezentraleRegisteredAt,
            },
          },
        },
      };
    }),

  // Register a chip for a pet
  registerChip: protectedProcedure
    .input(
      z.object({
        petId: z.number(),
        chipNumber: z.string().min(15).max(15), // ISO standard 15-digit chip number
        chipBrand: z.string().optional(),
        implantDate: z.date().optional(),
        implantVet: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Verify ownership
      const pet = await db.select().from(pets).where(eq(pets.id, input.petId)).limit(1);
      if (!pet[0] || pet[0].ownerId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Check if chip already registered
      const existing = await db
        .select()
        .from(chipRegistrations)
        .where(eq(chipRegistrations.chipNumber, input.chipNumber))
        .limit(1);

      if (existing[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Diese Chipnummer ist bereits registriert",
        });
      }

      // Create chip registration
      const [chipReg] = await db.insert(chipRegistrations).values({
        petId: input.petId,
        chipNumber: input.chipNumber,
        chipBrand: input.chipBrand,
        implantDate: input.implantDate,
        implantVet: input.implantVet,
      });

      // Update pet with chip number
      await db
        .update(pets)
        .set({ microchipId: input.chipNumber })
        .where(eq(pets.id, input.petId));

      return { success: true, chipId: chipReg.insertId };
    }),

  // Mark registration as completed for a database
  markRegistrationComplete: protectedProcedure
    .input(
      z.object({
        petId: z.number(),
        database: z.enum(["tasso", "findefix", "tiermeldezentrale"]),
        registrationId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Verify ownership
      const pet = await db.select().from(pets).where(eq(pets.id, input.petId)).limit(1);
      if (!pet[0] || pet[0].ownerId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const chipReg = await db
        .select()
        .from(chipRegistrations)
        .where(eq(chipRegistrations.petId, input.petId))
        .limit(1);

      if (!chipReg[0]) throw new TRPCError({ code: "NOT_FOUND" });

      const updates: Record<string, any> = {};
      if (input.database === "tasso") {
        updates.tassoRegistered = 1;
        updates.tassoRegisteredAt = new Date();
        if (input.registrationId) updates.tassoRegistrationId = input.registrationId;
      } else if (input.database === "findefix") {
        updates.findifixRegistered = 1;
        updates.findifixRegisteredAt = new Date();
        if (input.registrationId) updates.findifixRegistrationId = input.registrationId;
      } else if (input.database === "tiermeldezentrale") {
        updates.tiermeldezentraleRegistered = 1;
        updates.tiermeldezentraleRegisteredAt = new Date();
        if (input.registrationId)
          updates.tiermeldezentraleRegistrationId = input.registrationId;
      }

      await db
        .update(chipRegistrations)
        .set(updates)
        .where(eq(chipRegistrations.id, chipReg[0].id));

      // Log to history
      await db.insert(chipRegHistory).values({
        chipRegId: chipReg[0].id,
        database: input.database,
        status: "registered",
        details: { registrationId: input.registrationId },
      });

      return { success: true };
    }),

  // Send registration email for paid databases
  sendRegistrationEmail: protectedProcedure
    .input(
      z.object({
        petId: z.number(),
        database: z.enum(["tasso", "findefix", "tiermeldezentrale"]),
        userEmail: z.string().email(),
        userName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Verify ownership
      const pet = await db.select().from(pets).where(eq(pets.id, input.petId)).limit(1);
      if (!pet[0] || pet[0].ownerId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const chipReg = await db
        .select()
        .from(chipRegistrations)
        .where(eq(chipRegistrations.petId, input.petId))
        .limit(1);

      if (!chipReg[0]) throw new TRPCError({ code: "NOT_FOUND" });

      const dbInfo = CHIP_DATABASES[input.database];

      // Generate email template
      const emailTemplate = generateRegistrationEmail(
        input.database,
        dbInfo,
        input.userName,
        pet[0],
        chipReg[0]
      );

      // Mark email as sent
      if (input.database === "tasso") {
        await db
          .update(chipRegistrations)
          .set({ tassoEmailSent: 1 })
          .where(eq(chipRegistrations.id, chipReg[0].id));
      } else if (input.database === "findefix") {
        await db
          .update(chipRegistrations)
          .set({ findifixEmailSent: 1 })
          .where(eq(chipRegistrations.id, chipReg[0].id));
      }

      // Log to history
      await db.insert(chipRegHistory).values({
        chipRegId: chipReg[0].id,
        database: input.database,
        status: "sent",
        details: { emailSent: true, sentTo: input.userEmail },
      });

      return {
        success: true,
        email: emailTemplate,
        database: dbInfo,
      };
    }),

  // Get all chip databases info
  getChipDatabases: protectedProcedure.query(() => {
    return Object.entries(CHIP_DATABASES).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  }),
});

function generateRegistrationEmail(
  database: string,
  dbInfo: (typeof CHIP_DATABASES)["tasso"],
  userName: string,
  pet: any,
  chipReg: any
) {
  const baseTemplate = `
Hallo ${userName},

um dein Tier ${pet.name} mit der Chipnummer ${chipReg.chipNumber} bei ${dbInfo.name} zu registrieren, folge bitte diesen Schritten:

1. Besuche: ${dbInfo.registrationUrl}
2. Gib folgende Daten ein:
   - Chipnummer: ${chipReg.chipNumber}
   - Tierart: ${pet.type}
   - Tierrasse: ${pet.breed || "Unbekannt"}
   - Geburtsdatum: ${pet.birthDate || "Unbekannt"}
   - Dein Name: ${userName}

3. Bestätige die Registrierung

Kosten: ${dbInfo.cost}

Bei Fragen kontaktiere: ${dbInfo.email}

Viele Grüße,
Planypet Team
`;

  return baseTemplate;
}
