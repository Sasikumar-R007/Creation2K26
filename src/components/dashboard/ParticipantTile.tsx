import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Building2, GraduationCap, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ParticipantTileProps {
  name: string;
  email: string;
  department?: string | null;
  college?: string | null;
  event1Label?: string | null;
  event2Label?: string | null;
  date: string;
  whatsapp?: string | null;
  className?: string;
}

export function ParticipantTile({
  name,
  email,
  department,
  college,
  event1Label,
  event2Label,
  date,
  whatsapp,
  className,
}: ParticipantTileProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card/70 transition-colors",
        className
      )}
    >
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold truncate">{name || "—"}</p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{email || "—"}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 space-y-2">
        {(event1Label || event2Label) && (
          <div className="flex flex-wrap gap-1.5">
            {event1Label && (
              <Badge className="bg-primary/20 text-primary text-xs">
                {event1Label}
              </Badge>
            )}
            {event2Label && (
              <Badge className="bg-secondary/20 text-secondary text-xs">
                {event2Label}
              </Badge>
            )}
          </div>
        )}
        {department != null && department !== "" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="w-4 h-4 shrink-0 text-primary/70" />
            <span>{department}</span>
          </div>
        )}
        {college != null && college !== "" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="w-4 h-4 shrink-0 text-secondary/70" />
            <span>{college}</span>
          </div>
        )}
        {whatsapp != null && whatsapp !== "" && (
          <p className="text-xs text-muted-foreground">WhatsApp: {whatsapp}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t border-border/50">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>{date}</span>
        </div>
      </CardContent>
    </Card>
  );
}
