import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MessageSquare,
  Trophy,
  Send,
  LogOut,
  User,
  Calendar,
  Loader2,
  LayoutDashboard,
  Megaphone,
  Mail,
  Menu,
  Filter,
  X,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ParticipantTile } from "@/components/dashboard/ParticipantTile";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEventRegistrations } from "@/hooks/useRegistrations";
import { useEventMessages, useSendMessage } from "@/hooks/useMessages";
import { cn } from "@/lib/utils";

type ICMenuId = "dashboard" | "participants" | "announcement" | "messages";

const IC_MENUS: { id: ICMenuId; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "participants", label: "Participants", icon: Users },
  { id: "announcement", label: "Send Announcement", icon: Megaphone },
  { id: "messages", label: "Recent Messages", icon: Mail },
];

const ICDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [messageContent, setMessageContent] = useState("");
  const [activeMenu, setActiveMenu] = useState<ICMenuId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [icRegSearch, setIcRegSearch] = useState("");
  const [icRegDepartment, setIcRegDepartment] = useState<string>("all");
  const [icRegCollege, setIcRegCollege] = useState<string>("all");
  const sendMessage = useSendMessage();

  // Get IC's assigned event
  const { data: icData, isLoading: loadingIC } = useQuery({
    queryKey: ["student_incharge", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("student_incharges")
        .select(`
          *,
          events (*)
        `)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const event = icData?.events;
  const { data: registrations, isLoading: loadingRegistrations } = useEventRegistrations(event?.id);
  const { data: messages, isLoading: loadingMessages } = useEventMessages(event?.id);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !event?.id) return;

    await sendMessage.mutateAsync({
      content: messageContent,
      eventId: event.id,
      messageType: "announcement",
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

  const filteredIcRegistrations = (() => {
    const list = registrations || [];
    const q = icRegSearch.trim().toLowerCase();
    return list.filter((reg: any) => {
      const name = reg.profiles?.name ?? "";
      const email = reg.profiles?.email ?? "";
      if (q && !name.toLowerCase().includes(q) && !email.toLowerCase().includes(q)) return false;
      if (icRegDepartment !== "all" && (reg.profiles?.department || "") !== icRegDepartment) return false;
      if (icRegCollege !== "all" && (reg.profiles?.college || "") !== icRegCollege) return false;
      return true;
    });
  })();
  const icUniqueDepartments = Array.from(
    new Set((registrations || []).map((r: any) => r.profiles?.department).filter(Boolean))
  ).sort();
  const icUniqueColleges = Array.from(
    new Set((registrations || []).map((r: any) => r.profiles?.college).filter(Boolean))
  ).sort();

  if (loadingIC) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!icData || !event) {
    return (
      <div className="min-h-screen bg-background dark">
        <Navbar />
        <main className="container mx-auto px-4 pt-28 pb-16">
          <GlassPanel className="p-8 text-center">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Not Assigned</h2>
            <p className="text-muted-foreground mb-4">
              You are not assigned as an IC for any event yet.
            </p>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Go to Participant Dashboard
            </Button>
          </GlassPanel>
        </main>
      </div>
    );
  }

  const isTechnical = event.category === "technical";

  const renderSidebarNav = () => (
    <nav className="flex flex-col gap-1 p-2">
      {IC_MENUS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => {
            setActiveMenu(id);
            setSidebarOpen(false);
          }}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            activeMenu === id
              ? "bg-primary/20 text-primary border border-primary/30"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          )}
        >
          <Icon className="h-5 w-5 shrink-0" />
          {label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background dark">
      <Navbar />

      <main className="flex gap-0 pt-20 pb-16 min-h-[calc(100vh-5rem)]">
        <div className="fixed top-20 left-4 z-30 md:hidden">
          <Button variant="outline" size="icon" onClick={() => setSidebarOpen(true)} className="bg-background/80 backdrop-blur">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-border/50 bg-card/30 fixed left-0 top-[4.5rem] bottom-0 overflow-y-auto">
          <div className="p-4 border-b border-border/50">
            <Badge
              className={`mb-1 ${
                isTechnical ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"
              }`}
            >
              Student Incharge
            </Badge>
            <p className="text-xs text-muted-foreground truncate">{event.name}</p>
          </div>
          {renderSidebarNav()}
        </aside>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0 bg-card border-border/50">
            <div className="p-4 border-b border-border/50">
              <Badge
                className={`mb-1 ${
                  isTechnical ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"
                }`}
              >
                Student Incharge
              </Badge>
              <p className="text-xs text-muted-foreground truncate">{event.name}</p>
            </div>
            {renderSidebarNav()}
          </SheetContent>
        </Sheet>

        <div className="flex-1 flex flex-col md:pl-56 min-w-0">
          <div className="container mx-auto px-4 pt-6 pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">
                  <span className={isTechnical ? "text-primary" : "text-secondary"}>
                    {event.name}
                  </span>{" "}
                  Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage participants and send announcements
                </p>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <GlassPanel className="p-3 text-center">
                <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xl font-bold">{registrations?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Participants</p>
              </GlassPanel>
              <GlassPanel className="p-3 text-center">
                <MessageSquare className="w-5 h-5 text-secondary mx-auto mb-1" />
                <p className="text-xl font-bold">{messages?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Messages</p>
              </GlassPanel>
              <GlassPanel className="p-3 text-center">
                <Calendar className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-xl font-bold">{isTechnical ? "Tech" : "Non-Tech"}</p>
                <p className="text-xs text-muted-foreground">Category</p>
              </GlassPanel>
              <GlassPanel className="p-3 text-center">
                <Trophy className="w-5 h-5 text-neon-gold mx-auto mb-1" />
                <p className="text-xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">Winners</p>
              </GlassPanel>
            </div>
          </div>

          <div className="flex-1 container mx-auto px-4">
            {activeMenu === "dashboard" && (
              <GlassPanel className="p-6">
                <LayoutDashboard className="w-12 h-12 text-primary/60 mb-4" />
                <h2 className="text-lg font-semibold mb-2">Overview</h2>
                <p className="text-muted-foreground text-sm">
                  Use the sidebar to view Participants, send announcements, or check recent messages.
                </p>
              </GlassPanel>
            )}

            {activeMenu === "participants" && (
              <GlassPanel className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Registered Participants</h2>
                    <p className="text-sm text-muted-foreground">
                      {registrations?.length || 0} participants
                    </p>
                  </div>
                </div>
                {loadingRegistrations ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-12 bg-muted/50 rounded animate-pulse" />
                    ))}
                  </div>
                ) : registrations && registrations.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                      <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                      <Input
                        placeholder="Search name or email..."
                        value={icRegSearch}
                        onChange={(e) => setIcRegSearch(e.target.value)}
                        className="max-w-[200px] h-9"
                      />
                      <Select value={icRegDepartment} onValueChange={setIcRegDepartment}>
                        <SelectTrigger className="w-[160px] h-9">
                          <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          {icUniqueDepartments.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={icRegCollege} onValueChange={setIcRegCollege}>
                        <SelectTrigger className="w-[160px] h-9">
                          <SelectValue placeholder="College" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Colleges</SelectItem>
                          {icUniqueColleges.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 text-muted-foreground"
                        onClick={() => {
                          setIcRegSearch("");
                          setIcRegDepartment("all");
                          setIcRegCollege("all");
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredIcRegistrations.length} of {registrations.length} participants
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredIcRegistrations.map((reg: any) => (
                        <ParticipantTile
                          key={reg.id}
                          name={reg.profiles?.name ?? "Unknown"}
                          email={reg.profiles?.email ?? ""}
                          department={reg.profiles?.department}
                          college={reg.profiles?.college}
                          event1Label={event?.name}
                          date={formatDate(reg.registered_at)}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No participants registered yet</p>
                  </div>
                )}
              </GlassPanel>
            )}

            {activeMenu === "announcement" && (
              <GlassPanel className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Send Announcement</h3>
                    <p className="text-xs text-muted-foreground">Message all participants of this event</p>
                  </div>
                </div>
                <Textarea
                  placeholder="Type your announcement..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={4}
                  className="bg-muted/50 mb-4"
                />
                <NeonButton
                  variant="purple"
                  onClick={handleSendMessage}
                  disabled={!messageContent.trim() || sendMessage.isPending}
                >
                  {sendMessage.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Send to All
                </NeonButton>
              </GlassPanel>
            )}

            {activeMenu === "messages" && (
              <GlassPanel className="p-6">
                <h3 className="font-semibold mb-4">Recent Messages</h3>
                {loadingMessages ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-muted/50 rounded animate-pulse" />
                    ))}
                  </div>
                ) : messages && messages.length > 0 ? (
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className="p-3 rounded-lg bg-muted/30 border-l-2 border-secondary"
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(message.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No messages sent yet
                  </p>
                )}
              </GlassPanel>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ICDashboard;
