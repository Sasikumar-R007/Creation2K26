import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateRegistrationRequest, type UpdateRegistrationStatusRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useRegistrations() {
  return useQuery({
    queryKey: [api.registrations.list.path],
    queryFn: async () => {
      const res = await fetch(api.registrations.list.path);
      if (!res.ok) throw new Error("Failed to fetch registrations");
      return api.registrations.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateRegistration() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateRegistrationRequest) => {
      const res = await fetch(api.registrations.create.path, {
        method: api.registrations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to register");
      }
      return api.registrations.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      toast({ 
        title: "Registration successful!", 
        description: `Your registration ID is ${data.registrationId}. Please save this.` 
      });
    },
    onError: (error) => {
      toast({ 
        title: "Registration failed", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

export function useUpdateRegistrationStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number } & UpdateRegistrationStatusRequest) => {
      const url = buildUrl(api.registrations.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.registrations.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return api.registrations.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.registrations.list.path] });
      toast({ title: "Status updated successfully" });
    },
  });
}
