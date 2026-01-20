import {
  users, events, registrations, announcements,
  type User, type InsertUser,
  type Event, type InsertEvent,
  type Registration, type InsertRegistration,
  type Announcement, type InsertAnnouncement
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { DbStorage } from "./db-storage";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User & Auth
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: number): Promise<void>;

  // Registrations
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrations(): Promise<Registration[]>; // Admin view
  getRegistrationsByEvent(eventId: number): Promise<Registration[]>;
  updateRegistrationStatus(id: number, status: string): Promise<Registration>;

  // Announcements
  getAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private registrations: Map<number, Registration>;
  private announcements: Map<number, Announcement>;
  sessionStore: session.Store;
  currentUserId: number;
  currentEventId: number;
  currentRegistrationId: number;
  currentAnnouncementId: number;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.registrations = new Map();
    this.announcements = new Map();
    this.currentUserId = 1;
    this.currentEventId = 1;
    this.currentRegistrationId = 1;
    this.currentAnnouncementId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      role: insertUser.role || "volunteer"
    };
    this.users.set(id, user);
    return user;
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.currentEventId++;
    const eventCode = `CR26E${id.toString().padStart(2, '0')}`;
    const event: Event = {
      ...insertEvent,
      id,
      imageUrl: insertEvent.imageUrl || null,
      coordinatorId: insertEvent.coordinatorId || null,
      eventCode,
      teamSize: insertEvent.teamSize || 1,
      fee: insertEvent.fee || 0
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, updates: Partial<InsertEvent>): Promise<Event> {
    const event = this.events.get(id);
    if (!event) throw new Error("Event not found");
    const updatedEvent = { ...event, ...updates };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<void> {
    this.events.delete(id);
  }

  // Registrations
  async createRegistration(insertReg: InsertRegistration): Promise<Registration> {
    const id = this.currentRegistrationId++;
    const registration: Registration = {
      ...insertReg,
      id,
      status: "pending",
      createdAt: new Date(),
      registrationId: insertReg.registrationId || `REG-${id}-${Date.now()}`,
      teamDetails: insertReg.teamDetails || null
    };
    this.registrations.set(id, registration);
    return registration;
  }

  async getRegistrations(): Promise<Registration[]> {
    return Array.from(this.registrations.values()).sort((a, b) =>
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getRegistrationsByEvent(eventId: number): Promise<Registration[]> {
    return Array.from(this.registrations.values()).filter(
      (reg) => reg.eventId === eventId
    );
  }

  async updateRegistrationStatus(id: number, status: string): Promise<Registration> {
    const registration = this.registrations.get(id);
    if (!registration) throw new Error("Registration not found");
    // @ts-ignore
    const updatedReg: Registration = { ...registration, status };
    this.registrations.set(id, updatedReg);
    return updatedReg;
  }

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values()).sort((a, b) =>
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const id = this.currentAnnouncementId++;
    const announcement: Announcement = { ...insertAnnouncement, id, createdAt: new Date() };
    this.announcements.set(id, announcement);
    return announcement;
  }
}

// Use database storage if DATABASE_URL is set, otherwise use in-memory storage
// Check if DATABASE_URL is a valid PostgreSQL connection string (not the dummy one)
const useDatabase = process.env.DATABASE_URL && 
  process.env.DATABASE_URL !== "postgres://dummy:dummy@localhost:5432/dummy" &&
  !process.env.DATABASE_URL.includes("dummy");

export const storage = useDatabase ? new DbStorage() : new MemStorage();
