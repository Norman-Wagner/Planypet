import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, tinyint, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  emergencyContactName: varchar("emergencyContactName", { length: 255 }),
  emergencyContactPhone: varchar("emergencyContactPhone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Pet Management Tables
export const pets = mysqlTable("pets", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // dog, cat, fish, bird, reptile, horse, small_mammal
  breed: varchar("breed", { length: 255 }),
  birthDate: varchar("birthDate", { length: 20 }),
  weight: varchar("weight", { length: 50 }),
  microchipId: varchar("microchipId", { length: 255 }),
  insurance: text("insurance"),
  notes: text("notes"),
  avatar: text("avatar"), // S3 URL
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Pet = typeof pets.$inferSelect;
export type InsertPet = typeof pets.$inferInsert;

// Chip Registration Table
export const chipRegistrations = mysqlTable("chipRegistrations", {
  id: int("id").autoincrement().primaryKey(),
  petId: int("petId").notNull().references(() => pets.id, { onDelete: "cascade" }),
  chipNumber: varchar("chipNumber", { length: 255 }).notNull().unique(),
  chipBrand: varchar("chipBrand", { length: 100 }), // e.g., HomeAgain, AKC Reunite
  implantDate: timestamp("implantDate"),
  implantVet: varchar("implantVet", { length: 255 }),
  
  // Registration status for each database
  tassoRegistered: tinyint("tassoRegistered").default(0),
  tassoRegistrationId: varchar("tassoRegistrationId", { length: 255 }),
  tassoRegisteredAt: timestamp("tassoRegisteredAt"),
  
  findifixRegistered: tinyint("findifixRegistered").default(0),
  findifixRegistrationId: varchar("findifixRegistrationId", { length: 255 }),
  findifixRegisteredAt: timestamp("findifixRegisteredAt"),
  
  tiermeldezentraleRegistered: tinyint("tiermeldezentraleRegistered").default(0),
  tiermeldezentraleRegistrationId: varchar("tiermeldezentraleRegistrationId", { length: 255 }),
  tiermeldezentraleRegisteredAt: timestamp("tiermeldezentraleRegisteredAt"),
  
  // Email templates for paid registrations
  tassoEmailSent: tinyint("tassoEmailSent").default(0),
  findifixEmailSent: tinyint("findifixEmailSent").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChipRegistration = typeof chipRegistrations.$inferSelect;
export type InsertChipRegistration = typeof chipRegistrations.$inferInsert;

// Chip Registration History (for audit trail)
export const chipRegHistory = mysqlTable("chipRegHistory", {
  id: int("id").autoincrement().primaryKey(),
  chipRegId: int("chipRegId").notNull().references(() => chipRegistrations.id, { onDelete: "cascade" }),
  database: varchar("database", { length: 50 }).notNull(), // tasso, findefix, tiermeldezentrale
  status: varchar("status", { length: 50 }).notNull(), // pending, sent, registered, failed
  details: json("details"), // Error messages, response data, etc.
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChipRegHistory = typeof chipRegHistory.$inferSelect;
export type InsertChipRegHistory = typeof chipRegHistory.$inferInsert;

export const petShares = mysqlTable("petShares", {
  id: int("id").autoincrement().primaryKey(),
  petId: int("petId").notNull().references(() => pets.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull().default("member"), // owner, member
  canEdit: tinyint("canEdit").notNull().default(1),
  canDelete: tinyint("canDelete").notNull().default(0),
  invitedBy: int("invitedBy").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PetShare = typeof petShares.$inferSelect;
export type InsertPetShare = typeof petShares.$inferInsert;

export const activities = mysqlTable("activities", {
  id: int("id").autoincrement().primaryKey(),
  petId: int("petId").notNull().references(() => pets.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id),
  type: varchar("type", { length: 50 }).notNull(), // feeding, walk, symptom, medication, vaccination, note
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  metadata: json("metadata"), // Additional data like GPS coordinates, duration, etc.
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;

export const healthRecords = mysqlTable("healthRecords", {
  id: int("id").autoincrement().primaryKey(),
  petId: int("petId").notNull().references(() => pets.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id),
  type: varchar("type", { length: 50 }).notNull(), // symptom, vaccination, medication, note
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  photos: json("photos"), // Array of S3 URLs
  aiAnalysis: text("aiAnalysis"),
  date: timestamp("date").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HealthRecord = typeof healthRecords.$inferSelect;
export type InsertHealthRecord = typeof healthRecords.$inferInsert;

export const invitations = mysqlTable("invitations", {
  id: int("id").autoincrement().primaryKey(),
  petId: int("petId").notNull().references(() => pets.id, { onDelete: "cascade" }),
  invitedBy: int("invitedBy").notNull().references(() => users.id),
  inviteeEmail: varchar("inviteeEmail", { length: 320 }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  role: varchar("role", { length: 20 }).notNull().default("member"),
  expiresAt: timestamp("expiresAt").notNull(),
  acceptedAt: timestamp("acceptedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Invitation = typeof invitations.$inferSelect;
export type InsertInvitation = typeof invitations.$inferInsert;

export const pushTokens = mysqlTable("pushTokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 512 }).notNull().unique(),
  platform: varchar("platform", { length: 20 }).notNull(), // ios, android, web
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PushToken = typeof pushTokens.$inferSelect;
export type InsertPushToken = typeof pushTokens.$inferInsert;

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  petId: int("petId").references(() => pets.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(), // feeding, walk, vet_appointment, medication
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  scheduledFor: timestamp("scheduledFor").notNull(),
  sentAt: timestamp("sentAt"),
  isRead: tinyint("isRead").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// Feeding Schedule Table
export const feedingSchedules = mysqlTable("feedingSchedules", {
  id: int("id").autoincrement().primaryKey(),
  petId: int("petId").notNull().references(() => pets.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id),
  time: varchar("time", { length: 5 }).notNull(), // HH:MM format
  amount: varchar("amount", { length: 100 }).notNull(), // e.g., "200g"
  foodType: varchar("foodType", { length: 255 }).notNull(),
  daysOfWeek: json("daysOfWeek"), // [0,1,2,3,4,5,6] for each day
  isActive: tinyint("isActive").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FeedingSchedule = typeof feedingSchedules.$inferSelect;
export type InsertFeedingSchedule = typeof feedingSchedules.$inferInsert;

// Walk/Activity Schedule Table
export const activitySchedules = mysqlTable("activitySchedules", {
  id: int("id").autoincrement().primaryKey(),
  petId: int("petId").notNull().references(() => pets.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id),
  type: varchar("type", { length: 50 }).notNull(), // walk, play, training
  time: varchar("time", { length: 5 }).notNull(), // HH:MM format
  duration: int("duration").notNull(), // minutes
  daysOfWeek: json("daysOfWeek"), // [0,1,2,3,4,5,6]
  isActive: tinyint("isActive").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ActivitySchedule = typeof activitySchedules.$inferSelect;
export type InsertActivitySchedule = typeof activitySchedules.$inferInsert;
