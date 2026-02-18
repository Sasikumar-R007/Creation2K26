import { useState, useEffect, useMemo } from "react";
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
  LayoutDashboard,
  ClipboardList,
  UserPlus,
  FileCheck,
  List,
  Mail,
  Menu,
  Filter,
  X,
  Download,
  Check,
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
import { useEvents } from "@/hooks/useEvents";
import { useAllRegistrations, useAllProfiles, useGuestRegistrations } from "@/hooks/useRegistrations";
import { useAllMessages, useSendMessage } from "@/hooks/useMessages";
import { cn } from "@/lib/utils";
import { exportData, AVAILABLE_COLUMNS, type ExportFormat, type ColumnOption } from "@/utils/exportData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

type AdminMenuId = "dashboard" | "events" | "guest-registrations" | "signups" | "registrations" | "messages";

const ADMIN_MENUS: { id: AdminMenuId; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "events", label: "Events Overview", icon: BarChart3 },
  { id: "guest-registrations", label: "Event Registrations", icon: ClipboardList },
  { id: "signups", label: "All Sign-ups", icon: UserPlus },
  { id: "registrations", label: "Auth Event Reg.", icon: FileCheck },
  { id: "messages", label: "All Messages", icon: Mail },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [messageContent, setMessageContent] = useState("");
  const [activeMenu, setActiveMenu] = useState<AdminMenuId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Event registration filters
  const [regSearch, setRegSearch] = useState("");
  const [regEvent1, setRegEvent1] = useState<string>("all");
  const [regEvent2, setRegEvent2] = useState<string>("all");
  const [regDepartment, setRegDepartment] = useState<string>("all");
  const [regCollege, setRegCollege] = useState<string>("all");
  
  // Download dialog state
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<ExportFormat>("excel");
  const [downloadEventId, setDownloadEventId] = useState<string>("all");
  const [downloadColumns, setDownloadColumns] = useState<ColumnOption[]>(
    AVAILABLE_COLUMNS.map(col => ({ ...col, enabled: false }))
  );
  const { toast } = useToast();
  
  // Registration stats modal state
  const [statsModalOpen, setStatsModalOpen] = useState(false);

  // Fetch data hooks - must be declared first
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
  // Total Sign-ups = All user profiles (people who created accounts)
  const totalSignUps = profiles?.length || 0;
  
  // Event Registrations = Auth registrations + Guest registrations
  const totalAuthRegistrations = registrations?.length || 0;
  const totalGuestRegistrations = guestRegistrations?.length || 0;
  const totalRegistrations = totalAuthRegistrations + totalGuestRegistrations;
  
  const technicalEvents = events?.filter((e) => e.category === "technical") || [];
  const nonTechnicalEvents = events?.filter((e) => e.category === "non_technical") || [];

  // Group auth registrations by event
  const registrationsByEvent = registrations?.reduce((acc: Record<string, number>, reg: any) => {
    const eventId = reg.event_id;
    acc[eventId] = (acc[eventId] || 0) + 1;
    return acc;
  }, {}) || {};

  // Group guest registrations by event (event_1 and event_2)
  const guestRegistrationsByEvent = (guestRegistrations || []).reduce((acc: Record<string, number>, reg: any) => {
    if (reg.event_1_id) {
      acc[reg.event_1_id] = (acc[reg.event_1_id] || 0) + 1;
    }
    if (reg.event_2_id) {
      acc[reg.event_2_id] = (acc[reg.event_2_id] || 0) + 1;
    }
    return acc;
  }, {});

  // Combine both registration types
  const allRegistrationsByEvent = events?.reduce((acc: Record<string, number>, event) => {
    acc[event.id] = (registrationsByEvent[event.id] || 0) + (guestRegistrationsByEvent[event.id] || 0);
    return acc;
  }, {}) || {};

  // Find max registration count for progress bars
  const maxRegistrationCount = Math.max(...Object.values(allRegistrationsByEvent), 1);

  // Prepare chart data for registration stats
  const chartData = useMemo(() => {
    if (!events) return [];
    return events.map(event => {
      const count = allRegistrationsByEvent[event.id] || 0;
      const isTechnical = event.category === "technical";
      return {
        name: event.name,
        registrations: count,
        category: isTechnical ? "Technical" : "Non-Technical",
        color: isTechnical ? "hsl(var(--primary))" : "hsl(var(--secondary))",
      };
    }).sort((a, b) => b.registrations - a.registrations);
  }, [events, allRegistrationsByEvent]);

  const chartConfig = {
    registrations: {
      label: "Registrations",
      color: "hsl(var(--primary))",
    },
  };

  // Filter guest registrations
  const filteredGuestRegistrations = (() => {
    const list = guestRegistrations || [];
    const q = regSearch.trim().toLowerCase();
    return list.filter((g: any) => {
      if (q && !(g.name?.toLowerCase().includes(q) || g.email?.toLowerCase().includes(q))) return false;
      if (regEvent1 !== "all" && g.event_1_id !== regEvent1) return false;
      if (regEvent2 !== "all" && g.event_2_id !== regEvent2) return false;
      if (regDepartment !== "all" && (g.department || "") !== regDepartment) return false;
      if (regCollege !== "all" && (g.college || "") !== regCollege) return false;
      return true;
    });
  })();
  const uniqueDepartments = Array.from(
    new Set((guestRegistrations || []).map((g: any) => g.department).filter(Boolean))
  ).sort();
  const uniqueColleges = Array.from(
    new Set((guestRegistrations || []).map((g: any) => g.college).filter(Boolean))
  ).sort();

  const renderSidebarNav = () => (
    <nav className="flex flex-col gap-1 p-2">
      {ADMIN_MENUS.map(({ id, label, icon: Icon }) => (
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
        {/* Mobile menu button */}
        <div className="fixed top-20 left-4 z-30 md:hidden">
          <Button variant="outline" size="icon" onClick={() => setSidebarOpen(true)} className="bg-background/80 backdrop-blur">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar - desktop */}
        <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-border/50 bg-card/30 fixed left-0 top-[4.5rem] bottom-0 overflow-y-auto">
          <div className="p-4 border-b border-border/50">
            <Badge className="mb-1 bg-accent/20 text-accent">Admin</Badge>
            <p className="text-xs text-muted-foreground">CREATION 2K26</p>
          </div>
          {renderSidebarNav()}
        </aside>

        {/* Sidebar - mobile */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0 bg-card border-border/50">
            <div className="p-4 border-b border-border/50">
              <Badge className="mb-1 bg-accent/20 text-accent">Admin</Badge>
              <p className="text-xs text-muted-foreground">CREATION 2K26</p>
            </div>
            {renderSidebarNav()}
          </SheetContent>
        </Sheet>

        {/* Main content area - offset for fixed sidebar on desktop */}
        <div className="flex-1 flex flex-col md:pl-56 min-w-0">
          <div className="container mx-auto px-4 pt-6 pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">
                  <span className="gradient-text">CREATION 2K26</span> Admin Panel
                </h1>
                <p className="text-sm text-muted-foreground">
                  Monitor all events and manage the symposium
                </p>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Stats - show on dashboard or always above content */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              <GlassPanel className="p-3 text-center" glow="cyan">
                <BarChart3 className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xl font-bold">{events?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Total Events</p>
              </GlassPanel>
              <GlassPanel className="p-3 text-center" glow="purple">
                <Users className="w-5 h-5 text-secondary mx-auto mb-1" />
                <p className="text-xl font-bold">{totalSignUps}</p>
                <p className="text-xs text-muted-foreground">Total Sign-ups</p>
              </GlassPanel>
              <Dialog open={statsModalOpen} onOpenChange={setStatsModalOpen}>
                <DialogTrigger asChild>
                  <GlassPanel className="p-3 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-xl font-bold">{totalRegistrations}</p>
                    <p className="text-xs text-muted-foreground">Event Reg.</p>
                  </GlassPanel>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Event Registration Statistics</DialogTitle>
                    <DialogDescription>
                      Bar chart showing the number of participants registered for each event
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-6">
                    <ChartContainer config={chartConfig} className="h-[500px] w-full">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={120}
                          className="text-xs"
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        />
                        <YAxis
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                          className="text-xs"
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="registrations"
                          radius={[8, 8, 0, 0]}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Technical Events</h4>
                      <div className="space-y-1 text-xs">
                        {chartData.filter(e => e.category === "Technical").map(event => (
                          <div key={event.name} className="flex justify-between">
                            <span className="text-muted-foreground">{event.name}</span>
                            <span className="font-medium">{event.registrations}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Non-Technical Events</h4>
                      <div className="space-y-1 text-xs">
                        {chartData.filter(e => e.category === "Non-Technical").map(event => (
                          <div key={event.name} className="flex justify-between">
                            <span className="text-muted-foreground">{event.name}</span>
                            <span className="font-medium">{event.registrations}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <GlassPanel className="p-3 text-center">
                <MessageSquare className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-xl font-bold">{messages?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Messages</p>
              </GlassPanel>
              <GlassPanel className="p-3 text-center">
                <Trophy className="w-5 h-5 text-neon-gold mx-auto mb-1" />
                <p className="text-xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">Winners</p>
              </GlassPanel>
            </div>
          </div>

          <div className="flex-1 container mx-auto px-4 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GlassPanel className="p-6">
                {activeMenu === "events" && (
                  <>
                    {loadingEvents ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="space-y-6">
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
                                  {allRegistrationsByEvent[event.id] || 0} registered
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
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
                                  {allRegistrationsByEvent[event.id] || 0} registered
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeMenu === "guest-registrations" && (
                  <>
                    {loadingGuestRegistrations ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    ) : guestRegistrations && guestRegistrations.length > 0 ? (
                      <div className="space-y-4">
                        {/* Advanced filters */}
                        <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                          <Input
                            placeholder="Search name or email..."
                            value={regSearch}
                            onChange={(e) => setRegSearch(e.target.value)}
                            className="max-w-[200px] h-9"
                          />
                          <Select value={regEvent1} onValueChange={setRegEvent1}>
                            <SelectTrigger className="w-[180px] h-9">
                              <SelectValue placeholder="Event 1" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Event 1</SelectItem>
                              {events?.map((e) => (
                                <SelectItem key={e.id} value={e.id}>
                                  {e.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select value={regEvent2} onValueChange={setRegEvent2}>
                            <SelectTrigger className="w-[180px] h-9">
                              <SelectValue placeholder="Event 2" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Event 2</SelectItem>
                              {events?.map((e) => (
                                <SelectItem key={e.id} value={e.id}>
                                  {e.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select value={regDepartment} onValueChange={setRegDepartment}>
                            <SelectTrigger className="w-[140px] h-9">
                              <SelectValue placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Departments</SelectItem>
                              {uniqueDepartments.map((d) => (
                                <SelectItem key={d} value={d}>
                                  {d}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select value={regCollege} onValueChange={setRegCollege}>
                            <SelectTrigger className="w-[140px] h-9">
                              <SelectValue placeholder="College" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Colleges</SelectItem>
                              {uniqueColleges.map((c) => (
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
                              setRegSearch("");
                              setRegEvent1("all");
                              setRegEvent2("all");
                              setRegDepartment("all");
                              setRegCollege("all");
                            }}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Clear
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Showing {filteredGuestRegistrations.length} of {guestRegistrations.length} registrations
                          </p>
                          <DownloadDialog
                            open={downloadDialogOpen}
                            onOpenChange={setDownloadDialogOpen}
                            format={downloadFormat}
                            onFormatChange={setDownloadFormat}
                            eventId={downloadEventId}
                            onEventIdChange={setDownloadEventId}
                            columns={downloadColumns}
                            onColumnsChange={setDownloadColumns}
                            events={events || []}
                            data={filteredGuestRegistrations}
                            onExport={async (finalColumns?: ColumnOption[]) => {
                              try {
                                const selectedEvent = events?.find(e => e.id === downloadEventId);
                                const dataToExport = downloadEventId === "all" 
                                  ? filteredGuestRegistrations 
                                  : filteredGuestRegistrations.filter((g: any) => 
                                      g.event_1_id === downloadEventId || g.event_2_id === downloadEventId
                                    );
                                
                                // Use finalColumns if provided (includes custom column), otherwise use downloadColumns
                                const columnsToUse = finalColumns || downloadColumns;
                                
                                await exportData({
                                  format: downloadFormat,
                                  eventId: downloadEventId === "all" ? undefined : downloadEventId,
                                  eventName: selectedEvent?.name,
                                  columns: columnsToUse,
                                  data: dataToExport,
                                });
                                
                                toast({
                                  title: "Export successful",
                                  description: `Data exported as ${downloadFormat.toUpperCase()}`,
                                });
                                setDownloadDialogOpen(false);
                              } catch (error: any) {
                                toast({
                                  title: "Export failed",
                                  description: error.message || "Failed to export data",
                                  variant: "destructive",
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {filteredGuestRegistrations.map((g: any) => (
                            <ParticipantTile
                              key={g.id}
                              name={g.name}
                              email={g.email}
                              department={g.department}
                              college={g.college}
                              event1Label={g.event_1?.name}
                              event2Label={g.event_2?.name}
                              date={formatDate(g.created_at)}
                              whatsapp={g.whatsapp_phone}
                              event1TeamName={g.event_1_team_name}
                              event2TeamName={g.event_2_team_name}
                              upiTransactionId={g.upi_transaction_id}
                              registrationId={g.id}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No event registrations yet</p>
                        <p className="text-sm text-muted-foreground mt-1">Submissions from the Register page will appear here.</p>
                      </div>
                    )}
                  </>
                )}

                {activeMenu === "signups" && (
                  <>
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
                  </>
                )}

                {activeMenu === "registrations" && (
                  <>
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
                  </>
                )}

                {activeMenu === "messages" && (
                  <>
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
                  </>
                )}

                {activeMenu === "dashboard" && (
                  <div className="text-center py-12">
                    <LayoutDashboard className="w-14 h-14 text-primary/60 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Dashboard Overview</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Use the sidebar to view Event Registrations, All Sign-ups, Auth Event Reg., Events Overview, or All Messages.
                    </p>
                  </div>
                )}
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
              <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
                {events?.map((event) => {
                  const count = allRegistrationsByEvent[event.id] || 0;
                  const isTechnical = event.category === "technical";
                  const percentage = maxRegistrationCount > 0 ? (count / maxRegistrationCount) * 100 : 0;
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
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassPanel>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

// Download Dialog Component
interface DownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  format: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
  eventId: string;
  onEventIdChange: (eventId: string) => void;
  columns: ColumnOption[];
  onColumnsChange: (columns: ColumnOption[]) => void;
  events: any[];
  data: any[];
  onExport: (columns?: ColumnOption[]) => Promise<void>;
}

const DownloadDialog = ({
  open,
  onOpenChange,
  format,
  onFormatChange,
  eventId,
  onEventIdChange,
  columns,
  onColumnsChange,
  events,
  onExport,
}: DownloadDialogProps) => {
  const [customColumnName, setCustomColumnName] = useState("");
  const [hasCustomColumn, setHasCustomColumn] = useState(false);
  
  const regularSelectedCount = columns.filter(c => c.enabled).length;
  const selectedCount = regularSelectedCount + (hasCustomColumn ? 1 : 0);
  const maxColumns = 5;
  const supportsCustomColumn = format === 'pdf' || format === 'word';

  // Disable custom column if format doesn't support it
  useEffect(() => {
    if (!supportsCustomColumn && hasCustomColumn) {
      setHasCustomColumn(false);
      setCustomColumnName("");
    }
  }, [format, supportsCustomColumn, hasCustomColumn]);

  // Reset custom column when dialog closes
  useEffect(() => {
    if (!open) {
      setHasCustomColumn(false);
      setCustomColumnName("");
    }
  }, [open]);

  const handleColumnToggle = (key: string) => {
    const column = columns.find(c => c.key === key);
    if (!column) return;
    
    if (column.enabled) {
      // Disable
      onColumnsChange(columns.map(c => c.key === key ? { ...c, enabled: false } : c));
    } else {
      // Enable only if under limit (excluding custom column)
      if (regularSelectedCount < maxColumns - (hasCustomColumn ? 1 : 0)) {
        onColumnsChange(columns.map(c => c.key === key ? { ...c, enabled: true } : c));
      }
    }
  };

  const handleCustomColumnToggle = (enabled: boolean) => {
    if (enabled && selectedCount < maxColumns) {
      setHasCustomColumn(true);
    } else {
      setHasCustomColumn(false);
      setCustomColumnName("");
    }
  };

  const handleExport = async () => {
    // Create columns with custom column if enabled
    let finalColumns = [...columns];
    if (hasCustomColumn && customColumnName.trim() && supportsCustomColumn) {
      const customColumn: ColumnOption = {
        key: 'custom',
        label: customColumnName.trim(),
        enabled: true,
        isCustom: true,
        customLabel: customColumnName.trim(),
      };
      finalColumns = [...columns, customColumn];
    }
    
    // Pass final columns directly to export function
    await onExport(finalColumns);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Download Registrations</DialogTitle>
          <DialogDescription>
            Select file format, event filter, and columns to include (max 5 columns).
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* File Format Selection */}
          <div className="space-y-2">
            <Label>File Format</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['excel', 'pdf', 'word'] as ExportFormat[]).map((fmt) => (
                <Button
                  key={fmt}
                  variant={format === fmt ? "default" : "outline"}
                  onClick={() => onFormatChange(fmt)}
                  className="capitalize"
                >
                  {fmt === 'excel' ? 'Excel' : fmt === 'pdf' ? 'PDF' : 'Word'}
                </Button>
              ))}
            </div>
          </div>

          {/* Event Filter */}
          <div className="space-y-2">
            <Label>Filter by Event</Label>
            <Select value={eventId} onValueChange={onEventIdChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {events.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Column Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Select Columns ({selectedCount}/{maxColumns})</Label>
              {selectedCount >= maxColumns && (
                <span className="text-xs text-muted-foreground">Maximum reached</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 p-3 border rounded-lg bg-muted/30 max-h-64 overflow-y-auto">
              {columns.map((col) => (
                <div key={col.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={col.key}
                    checked={col.enabled}
                    onCheckedChange={() => handleColumnToggle(col.key)}
                    disabled={!col.enabled && selectedCount >= maxColumns}
                  />
                  <Label
                    htmlFor={col.key}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {col.label}
                  </Label>
                </div>
              ))}
              
              {/* Custom Column Option (only for PDF/Word) */}
              {supportsCustomColumn && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="custom-column"
                    checked={hasCustomColumn}
                    onCheckedChange={handleCustomColumnToggle}
                    disabled={!hasCustomColumn && selectedCount >= maxColumns}
                  />
                  <Label
                    htmlFor="custom-column"
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    Add Custom Column
                  </Label>
                </div>
              )}
            </div>
            
            {/* Custom Column Name Input */}
            {hasCustomColumn && supportsCustomColumn && (
              <div className="space-y-2 p-3 border rounded-lg bg-muted/30">
                <Label htmlFor="custom-column-name">Custom Column Name</Label>
                <Input
                  id="custom-column-name"
                  placeholder="Enter column name..."
                  value={customColumnName}
                  onChange={(e) => setCustomColumnName(e.target.value)}
                  className="max-w-md"
                />
                <p className="text-xs text-muted-foreground">
                  This column will be empty in the exported document
                </p>
              </div>
            )}
            
            {selectedCount === 0 && (
              <p className="text-xs text-destructive">Please select at least one column</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={selectedCount === 0 || (hasCustomColumn && !customColumnName.trim())}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDashboard;
