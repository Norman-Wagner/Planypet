import { pgTable, text, timestamp, uuid, boolean, integer, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pets = pgTable("pets", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(), // dog, cat, fish, bird, reptile, horse, small_mammal
  breed: text("breed"),
  birthDate: text("birth_date"),
  weight: text("weight"),
  microchipId: text("microchip_id"),
  insurance: text("insurance"),
  notes: text("notes"),
  avatar: text("avatar"), // S3 URL
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const petShares = pgTable("pet_shares", {
  id: uuid("id").primaryKey().defaultRandom(),
  petId: uuid("pet_id").notNull().references(() => pets.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"), // owner, member
  canEdit: boolean("can_edit").notNull().default(true),
  canDelete: boolean("can_delete").notNull().default(false),
  invitedBy: uuid("invited_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  petId: uuid("pet_id").notNull().references(() => pets.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // feeding, walk, symptom, medication, vaccination, note
  title: text("title").notNull(),
  description: text("description"),
  metadata: jsonb("metadata"), // Additional data like GPS coordinates, duration, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const healthRecords = pgTable("health_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  petId: uuid("pet_id").notNull().references(() => pets.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // symptom, vaccination, medication, note
  title: text("title").notNull(),
  description: text("description"),
  photos: jsonb("photos").$type<string[]>(), // Array of S3 URLs
  aiAnalysis: text("ai_analysis"),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const invitations = pgTable("invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  petId: uuid("pet_id").notNull().references(() => pets.id, { onDelete: "cascade" }),
  invitedBy: uuid("invited_by").notNull().references(() => users.id),
  inviteeEmail: text("invitee_email"),
  token: text("token").notNull().unique(),
  role: text("role").notNull().default("member"),
  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pushTokens = pgTable("push_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  platform: text("platform").notNull(), // ios, android, web
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  petId: uuid("pet_id").references(() => pets.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // feeding, walk, vet_appointment, medication
  title: text("title").notNull(),
  body: text("body").notNull(),
  scheduledFor: timestamp("scheduled_for").notNull(),
  sentAt: timestamp("sent_at"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
