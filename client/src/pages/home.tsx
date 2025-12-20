import { Layout } from "@/components/layout";
import { ParticlesBackground } from "@/components/particles-background";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Cpu, Globe, Users } from "lucide-react";

export default function Home() {
  return (
    <Layout>
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center">
        <ParticlesBackground />
        
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center md:text-left"
            >
              <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
                OCTOBER 24-25, 2024
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
                Innovate. <br />
                <span className="text-gradient">Integrate.</span> <br />
                Inspire.
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto md:mx-0 font-light leading-relaxed">
                Join the ultimate convergence of technology and creativity. 
                Experience 24 hours of coding, gaming, and innovation at the grandest symposium of the year.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/events">
                  <Button size="lg" className="w-full sm:w-auto text-base bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                    Explore Events
                  </Button>
                </Link>
                <Link href="/schedule">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base border-white/20 hover:bg-white/5">
                    View Schedule
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 relative"
            >
              {/* Abstract decorative elements */}
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse" />
                <div className="relative z-10 glass-card p-8 rounded-2xl border border-white/10 w-full h-full flex flex-col items-center justify-center gap-8 text-center">
                   {/* Replace with a cool graphic or 3D element if possible, using icons for now */}
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-xl flex flex-col items-center">
                        <Cpu className="w-8 h-8 text-secondary mb-2" />
                        <span className="text-2xl font-bold font-mono">15+</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-widest">Events</span>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl flex flex-col items-center">
                        <Users className="w-8 h-8 text-accent mb-2" />
                        <span className="text-2xl font-bold font-mono">500+</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-widest">Participants</span>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl flex flex-col items-center col-span-2">
                        <Globe className="w-8 h-8 text-primary mb-2" />
                        <span className="text-2xl font-bold font-mono">$5000</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-widest">Prize Pool</span>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 transition-colors">
                 <h3 className="text-xl font-bold mb-3 text-white">Technical Events</h3>
                 <p className="text-muted-foreground">Challenge your coding skills, debug complex systems, and showcase your engineering prowess.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/50 transition-colors">
                 <h3 className="text-xl font-bold mb-3 text-white">Non-Technical</h3>
                 <p className="text-muted-foreground">Gaming, quizzes, and creative challenges for those who want to express themselves differently.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/50 transition-colors">
                 <h3 className="text-xl font-bold mb-3 text-white">Networking</h3>
                 <p className="text-muted-foreground">Connect with industry experts, fellow students, and potential mentors throughout the event.</p>
              </div>
           </div>
        </div>
      </section>
    </Layout>
  );
}
