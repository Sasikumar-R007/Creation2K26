import { Layout } from "@/components/layout";
import { useAnnouncements } from "@/hooks/use-announcements";
import { Loader2, Bell, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const sampleAnnouncements = [
  {
    id: "sample-1",
    title: "Early Bird Registration Extended",
    content: "Great news! We've extended early bird registration until March 1st. Secure your spot at 20% discount on all event passes. Don't miss out on this limited-time offer!",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "sample-2", 
    title: "New Event Announced: AI/ML Hackathon",
    content: "We're excited to announce our 24-hour AI/ML Hackathon competition with prizes worth ₹50,000. Build innovative machine learning solutions and compete with the best minds in the industry.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "sample-3",
    title: "Venue & Schedule Confirmed",
    content: "All events will be held at the University Convention Center. Check our schedule page for detailed timings. Parking and refreshments will be provided for all participants.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default function Announcements() {
  const { data: announcements, isLoading } = useAnnouncements();
  const displayAnnouncements = announcements && announcements.length > 0 ? announcements : sampleAnnouncements;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-display font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Updates & News
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Stay informed with the latest announcements and updates from Creation 2K26. Check back regularly for exciting news and important information.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="space-y-6"
        >
          {displayAnnouncements?.map((announcement, i) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <motion.div
                whileHover={{ translateX: 8 }}
                className="group"
              >
                <Card className="bg-gradient-to-r from-white/8 to-white/3 border-white/15 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/10 overflow-hidden">
                  <CardHeader className="pb-3 border-b border-white/10">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="flex-shrink-0"
                        >
                          <Bell className="w-6 h-6 text-accent mt-1" />
                        </motion.div>
                        <div className="flex-1">
                          <CardTitle className="text-2xl font-display bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                            {announcement.title}
                          </CardTitle>
                        </div>
                      </div>
                      <motion.div
                        initial={{ opacity: 0.6 }}
                        whileHover={{ opacity: 1 }}
                        className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap flex-shrink-0"
                      >
                        <Calendar className="w-3 h-3" />
                        {format(new Date(announcement.createdAt!), "MMM d")}
                      </motion.div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {announcement.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
}
