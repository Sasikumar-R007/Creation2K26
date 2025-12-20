import { Layout } from "@/components/layout";
import { useEvents } from "@/hooks/use-events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Calendar, Users, IndianRupee, Download, FileText } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertRegistrationSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateRegistration } from "@/hooks/use-registrations";
import { format } from "date-fns";

// Schema for registration form, coercing numeric fields
const registrationFormSchema = insertRegistrationSchema.extend({
  eventId: z.coerce.number(),
});

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

export default function Events() {
  const { data: events, isLoading } = useEvents();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const filteredEvents = events?.filter(event => 
    selectedCategory === "all" ? true : event.category === selectedCategory
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold mb-4">Event <span className="text-gradient">Catalog</span></h1>
            <p className="text-muted-foreground max-w-xl">
              Browse through our wide range of technical and non-technical events. 
              Find your passion and register to compete.
            </p>
          </div>
          
          <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setSelectedCategory}>
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="non-technical">Non-Tech</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents?.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          {filteredEvents?.length === 0 && (
             <div className="col-span-full text-center py-20 text-muted-foreground">
               No events found in this category.
             </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function EventCard({ event }: { event: any }) {
  const { mutate: register, isPending } = useCreateRegistration();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      eventId: event.id,
      studentName: "",
      studentEmail: "",
      college: "",
      teamDetails: event.teamSize > 1 ? [] : null,
    },
  });

  const onSubmit = (data: RegistrationFormValues) => {
    register(data, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
      }
    });
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 flex flex-col h-full">
      {event.imageUrl && (
        <div className="h-48 w-full overflow-hidden rounded-t-xl bg-white/5 relative group">
          {/* Use Unsplash image with descriptive comment */}
          {/* event technology background abstract */}
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          <div className="absolute top-4 right-4">
             <Badge variant={event.category === 'technical' ? 'default' : 'secondary'}>
               {event.category}
             </Badge>
          </div>
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-display text-xl">{event.title}</CardTitle>
          {!event.imageUrl && (
            <Badge variant={event.category === 'technical' ? 'default' : 'secondary'}>
               {event.category}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-primary" />
            {format(new Date(event.date), "MMM d, h:mm a")}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-secondary" />
            Team: {event.teamSize}
          </div>
          <div className="flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4 text-accent" />
            Fee: ₹{event.fee}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-white/5 hover:bg-primary hover:text-white border border-white/10 transition-colors">
              View Details & Register
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
             <ScrollArea className="max-h-[85vh] p-6">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl font-display">{event.title}</DialogTitle>
                  <DialogDescription className="text-base mt-2">{event.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                        <Label className="text-muted-foreground">Venue</Label>
                        <p className="font-medium mt-1">{event.venue}</p>
                     </div>
                     <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                        <Label className="text-muted-foreground">Entry Fee</Label>
                        <p className="font-medium mt-1">₹{event.fee}</p>
                     </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2 text-primary">Rules & Regulations</h4>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground bg-black/20 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{event.rules}</p>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6 space-y-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-2">
                        <Download className="w-4 h-4" />
                        Brochure
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-2">
                        <FileText className="w-4 h-4" />
                        Poster
                      </Button>
                    </div>
                    <h3 className="text-xl font-bold">Registration</h3>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="studentName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="studentEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="john@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="college"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>College Name</FormLabel>
                              <FormControl>
                                <Input placeholder="University of Technology" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {event.teamSize > 1 && (
                          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                             <p className="text-sm text-yellow-500 mb-2">Team Event ({event.teamSize} members)</p>
                             <p className="text-xs text-muted-foreground">Please collect team details. You will need to provide them at the venue.</p>
                          </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isPending}>
                          {isPending ? "Registering..." : "Confirm Registration"}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </div>
             </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
