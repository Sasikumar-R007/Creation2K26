import { Layout } from "@/components/layout";
import { useAnnouncements } from "@/hooks/use-announcements";
import { Loader2, Bell } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Announcements() {
  const { data: announcements, isLoading } = useAnnouncements();

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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-display font-bold mb-2">Updates</h1>
        <p className="text-muted-foreground mb-8">Latest news and announcements from the organizers.</p>

        <div className="space-y-6">
          {announcements?.map((announcement) => (
            <Card key={announcement.id} className="bg-white/5 border-white/10 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-xl font-display flex items-center gap-3">
                    <Bell className="w-5 h-5 text-accent" />
                    {announcement.title}
                  </CardTitle>
                  <span className="text-xs text-muted-foreground whitespace-nowrap pt-1">
                    {format(new Date(announcement.createdAt!), "MMM d, h:mm a")}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {announcement.content}
                </p>
              </CardContent>
            </Card>
          ))}
          
          {(!announcements || announcements.length === 0) && (
             <div className="text-center py-20 bg-white/5 rounded-xl border border-white/5 border-dashed">
                <p className="text-muted-foreground">No announcements yet.</p>
             </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
