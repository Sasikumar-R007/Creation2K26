/**
 * Seed script: Creates 1 admin and 10 Student IC (Event Incharge) users.
 *
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment.
 * Run: SUPABASE_URL=<url> SUPABASE_SERVICE_ROLE_KEY=<key> node scripts/seed-admin-ic-users.mjs
 *
 * Credentials created:
 * - Admin: Creation_admin@creation2k26.com / Creation@123
 * - 10 ICs: <EventName>_admin@creation2k26.com / Studentincharge@123 (one per event)
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing env: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required."
  );
  console.error(
    "Run: SUPABASE_URL=<your-url> SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key> node scripts/seed-admin-ic-users.mjs"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

const ADMIN_EMAIL = "Creation_admin@creation2k26.com";
const ADMIN_PASSWORD = "Creation@123";
const IC_PASSWORD = "Studentincharge@123";

// Event name (as in DB) -> email local part for IC
const IC_EVENT_EMAIL_PARTS = {
  Quiz: "Quiz_admin",
  "Paper Presentation": "Paper_Presentation_admin",
  Debugging: "Debugging_admin",
  "Web Design": "Web_Design_admin",
  "AI Prompt Engineering": "AI_Prompt_Engineering_admin",
  "Ad Zap": "Ad_Zap_admin",
  "Personality Contest": "Personality_Contest_admin",
  "Memory Matrix": "Memory_Matrix_admin",
  "IPL Auction": "IPL_Auction_admin",
  "Movie Spoofing": "Movie_Spoofing_admin",
};

async function main() {
  console.log("Fetching events...");
  const { data: events, error: eventsErr } = await supabase
    .from("events")
    .select("id, name")
    .order("category")
    .order("name");

  if (eventsErr || !events?.length) {
    console.error("Failed to fetch events:", eventsErr?.message || "No events");
    process.exit(1);
  }

  const eventList = events.filter((e) => IC_EVENT_EMAIL_PARTS[e.name] != null);
  if (eventList.length !== 10) {
    console.warn(
      "Expected 10 events for ICs. Found:",
      eventList.length,
      eventList.map((e) => e.name)
    );
  }

  // 1) Create admin user
  console.log("Creating admin user:", ADMIN_EMAIL);
  const { data: adminUser, error: adminErr } =
    await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { name: "Creation Admin" },
    });

  if (adminErr) {
    if (adminErr.message?.includes("already been registered")) {
      console.log("Admin user already exists, updating role...");
      const { data: existing } = await supabase.auth.admin.listUsers();
      const u = existing?.users?.find((x) => x.email === ADMIN_EMAIL);
      if (u) await setAdminRole(u.id);
    } else {
      console.error("Admin create error:", adminErr.message);
      process.exit(1);
    }
  } else if (adminUser?.user?.id) {
    await setAdminRole(adminUser.user.id);
    console.log("Admin created and role set.");
  }

  // 2) Create 10 IC users and assign to events
  for (const event of eventList) {
    const emailPart = IC_EVENT_EMAIL_PARTS[event.name];
    if (!emailPart) continue;
    const email = `${emailPart}@creation2k26.com`;
    const displayName = `${event.name} IC`;

    console.log("Creating IC:", email, "for event:", event.name);
    const { data: icUser, error: icErr } =
      await supabase.auth.admin.createUser({
        email,
        password: IC_PASSWORD,
        email_confirm: true,
        user_metadata: { name: displayName },
      });

    if (icErr) {
      if (icErr.message?.includes("already been registered")) {
        console.log("  IC already exists, ensuring role and incharge...");
        const { data: list } = await supabase.auth.admin.listUsers();
        const u = list?.users?.find((x) => x.email === email);
        if (u) await setICRoleAndIncharge(u.id, event.id, displayName);
      } else {
        console.error("  IC create error:", icErr.message);
      }
      continue;
    }

    if (icUser?.user?.id) {
      await setICRoleAndIncharge(icUser.user.id, event.id, displayName);
      console.log("  IC created and assigned.");
    }
  }

  console.log("\nDone. Summary:");
  console.log("  Admin login:", ADMIN_EMAIL, "/", ADMIN_PASSWORD);
  console.log(
    "  10 ICs: <EventName>_admin@creation2k26.com /",
    IC_PASSWORD
  );
}

async function setAdminRole(userId) {
  const { error } = await supabase
    .from("user_roles")
    .update({ role: "creation_admin" })
    .eq("user_id", userId);
  if (error) {
    console.error("  Failed to set admin role:", error.message);
  }
}

async function setICRoleAndIncharge(userId, eventId, name) {
  const { error: roleErr } = await supabase
    .from("user_roles")
    .update({ role: "student_incharge" })
    .eq("user_id", userId);
  if (roleErr) console.error("  Failed to set IC role:", roleErr.message);

  const { error: icErr } = await supabase.from("student_incharges").upsert(
    { user_id: userId, event_id: eventId, name },
    { onConflict: "event_id" }
  );
  if (icErr) console.error("  Failed to set student_incharge row:", icErr.message);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
