import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { EventRegistration, RegistrationWithEvent } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useMyRegistrations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["registrations", "my", user?.id],
    queryFn: async (): Promise<RegistrationWithEvent[]> => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("event_registrations")
        .select(`
          *,
          events (*)
        `)
        .eq("user_id", user.id)
        .order("registered_at", { ascending: false });

      if (error) throw error;
      return data as RegistrationWithEvent[];
    },
    enabled: !!user?.id,
  });
};

export const useEventRegistrations = (eventId: string | undefined) => {
  return useQuery({
    queryKey: ["registrations", "event", eventId],
    queryFn: async () => {
      if (!eventId) return [];
      
      const { data, error } = await supabase
        .from("event_registrations")
        .select(`
          *,
          profiles:user_id (
            id,
            name,
            email,
            department,
            college
          )
        `)
        .eq("event_id", eventId)
        .order("registered_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });
};

export const useRegisterForEvent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!user?.id) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("event_registrations")
        .insert({
          user_id: user.id,
          event_id: eventId,
        });

      if (error) {
        if (error.code === "23505") {
          throw new Error("Already registered for this event");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      toast({
        title: "Registration Successful! 🎉",
        description: "You have been registered for the event.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUnregisterFromEvent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!user?.id) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("event_registrations")
        .delete()
        .eq("user_id", user.id)
        .eq("event_id", eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      toast({
        title: "Unregistered",
        description: "You have been unregistered from the event.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to unregister",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useAllRegistrations = () => {
  return useQuery({
    queryKey: ["registrations", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_registrations")
        .select(`
          *,
          profiles:user_id (
            id,
            name,
            email,
            department,
            college
          ),
          events (
            id,
            name,
            category
          )
        `)
        .order("registered_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

/** All profiles (sign-ups). Use in admin only. */
export const useAllProfiles = () => {
  return useQuery({
    queryKey: ["profiles", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, department, college, whatsapp_phone, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

/** Guest event registrations (no auth). For admin only. */
export const useGuestRegistrations = () => {
  return useQuery({
    queryKey: ["guest_registrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guest_registrations")
        .select(`
          *,
          event_1:event_1_id (id, name, category),
          event_2:event_2_id (id, name, category)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export type TeamMemberPayload = { name: string; email: string; whatsapp_phone?: string };

/** Submit guest registration (event registration form, no account). */
export const useSubmitGuestRegistration = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      email: string;
      whatsapp_phone?: string;
      department?: string;
      college?: string;
      event_1_id: string;
      event_2_id?: string | null;
      event_1_team_size?: number;
      event_2_team_size?: number | null;
      team_members?: { event_1: TeamMemberPayload[]; event_2: TeamMemberPayload[] };
      payment_screenshot_url?: string | null;
    }) => {
      const { error } = await supabase.from("guest_registrations").insert({
        name: payload.name,
        email: payload.email,
        whatsapp_phone: payload.whatsapp_phone,
        department: payload.department,
        college: payload.college,
        event_1_id: payload.event_1_id,
        event_2_id: payload.event_2_id ?? null,
        event_1_team_size: payload.event_1_team_size ?? null,
        event_2_team_size: payload.event_2_team_size ?? null,
        team_members: payload.team_members ?? null,
        payment_screenshot_url: payload.payment_screenshot_url ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guest_registrations"] });
      toast({
        title: "Registration submitted! 🎉",
        description: "Your event registration has been received.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
};
