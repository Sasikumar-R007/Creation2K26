import { useAuth } from "@/hooks/use-auth";
import { useRegistrations, useUpdateRegistrationStatus } from "@/hooks/use-registrations";
import { useEvents } from "@/hooks/use-events";
import { useLocation, Link } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Calendar, Users, LogOut, Check, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export default function AdminRegistrations() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const { data: registrations, isLoading: regLoading } = useRegistrations();
  const { data: events } = useEvents();
  const { mutate: updateStatus } = useUpdateRegistrationStatus();
  const [, setLocation] = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterEvent, setFilterEvent] = useState("all");

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/admin/login");
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || regLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }
  
  if (!user) return null;

  const filteredRegistrations = registrations?.filter(reg => {
    const matchesSearch = reg.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          reg.registrationId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = filterEvent === "all" || reg.eventId.toString() === filterEvent;
    return matchesSearch && matchesEvent;
  });

  const getEventName = (id: number) => {
    return events?.find(e => e.id === id)?.title || "Unknown Event";
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
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
             <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-white">
                <Calendar className="w-4 h-4" /> Manage Events
             </Button>
          </Link>
          <Link href="/admin/registrations">
             <Button variant="secondary" className="w-full justify-start gap-2">
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
        <h1 className="text-3xl font-display font-bold mb-8">Manage Registrations</h1>

        <div className="flex gap-4 mb-6">
           <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or ID..." 
                className="pl-9 bg-white/5 border-white/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <Select value={filterEvent} onValueChange={setFilterEvent}>
             <SelectTrigger className="w-[250px] bg-white/5 border-white/10">
               <SelectValue placeholder="Filter by Event" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">All Events</SelectItem>
               {events?.map(event => (
                 <SelectItem key={event.id} value={event.id.toString()}>{event.title}</SelectItem>
               ))}
             </SelectContent>
           </Select>
        </div>

        <div className="rounded-lg border border-white/10 overflow-hidden">
           <Table>
              <TableHeader className="bg-white/5">
                 <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead>Reg ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                 </TableRow>
              </TableHeader>
              <TableBody>
                 {filteredRegistrations?.map((reg) => (
                    <TableRow key={reg.id} className="border-white/10 hover:bg-white/5">
                       <TableCell className="font-mono">{reg.registrationId}</TableCell>
                       <TableCell>
                          <div className="font-medium">{reg.studentName}</div>
                          <div className="text-xs text-muted-foreground">{reg.college}</div>
                       </TableCell>
                       <TableCell>{getEventName(reg.eventId)}</TableCell>
                       <TableCell>
                          <Badge 
                            variant={reg.status === 'confirmed' ? 'default' : reg.status === 'attended' ? 'secondary' : 'outline'}
                            className={reg.status === 'confirmed' ? 'bg-green-500/20 text-green-500 border-green-500/50' : ''}
                          >
                             {reg.status}
                          </Badge>
                       </TableCell>
                       <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                             {reg.status === 'pending' && (
                               <Button 
                                  size="sm" 
                                  className="h-8 w-8 p-0 bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-400"
                                  onClick={() => updateStatus({ id: reg.id, status: 'confirmed' })}
                                  title="Confirm"
                               >
                                  <Check className="w-4 h-4" />
                               </Button>
                             )}
                             {reg.status === 'confirmed' && (
                               <Button 
                                  size="sm" 
                                  className="h-8 w-8 p-0 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-400"
                                  onClick={() => updateStatus({ id: reg.id, status: 'attended' })}
                                  title="Mark Attended"
                               >
                                  <Users className="w-4 h-4" />
                               </Button>
                             )}
                          </div>
                       </TableCell>
                    </TableRow>
                 ))}
                 {filteredRegistrations?.length === 0 && (
                    <TableRow>
                       <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No registrations found.
                       </TableCell>
                    </TableRow>
                 )}
              </TableBody>
           </Table>
        </div>
      </main>
    </div>
  );
}
