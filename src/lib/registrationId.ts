/**
 * Generate a registration ID in format: CN2K26P001
 * Format: CN (Creation Nexus) + 2K26 (Year) + P (Participant) + 001 (sequential number)
 */
export async function generateRegistrationId(): Promise<string> {
  const { supabase } = await import("@/integrations/supabase/client");
  
  // Get the count of existing registrations
  const { count, error } = await supabase
    .from("guest_registrations")
    .select("*", { count: "exact", head: true });
  
  if (error) {
    console.error("Error counting registrations:", error);
    // Fallback: use timestamp-based ID
    const timestamp = Date.now().toString().slice(-6);
    return `CN2K26P${timestamp}`;
  }
  
  // Generate ID: CN2K26P + 3-digit sequential number (001, 002, etc.)
  const sequenceNumber = ((count || 0) + 1).toString().padStart(3, "0");
  return `CN2K26P${sequenceNumber}`;
}

