import { Layout } from "@/components/layout";
import { useEvents } from "@/hooks/use-events";
import { format } from "date-fns";
import { Loader2, Calendar as CalendarIcon, MapPin, Clock, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Schedule() {
  const { data: events, isLoading } = useEvents();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // Sort events by date
  const sortedEvents = events?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Group by day
  const groupedEvents = sortedEvents?.reduce((groups, event) => {
    const date = format(new Date(event.date), "yyyy-MM-dd");
    if (!groups[date]) groups[date] = [];
    groups[date].push(event);
    return groups;
  }, {} as Record<string, typeof events>);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-display font-bold mb-6 text-center">
            Event <span className="text-gradient">Timeline</span>
          </h1>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Brochure
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <FileText className="w-4 h-4" />
              Poster
            </Button>
          </div>
        </motion.div>

        <div className="space-y-16">
          {Object.entries(groupedEvents || {}).map(([date, dayEvents]) => (
            <div key={date} className="relative">
              <div className="sticky top-20 z-10 mb-8 bg-background/95 backdrop-blur py-2 border-b border-primary/20">
                 <h2 className="text-2xl font-bold flex items-center gap-2">
                    <CalendarIcon className="text-primary" />
                    {format(new Date(date), "MMMM d, yyyy")}
                 </h2>
              </div>
              
              <div className="relative border-l-2 border-white/10 ml-4 md:ml-6 space-y-8 pl-8 md:pl-10 pb-4">
                {dayEvents?.map((event) => (
                  <div key={event.id} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-[41px] md:-left-[49px] top-1 h-5 w-5 rounded-full border-4 border-background bg-primary" />
                    
                    <div className="bg-card/50 border border-white/5 rounded-xl p-6 hover:bg-white/5 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                         <h3 className="text-xl font-bold font-display">{event.title}</h3>
                         <div className="flex items-center gap-2 text-primary font-mono text-sm">
                            <Clock className="w-4 h-4" />
                            {format(new Date(event.date), "h:mm a")}
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                         <MapPin className="w-4 h-4" />
                         {event.venue}
                      </div>
                      
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {(!sortedEvents || sortedEvents.length === 0) && (
            <div className="text-center py-20 text-muted-foreground">
              No events scheduled yet.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
