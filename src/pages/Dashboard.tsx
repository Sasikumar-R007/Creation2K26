import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MessageSquare,
  Bell,
  LogOut,
  User,
  ChevronRight,
  Sparkles,
  Clock,
  Trash2,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMyRegistrations, useUnregisterFromEvent } from "@/hooks/useRegistrations";
import { useMyMessages } from "@/hooks/useMessages";
import { useEvents, EventData } from "@/hooks/useEvents";
import EventModal from "@/components/events/EventModal";

// Dynamic icon component
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Sparkles;
  return <Icon className={className} />;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: registrations, isLoading: loadingRegistrations } = useMyRegistrations();
  const { data: messages, isLoading: loadingMessages } = useMyMessages();
  const { data: events } = useEvents();
  const unregisterMutation = useUnregisterFromEvent();
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  const handleUnregister = async (eventId: string) => {
    try {
      await unregisterMutation.mutateAsync(eventId);
    } catch {
      // toast already shown in mutation onError
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Get unregistered events
  const registeredEventIds = new Set(registrations?.map((r) => r.event_id) || []);
  const unregisteredEvents = events?.filter((e) => !registeredEventIds.has(e.id)) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background dark">
      <Navbar />

      <main className="container mx-auto px-4 pt-28 pb-16">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{user?.profile?.name || "Participant"}</span>!
          </h1>
          <p className="text-muted-foreground">
            Manage your event registrations and stay updated with announcements.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Registered Events */}
            <GlassPanel className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Your Registered Events</h2>
                    <p className="text-sm text-muted-foreground">
                      {registrations?.length || 0} events registered
                    </p>
                  </div>
                </div>
              </div>

              {loadingRegistrations ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-muted/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : registrations && registrations.length > 0 ? (
                <div className="space-y-4">
                  {registrations.map((registration) => {
                    const event = registration.events;
                    if (!event) return null;
                    const isTechnical = event.category === "technical";

                    return (
                      <div
                        key={registration.id}
                        className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                        onClick={() => setSelectedEvent(event as unknown as EventData)}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                            isTechnical ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                          }`}
                        >
                          <DynamicIcon name={event.icon_name} className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate">{event.name}</h3>
                            <Badge
                              variant={isTechnical ? "default" : "secondary"}
                              className={`text-xs ${
                                isTechnical
                                  ? "bg-primary/20 text-primary"
                                  : "bg-secondary/20 text-secondary"
                              }`}
                            >
                              {isTechnical ? "Tech" : "Non-Tech"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Registered {formatDate(registration.registered_at)}
                          </p>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0 opacity-70 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                              onClick={(e) => e.stopPropagation()}
                              title="Remove registration"
                              disabled={unregisterMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove registration?</AlertDialogTitle>
                              <AlertDialogDescription>
                                You will be unregistered from <strong>{event.name}</strong>. You can register again later if spots are available.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => handleUnregister(registration.event_id)}
                              >
                                Remove registration
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">You haven't registered for any events yet.</p>
                  <NeonButton onClick={() => navigate("/#events")}>
                    <Sparkles className="w-4 h-4" />
                    Explore Events
                  </NeonButton>
                </div>
              )}
            </GlassPanel>

            {/* Quick Register */}
            {unregisteredEvents.length > 0 && (
              <GlassPanel className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">More Events</h2>
                    <p className="text-sm text-muted-foreground">
                      Register for more exciting events
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {unregisteredEvents.slice(0, 4).map((event) => {
                    const isTechnical = event.category === "technical";
                    return (
                      <div
                        key={event.id}
                        className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isTechnical ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                            }`}
                          >
                            <DynamicIcon name={event.icon_name} className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{event.name}</h3>
                            <p className={`text-xs ${isTechnical ? "text-primary" : "text-secondary"}`}>
                              {isTechnical ? "Technical" : "Non-Technical"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {unregisteredEvents.length > 4 && (
                  <Button
                    variant="ghost"
                    className="w-full mt-4"
                    onClick={() => navigate("/#events")}
                  >
                    View all {unregisteredEvents.length} events
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </GlassPanel>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <GlassPanel className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{user?.profile?.name || "User"}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                {user?.profile?.department && (
                  <p className="text-muted-foreground">
                    <span className="text-foreground">Department:</span> {user.profile.department}
                  </p>
                )}
                {user?.profile?.college && (
                  <p className="text-muted-foreground">
                    <span className="text-foreground">College:</span> {user.profile.college}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </GlassPanel>

            {/* Messages */}
            <GlassPanel className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">Announcements</h3>
                  <p className="text-xs text-muted-foreground">
                    {messages?.length || 0} messages
                  </p>
                </div>
              </div>

              {loadingMessages ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : messages && messages.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {messages.slice(0, 5).map((message) => (
                    <div
                      key={message.id}
                      className="p-3 rounded-lg bg-muted/30 border-l-2 border-secondary"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="w-3 h-3 text-secondary" />
                        <span className="text-xs font-medium text-secondary">
                          {message.events?.name || "Global"}
                        </span>
                      </div>
                      <p className="text-sm line-clamp-2">{message.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(message.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No announcements yet
                </p>
              )}
            </GlassPanel>
          </div>
        </div>
      </main>

      <Footer />

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
