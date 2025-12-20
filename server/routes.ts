import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === AUTH SETUP ===
  app.use(
    session({
      store: storage.sessionStore,
      secret: process.env.SESSION_SECRET || "default_secret",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) return done(null, false);
        
        const isValid = await comparePasswords(password, user.password);
        if (!isValid) return done(null, false);
        
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // === AUTH ROUTES ===
  app.post(api.auth.login.path, passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.post(api.auth.logout.path, (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get(api.auth.me.path, (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not logged in" });
    res.json(req.user);
  });

  // Middleware for protected routes
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    next();
  };

  // === EVENT ROUTES ===
  app.get(api.events.list.path, async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.get(api.events.get.path, async (req, res) => {
    const event = await storage.getEvent(Number(req.params.id));
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  });

  app.post(api.events.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.events.create.input.parse(req.body);
      const event = await storage.createEvent(input);
      res.status(201).json(event);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  app.put(api.events.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.events.update.input.parse(req.body);
      const event = await storage.updateEvent(Number(req.params.id), input);
      if (!event) return res.status(404).json({ message: "Event not found" });
      res.json(event);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  app.delete(api.events.delete.path, requireAuth, async (req, res) => {
    await storage.deleteEvent(Number(req.params.id));
    res.sendStatus(204);
  });

  // === REGISTRATION ROUTES ===
  app.post(api.registrations.create.path, async (req, res) => {
    try {
      const input = api.registrations.create.input.parse(req.body);
      // Auto-generate a registration ID
      const registrationId = `REG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const registration = await storage.createRegistration({ ...input, registrationId });
      res.status(201).json(registration);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  app.get(api.registrations.list.path, requireAuth, async (req, res) => {
    const registrations = await storage.getRegistrations();
    res.json(registrations);
  });

  app.patch(api.registrations.updateStatus.path, requireAuth, async (req, res) => {
    try {
      const { status } = api.registrations.updateStatus.input.parse(req.body);
      const registration = await storage.updateRegistrationStatus(Number(req.params.id), status as any);
      if (!registration) return res.status(404).json({ message: "Registration not found" });
      res.json(registration);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  // === ANNOUNCEMENT ROUTES ===
  app.get(api.announcements.list.path, async (req, res) => {
    const announcements = await storage.getAnnouncements();
    res.json(announcements);
  });

  app.post(api.announcements.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.announcements.create.input.parse(req.body);
      const announcement = await storage.createAnnouncement(input);
      res.status(201).json(announcement);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  // === SEED DATA ===
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingUsers = await storage.getUserByUsername("admin");
  if (!existingUsers) {
    const hashedPassword = await hashPassword("admin123");
    await storage.createUser({
      username: "admin",
      password: hashedPassword,
      name: "Super Admin",
      role: "admin",
    });
    console.log("Admin user seeded: admin / admin123");
  }

  const existingEvents = await storage.getEvents();
  if (existingEvents.length === 0) {
    // TECHNICAL EVENTS
    await storage.createEvent({
      title: "Hackathon 2025",
      description: "24-hour coding marathon to build innovative solutions. Build your dream app from scratch.",
      category: "technical",
      rules: "Max 4 members. Bring your own laptop. Use any programming language.",
      teamSize: 4,
      fee: 500,
      date: new Date("2026-03-08T09:00:00"),
      venue: "Main Auditorium",
      imageUrl: "https://images.unsplash.com/photo-1504384308090-c54be3855091",
    });

    await storage.createEvent({
      title: "Robo Wars",
      description: "Battle of the bots in the arena. Showcase your robotics and automation skills.",
      category: "technical",
      rules: "Weight limit 5kg. Autonomous bots only. No flamethrowers.",
      teamSize: 3,
      fee: 300,
      date: new Date("2026-03-08T10:00:00"),
      venue: "Open Ground",
      imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    });

    await storage.createEvent({
      title: "Web Development Showdown",
      description: "Build a responsive web app in 6 hours. Best UI/UX wins.",
      category: "technical",
      rules: "Teams of 2-3. Use any framework. Must be mobile-responsive.",
      teamSize: 3,
      fee: 250,
      date: new Date("2026-03-08T14:00:00"),
      venue: "Lab 104",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    });

    await storage.createEvent({
      title: "AI/ML Challenge",
      description: "Solve real-world problems with machine learning. Predict, classify, and optimize.",
      category: "technical",
      rules: "Teams of 2-4. Datasets provided. Python/R recommended.",
      teamSize: 4,
      fee: 350,
      date: new Date("2026-03-08T13:00:00"),
      venue: "Lab 305",
      imageUrl: "https://images.unsplash.com/photo-1677442d019cecf8978f4147cf10ed9b468f51aea",
    });

    await storage.createEvent({
      title: "Cybersecurity CTF",
      description: "Capture The Flag - find vulnerabilities and secure the systems.",
      category: "technical",
      rules: "Teams of 3-5. No physical attacks. Ethical hacking only.",
      teamSize: 5,
      fee: 300,
      date: new Date("2026-03-08T09:00:00"),
      venue: "Lab 202",
      imageUrl: "https://images.unsplash.com/photo-1550355291-bbee04a92027",
    });

    await storage.createEvent({
      title: "Mobile App Development",
      description: "Create a feature-rich mobile application. iOS, Android, or Flutter.",
      category: "technical",
      rules: "Teams of 2-3. 8-hour competition.",
      teamSize: 3,
      fee: 300,
      date: new Date("2026-03-08T16:00:00"),
      venue: "Lab 106",
      imageUrl: "https://images.unsplash.com/photo-1512941691920-25bdb7edecc1",
    });

    await storage.createEvent({
      title: "IoT & Embedded Systems",
      description: "Design smart solutions with IoT. Arduino, Raspberry Pi welcome.",
      category: "technical",
      rules: "Teams of 3. Components provided.",
      teamSize: 3,
      fee: 280,
      date: new Date("2026-03-08T15:00:00"),
      venue: "Lab 401",
      imageUrl: "https://images.unsplash.com/photo-1518432031498-74d440642117",
    });

    // NON-TECHNICAL EVENTS
    await storage.createEvent({
      title: "Gaming Tournament",
      description: "Valorant and FIFA championship. Compete for glory and prizes.",
      category: "non-technical",
      rules: "5v5 Valorant. Singles/Doubles FIFA. Knockout format.",
      teamSize: 5,
      fee: 200,
      date: new Date("2026-03-08T14:00:00"),
      venue: "Lab 204",
      imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
    });

    await storage.createEvent({
      title: "Debate Championship",
      description: "Parliamentary debate on emerging tech trends and social impact.",
      category: "non-technical",
      rules: "Teams of 3. 15 min prep, 30 min debate.",
      teamSize: 3,
      fee: 100,
      date: new Date("2026-03-08T10:00:00"),
      venue: "Auditorium B",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    });

    await storage.createEvent({
      title: "Quiz Challenge",
      description: "General knowledge and tech trivia. Test your brains!",
      category: "non-technical",
      rules: "Teams of 2. 60 minutes. Multiple rounds.",
      teamSize: 2,
      fee: 80,
      date: new Date("2026-03-08T11:00:00"),
      venue: "Classroom 101",
      imageUrl: "https://images.unsplash.com/photo-1453614512568-c4024d13c247",
    });

    await storage.createEvent({
      title: "Business Case Competition",
      description: "Solve complex business problems. Pitch your solutions to judges.",
      category: "non-technical",
      rules: "Teams of 4. Case given on day. 4 hours to present.",
      teamSize: 4,
      fee: 300,
      date: new Date("2026-03-08T14:00:00"),
      venue: "Conference Hall",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    });

    await storage.createEvent({
      title: "Creative Poster Design",
      description: "Design eye-catching posters. Topics: Innovation, Tech for Good, Future Society.",
      category: "non-technical",
      rules: "Individual. Digital or Physical. Judging by design committee.",
      teamSize: 1,
      fee: 150,
      date: new Date("2026-03-08T11:00:00"),
      venue: "Design Studio",
      imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
    });

    await storage.createEvent({
      title: "Short Film Festival",
      description: "Create and showcase a 5-minute short film. Any genre welcome.",
      category: "non-technical",
      rules: "Teams of 3-5. 48-hour creation window.",
      teamSize: 5,
      fee: 250,
      date: new Date("2026-03-08T18:00:00"),
      venue: "Auditorium Main",
      imageUrl: "https://images.unsplash.com/photo-1485095329183-d0ddc3500664",
    });

    await storage.createEvent({
      title: "Startup Pitch",
      description: "Pitch your innovative startup idea. Win investments and mentorship.",
      category: "non-technical",
      rules: "Teams of 3-4. 5 min pitch + 5 min Q&A.",
      teamSize: 4,
      fee: 200,
      date: new Date("2026-03-08T16:00:00"),
      venue: "Board Room",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    });

    await storage.createEvent({
      title: "Photography Exhibition",
      description: "Capture the essence of technology and innovation. Best photo wins!",
      category: "non-technical",
      rules: "Individual. 5 photos max. Theme: Tech & Nature.",
      teamSize: 1,
      fee: 100,
      date: new Date("2026-03-08T12:00:00"),
      venue: "Gallery Space",
      imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd",
    });

    console.log("Symposium events seeded successfully!");
  }
}
