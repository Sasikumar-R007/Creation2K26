import {
  users, events, registrations, announcements,
  type User, type InsertUser,
  type Event, type InsertEvent,
  type Registration, type InsertRegistration,
  type Announcement, type InsertAnnouncement
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";
import type { IStorage } from "./storage";

const MemoryStore = createMemoryStore(session);

export class DbStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Use memory store for sessions even with database
    // For production, consider using connect-pg-simple
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(desc(events.id));
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
    return result[0];
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    // Generate event code
    const existingEvents = await db.select().from(events);
    const eventCode = `CR26E${(existingEvents.length + 1).toString().padStart(2, '0')}`;
    
    const result = await db.insert(events).values({
      ...insertEvent,
      eventCode,
    }).returning();
    return result[0];
  }

  async updateEvent(id: number, updates: Partial<InsertEvent>): Promise<Event> {
    const result = await db.update(events)
      .set(updates)
      .where(eq(events.id, id))
      .returning();
    
    if (result.length === 0) {
      throw new Error("Event not found");
    }
    return result[0];
  }

  async deleteEvent(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  // Registrations
  async createRegistration(insertReg: InsertRegistration): Promise<Registration> {
    const registrationId = `REG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const result = await db.insert(registrations).values({
      ...insertReg,
      registrationId,
    }).returning();
    return result[0];
  }

  async getRegistrations(): Promise<Registration[]> {
    return await db.select().from(registrations).orderBy(desc(registrations.createdAt));
  }

  async getRegistrationsByEvent(eventId: number): Promise<Registration[]> {
    return await db.select().from(registrations)
      .where(eq(registrations.eventId, eventId))
      .orderBy(desc(registrations.createdAt));
  }

  async updateRegistrationStatus(id: number, status: string): Promise<Registration> {
    const result = await db.update(registrations)
      .set({ status: status as "pending" | "confirmed" | "attended" })
      .where(eq(registrations.id, id))
      .returning();
    
    if (result.length === 0) {
      throw new Error("Registration not found");
    }
    return result[0];
  }

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements).orderBy(desc(announcements.createdAt));
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const result = await db.insert(announcements).values(insertAnnouncement).returning();
    return result[0];
  }
}

