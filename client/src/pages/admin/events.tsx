import { useAuth } from "@/hooks/use-auth";
import { useEvents, useCreateEvent, useDeleteEvent } from "@/hooks/use-events";
import { useLocation, Link } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Calendar, Users, LogOut, Plus, Trash2, Edit2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertEventSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

// Schema for event form with coercion
const eventFormSchema = insertEventSchema.extend({
  fee: z.coerce.number(),
  teamSize: z.coerce.number(),
  coordinatorId: z.coerce.number().optional(),
  date: z.coerce.date(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export default function AdminEvents() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { mutate: deleteEvent } = useDeleteEvent();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/admin/login");
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || eventsLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }
  
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar - Duplicated for simplicity, ideally a component */}
      <aside className="w-64 bg-card border-r border-white/5 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold font-display">Admin Portal</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard">
             <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-white">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
             </Button>
          </Link>
          <Link href="/admin/events">
             <Button variant="secondary" className="w-full justify-start gap-2">
                <Calendar className="w-4 h-4" /> Manage Events
             </Button>
          </Link>
          <Link href="/admin/registrations">
             <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-white">
                <Users className="w-4 h-4" /> Registrations
             </Button>
          </Link>
        </nav>
        <div className="p-4 border-t border-white/5">
           <Button variant="destructive" className="w-full gap-2" onClick={() => logout()}>
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
           <h1 className="text-3xl font-display font-bold">Manage Events</h1>
           <CreateEventDialog />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event) => (
            <Card key={event.id} className="bg-card border-white/10 hover:border-primary/50 transition-colors">
               <CardHeader className="flex flex-row items-start justify-between pb-2">
                 <div className="flex-1">
                   <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                   <span className="text-xs text-muted-foreground uppercase tracking-wider">{event.category}</span>
                 </div>
               </CardHeader>
               <CardContent>
                 <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex justify-between">
                       <span>Date:</span>
                       <span className="text-white">{format(new Date(event.date), "MMM d, h:mm a")}</span>
                    </div>
                    <div className="flex justify-between">
                       <span>Fee:</span>
                       <span className="text-white">₹{event.fee}</span>
                    </div>
                    <div className="flex justify-between">
                       <span>Venue:</span>
                       <span className="text-white">{event.venue}</span>
                    </div>
                 </div>
                 
                 <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 border-white/10 hover:bg-white/5">
                       <Edit2 className="w-3 h-3 mr-2" /> Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="px-3"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this event?')) {
                          deleteEvent(event.id);
                        }
                      }}
                    >
                       <Trash2 className="w-3 h-3" />
                    </Button>
                 </div>
               </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

function CreateEventDialog() {
  const { mutate: createEvent, isPending } = useCreateEvent();
  const [open, setOpen] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "technical",
      rules: "",
      venue: "",
      fee: 0,
      teamSize: 1,
      date: new Date(),
    },
  });

  const onSubmit = (data: EventFormValues) => {
    createEvent(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Hackathon 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="non-technical">Non-Technical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue</FormLabel>
                    <FormControl>
                      <Input placeholder="Auditorium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Short description..." className="h-20" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rules</FormLabel>
                  <FormControl>
                    <Textarea placeholder="1. Rule one..." className="h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-3 gap-4">
               <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fee (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Size</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating..." : "Create Event"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
