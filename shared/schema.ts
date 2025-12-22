import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "coordinator", "volunteer"] }).notNull().default("volunteer"),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category", { enum: ["technical", "non-technical"] }).notNull(),
  rules: text("rules").notNull(),
  teamSize: integer("team_size").notNull().default(1),
  fee: integer("fee").notNull().default(0),
  date: timestamp("date").notNull(),
  venue: text("venue").notNull(),
  imageUrl: text("image_url"),
  coordinatorId: integer("coordinator_id"),
  eventCode: text("event_code").unique(), // Will be auto-generated CR26E01...
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  studentName: text("student_name").notNull(),
  studentEmail: text("student_email").notNull(),
  mobile: text("mobile").notNull(),
  year: text("year").notNull(),
  course: text("course").notNull(),
  college: text("college").notNull(),
  registrationId: text("registration_id").notNull().unique(), // Auto-generated ID
  teamDetails: jsonb("team_details"), // Store team member names/info
  status: text("status", { enum: ["pending", "confirmed", "attended"] }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===

export const eventsRelations = relations(events, ({ one, many }) => ({
  coordinator: one(users, {
    fields: [events.coordinatorId],
    references: [users.id],
  }),
  registrations: many(registrations),
}));

export const registrationsRelations = relations(registrations, ({ one }) => ({
  event: one(events, {
    fields: [registrations.eventId],
    references: [events.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  managedEvents: many(events),
}));

// === BASE SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertEventSchema = createInsertSchema(events, {
  date: z.coerce.date(),
}).omit({ id: true, eventCode: true });
export const insertRegistrationSchema = createInsertSchema(registrations).omit({ id: true, createdAt: true, status: true, registrationId: true });
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

// Request types
export type LoginRequest = { username: string; password: string };
export type CreateEventRequest = InsertEvent;
export type UpdateEventRequest = Partial<InsertEvent>;
export type CreateRegistrationRequest = InsertRegistration;
export type UpdateRegistrationStatusRequest = { status: "pending" | "confirmed" | "attended" };

// Response types
export type AuthResponse = User;
