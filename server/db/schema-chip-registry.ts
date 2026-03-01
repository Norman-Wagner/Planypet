/**
 * Chip Registry Database Schema
 * DSGVO/GDPR compliant pet chip registration
 */

import { pgTable, text, timestamp, uuid, varchar, boolean, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

/**
 * Pet Chip Registry Table
 * Stores chip registration data for lost/found pets
 */
export const petChipRegistry = pgTable('pet_chip_registry', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Chip information
  chipNumber: varchar('chip_number', { length: 50 }).notNull().unique(),
  chipType: varchar('chip_type', { length: 50 }), // ISO 11784/11785, etc.
  
  // Pet information
  petName: varchar('pet_name', { length: 255 }).notNull(),
  species: varchar('species', { length: 50 }).notNull(), // dog, cat, rabbit, etc.
  breed: varchar('breed', { length: 255 }),
  color: varchar('color', { length: 255 }),
  age: text('age'), // Can be "2 years", "3 months", etc.
  weight: text('weight'), // Can be "25 kg", "3.5 lbs", etc.
  distinguishingFeatures: text('distinguishing_features'),
  
  // Owner information (DSGVO compliant - minimal required data)
  ownerName: varchar('owner_name', { length: 255 }).notNull(),
  ownerPhone: varchar('owner_phone', { length: 20 }).notNull(),
  ownerEmail: varchar('owner_email', { length: 255 }).notNull(),
  ownerAddress: text('owner_address').notNull(), // Full address for identification
  
  // Alternate contact (optional)
  alternateContactName: varchar('alternate_contact_name', { length: 255 }),
  alternateContactPhone: varchar('alternate_contact_phone', { length: 20 }),
  
  // Registration status
  isActive: boolean('is_active').default(true),
  registeredAt: timestamp('registered_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
  
  // External database registrations
  externalDatabases: jsonb('external_databases').default([]), // Array of {name, registrationNumber, registeredAt}
  
  // Notes and special information
  notes: text('notes'),
  
  // DSGVO compliance
  consentGiven: boolean('consent_given').notNull().default(false),
  consentDate: timestamp('consent_date'),
  dataProcessingAgreement: boolean('data_processing_agreement').notNull().default(false),
  
  // Lost/Found status
  isLost: boolean('is_lost').default(false),
  lostDate: timestamp('lost_date'),
  lostLocation: text('lost_location'),
  
  // Audit trail
  createdBy: uuid('created_by'),
  lastModifiedBy: uuid('last_modified_by'),
});

/**
 * Chip Registry Activity Log
 * Tracks all access and modifications for DSGVO compliance
 */
export const chipRegistryActivityLog = pgTable('chip_registry_activity_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  chipRegistryId: uuid('chip_registry_id')
    .notNull()
    .references(() => petChipRegistry.id, { onDelete: 'cascade' }),
  
  action: varchar('action', { length: 50 }).notNull(), // 'created', 'updated', 'accessed', 'deleted'
  actorType: varchar('actor_type', { length: 50 }), // 'owner', 'admin', 'system'
  actorId: uuid('actor_id'),
  
  changes: jsonb('changes'), // What was changed
  reason: text('reason'), // Why it was changed
  
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  ipAddress: varchar('ip_address', { length: 45 }), // IPv4 or IPv6
});

/**
 * Chip Registry Search History
 * Tracks searches for found pets (anonymized)
 */
export const chipRegistrySearchHistory = pgTable('chip_registry_search_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  chipNumber: varchar('chip_number', { length: 50 }).notNull(),
  foundDate: timestamp('found_date').defaultNow().notNull(),
  foundLocation: text('found_location'),
  
  finderName: varchar('finder_name', { length: 255 }),
  finderPhone: varchar('finder_phone', { length: 20 }),
  finderEmail: varchar('finder_email', { length: 255 }),
  
  status: varchar('status', { length: 50 }).default('pending'), // 'pending', 'matched', 'resolved'
  notes: text('notes'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Zod schemas for validation
 */
export const insertPetChipRegistrySchema = createInsertSchema(petChipRegistry);
export const selectPetChipRegistrySchema = createSelectSchema(petChipRegistry);

export type PetChipRegistry = typeof petChipRegistry.$inferSelect;
export type InsertPetChipRegistry = typeof petChipRegistry.$inferInsert;

export type ChipRegistryActivityLog = typeof chipRegistryActivityLog.$inferSelect;
export type InsertChipRegistryActivityLog = typeof chipRegistryActivityLog.$inferInsert;

export type ChipRegistrySearchHistory = typeof chipRegistrySearchHistory.$inferSelect;
export type InsertChipRegistrySearchHistory = typeof chipRegistrySearchHistory.$inferInsert;
