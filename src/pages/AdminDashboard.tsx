import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  MessageSquare,
  Trophy,
  Send,
  LogOut,
  BarChart3,
  Loader2,
  Globe,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/hooks/useEvents";
import { useAllRegistrations, useAllProfiles, useGuestRegistrations } from "@/hooks/useRegistrations";
import { useAllMessages, useSendMessage } from "@/hooks/useMessages";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [messageContent, setMessageContent] = useState("");
  
  const { data: events, isLoading: loadingEvents } = useEvents();
  const { data: registrations, isLoading: loadingRegistrations } = useAllRegistrations();
  const { data: profiles, isLoading: loadingProfiles } = useAllProfiles();
  const { data: guestRegistrations, isLoading: loadingGuestRegistrations } = useGuestRegistrations();
  const { data: messages, isLoading: loadingMessages } = useAllMessages();
  const sendMessage = useSendMessage();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleSendGlobalMessage = async () => {
    if (!messageContent.trim()) return;

    await sendMessage.mutateAsync({
      content: messageContent,
      isGlobal: true,
      messageType: "global",
    });

    setMessageContent("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate stats
  const totalRegistrations = registrations?.length || 0;
  const technicalEvents = events?.filter((e) => e.category === "technical") || [];
  const nonTechnicalEvents = events?.filter((e) => e.category === "non_technical") || [];

  // Group registrations by event
  const registrationsByEvent = registrations?.reduce((acc: Record<string, number>, reg: any) => {
    const eventId = reg.event_id;
    acc[eventId] = (acc[eventId] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <div className="min-h-screen bg-background dark">
      <Navbar />

      <main className="container mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Badge className="mb-2 bg-accent/20 text-accent">Admin</Badge>
            <h1 className="text-3xl font-bold">
              <span className="gradient-text">CREATION 2K26</span> Admin Panel
            </h1>
            <p className="text-muted-foreground">
              Monitor all events and manage the symposium
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <GlassPanel className="p-4 text-center" glow="cyan">
            <BarChart3 className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{events?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Total Events</p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center" glow="purple">
            <Users className="w-6 h-6 text-secondary mx-auto mb-2" />
            <p className="text-2xl font-bold">{profiles?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Total Sign-ups</p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center">
            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{totalRegistrations}</p>
            <p className="text-xs text-muted-foreground">Event Registrations</p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center">
            <MessageSquare className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold">{messages?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Messages Sent</p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center">
            <Trophy className="w-6 h-6 text-neon-gold mx-auto mb-2" />
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">Winners Declared</p>
          </GlassPanel>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <GlassPanel className="p-6">
              <Tabs defaultValue="guest-registrations">
                <TabsList className="mb-6">
                  <TabsTrigger value="events">Events Overview</TabsTrigger>
                  <TabsTrigger value="guest-registrations">Event Registrations</TabsTrigger>
                  <TabsTrigger value="signups">All Sign-ups</TabsTrigger>
                  <TabsTrigger value="registrations">Auth Event Reg.</TabsTrigger>
                  <TabsTrigger value="messages">All Messages</TabsTrigger>
                </TabsList>

                <TabsContent value="events">
                  {loadingEvents ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Technical Events */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-primary">
                          Technical Events ({technicalEvents.length})
                        </h3>
                        <div className="grid gap-4">
                          {technicalEvents.map((event) => (
                            <div
                              key={event.id}
                              className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                            >
                              <div>
                                <h4 className="font-medium">{event.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  IC: {event.student_incharges?.[0]?.name || "Not assigned"}
                                </p>
                              </div>
                              <Badge className="bg-primary/20 text-primary">
                                {registrationsByEvent[event.id] || 0} registered
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Non-Technical Events */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-secondary">
                          Non-Technical Events ({nonTechnicalEvents.length})
                        </h3>
                        <div className="grid gap-4">
                          {nonTechnicalEvents.map((event) => (
                            <div
                              key={event.id}
                              className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                            >
                              <div>
                                <h4 className="font-medium">{event.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  IC: {event.student_incharges?.[0]?.name || "Not assigned"}
                                </p>
                              </div>
                              <Badge className="bg-secondary/20 text-secondary">
                                {registrationsByEvent[event.id] || 0} registered
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="guest-registrations">
                  {loadingGuestRegistrations ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : guestRegistrations && guestRegistrations.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Event 1</TableHead>
                            <TableHead>Event 2</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>College</TableHead>
                            <TableHead>Registered</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {guestRegistrations.slice(0, 50).map((g: any) => (
                            <TableRow key={g.id}>
                              <TableCell className="font-medium">{g.name || "-"}</TableCell>
                              <TableCell className="text-muted-foreground">{g.email || "-"}</TableCell>
                              <TableCell>
                                <Badge className="bg-primary/20 text-primary">
                                  {g.event_1?.name || "-"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {g.event_2?.name ? (
                                  <Badge className="bg-secondary/20 text-secondary">
                                    {g.event_2.name}
                                  </Badge>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell>{g.department || "-"}</TableCell>
                              <TableCell>{g.college || "-"}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {formatDate(g.created_at)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {guestRegistrations.length > 50 && (
                        <p className="text-center text-sm text-muted-foreground mt-4">
                          Showing 50 of {guestRegistrations.length} registrations
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No event registrations yet</p>
                      <p className="text-sm text-muted-foreground mt-1">Submissions from the Register page will appear here.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="signups">
                  {loadingProfiles ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : profiles && profiles.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>College</TableHead>
                            <TableHead>WhatsApp</TableHead>
                            <TableHead>Signed up</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {profiles.slice(0, 50).map((p: any) => (
                            <TableRow key={p.id}>
                              <TableCell className="font-medium">{p.name || "-"}</TableCell>
                              <TableCell className="text-muted-foreground">{p.email || "-"}</TableCell>
                              <TableCell>{p.department || "-"}</TableCell>
                              <TableCell>{p.college || "-"}</TableCell>
                              <TableCell>{p.whatsapp_phone || "-"}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {formatDate(p.created_at)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {profiles.length > 50 && (
                        <p className="text-center text-sm text-muted-foreground mt-4">
                          Showing 50 of {profiles.length} sign-ups
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No sign-ups yet</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="registrations">
                  {loadingRegistrations ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : registrations && registrations.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>Registered</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {registrations.slice(0, 20).map((reg: any) => (
                            <TableRow key={reg.id}>
                              <TableCell className="font-medium">
                                {reg.profiles?.name || "Unknown"}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {reg.profiles?.email || "-"}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    reg.events?.category === "technical"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className={
                                    reg.events?.category === "technical"
                                      ? "bg-primary/20 text-primary"
                                      : "bg-secondary/20 text-secondary"
                                  }
                                >
                                  {reg.events?.name || "Unknown"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {formatDate(reg.registered_at)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {registrations.length > 20 && (
                        <p className="text-center text-sm text-muted-foreground mt-4">
                          Showing 20 of {registrations.length} registrations
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No registrations yet</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="messages">
                  {loadingMessages ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : messages && messages.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className="p-4 rounded-lg bg-muted/30 border-l-2 border-accent"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {message.is_global ? "Global" : message.events?.name || "Unknown"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              by {message.profiles?.name || "Unknown"}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDate(message.created_at)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No messages sent yet</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </GlassPanel>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Global Announcement */}
            <GlassPanel className="p-6" glow="gold">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Global Announcement</h3>
                  <p className="text-xs text-muted-foreground">
                    Message all participants
                  </p>
                </div>
              </div>

              <Textarea
                placeholder="Type your global announcement..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={4}
                className="bg-muted/50 mb-4"
              />

              <NeonButton
                variant="gold"
                className="w-full"
                onClick={handleSendGlobalMessage}
                disabled={!messageContent.trim() || sendMessage.isPending}
              >
                {sendMessage.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Broadcast to All
              </NeonButton>
            </GlassPanel>

            {/* Quick Stats */}
            <GlassPanel className="p-6">
              <h3 className="font-semibold mb-4">Registration Stats</h3>
              <div className="space-y-4">
                {events?.slice(0, 5).map((event) => {
                  const count = registrationsByEvent[event.id] || 0;
                  const isTechnical = event.category === "technical";
                  return (
                    <div key={event.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="truncate">{event.name}</span>
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isTechnical ? "bg-primary" : "bg-secondary"
                          }`}
                          style={{ width: `${Math.min((count / 50) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassPanel>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
