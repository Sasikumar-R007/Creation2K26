import { useAuth } from "@/hooks/use-auth";
import { useEvents } from "@/hooks/use-events";
import { useRegistrations } from "@/hooks/use-registrations";
import { useLocation, Link } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Calendar, Users, LogOut, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
   const { user, isLoading: authLoading, logout } = useAuth();
   const { data: events, isLoading: eventsLoading } = useEvents();
   const { data: registrations, isLoading: registrationsLoading } = useRegistrations();
   const [, setLocation] = useLocation();

   useEffect(() => {
      if (!authLoading && !user) {
         setLocation("/admin/login");
      }
   }, [user, authLoading, setLocation]);

   if (authLoading || eventsLoading || registrationsLoading) {
      return (
         <div className="flex h-screen items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
         </div>
      );
   }

   if (!user) return null;

   // Compute stats
   const totalEvents = events?.length || 0;
   const totalRegistrations = registrations?.length || 0;
   const technicalEvents = events?.filter(e => e.category === 'technical').length || 0;
   const confirmedRegistrations = registrations?.filter(r => r.status === 'confirmed').length || 0;

   // Chart data: Registrations per event
   const chartData = events?.map(event => ({
      name: event.title.substring(0, 15) + (event.title.length > 15 ? '...' : ''),
      registrations: registrations?.filter(r => r.eventId === event.id).length || 0
   })).sort((a, b) => b.registrations - a.registrations).slice(0, 5); // Top 5

   return (
      <div className="min-h-screen bg-background text-foreground flex">
         {/* Sidebar */}
         <aside className="w-64 bg-card border-r border-white/5 hidden md:flex flex-col fixed h-screen top-0 left-0 overflow-y-auto">
            <div className="p-6 border-b border-white/5">
               <h2 className="text-xl font-bold font-display">Admin Portal</h2>
               <p className="text-sm text-muted-foreground mt-1">Welcome, {user.name}</p>
            </div>
            <nav className="flex-1 p-4 space-y-2">
               <Link href="/admin/dashboard">
                  <Button variant="secondary" className="w-full justify-start gap-2">
                     <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Button>
               </Link>
               <Link href="/admin/events">
                  <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-white">
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

         {/* Main Content */}
         <main className="flex-1 p-8 overflow-y-auto ml-64 min-h-screen">
            <div className="flex justify-between items-center mb-8">
               <h1 className="text-3xl font-display font-bold">Dashboard Overview</h1>
               <Link href="/admin/events">
                  <Button className="gap-2 bg-primary hover:bg-primary/90">
                     <Plus className="w-4 h-4" /> Add Event
                  </Button>
               </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               <StatCard title="Total Registrations" value={totalRegistrations} icon={<Users className="w-8 h-8 text-primary" />} />
               <StatCard title="Total Events" value={totalEvents} icon={<Calendar className="w-8 h-8 text-secondary" />} />
               <StatCard title="Technical Events" value={technicalEvents} icon={<LayoutDashboard className="w-8 h-8 text-accent" />} />
               <StatCard title="Confirmed" value={confirmedRegistrations} icon={<Users className="w-8 h-8 text-green-500" />} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <Card className="bg-card border-white/10">
                  <CardHeader>
                     <CardTitle>Top Events by Registration</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                           <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                           <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                           <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                           <Tooltip
                              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                              itemStyle={{ color: '#fff' }}
                           />
                           <Bar dataKey="registrations" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                     </ResponsiveContainer>
                  </CardContent>
               </Card>

               <Card className="bg-card border-white/10">
                  <CardHeader>
                     <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        {registrations?.slice(0, 5).map(reg => (
                           <div key={reg.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                              <div>
                                 <p className="font-medium text-sm">{reg.studentName}</p>
                                 <p className="text-xs text-muted-foreground">{reg.college}</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-sm font-medium">Event #{reg.eventId}</p>
                                 <span className="text-xs text-primary">{reg.status}</span>
                              </div>
                           </div>
                        ))}
                        {(!registrations || registrations.length === 0) && (
                           <p className="text-muted-foreground text-center py-4">No recent activity</p>
                        )}
                     </div>
                  </CardContent>
               </Card>
            </div>
         </main>
      </div>
   );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
   return (
      <Card className="bg-card border-white/10">
         <CardContent className="p-6 flex items-center justify-between">
            <div>
               <p className="text-sm text-muted-foreground mb-1">{title}</p>
               <h3 className="text-3xl font-bold font-mono">{value}</h3>
            </div>
            <div className="p-3 rounded-full bg-white/5">
               {icon}
            </div>
         </CardContent>
      </Card>
   );
}
