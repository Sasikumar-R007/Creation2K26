import { Layout } from "@/components/layout";
import { ParticlesBackground } from "@/components/particles-background";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Cpu, Globe, Users, Award, Zap, Code, Palette, Briefcase, GraduationCap, Github, Linkedin, Mail, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const cardHoverVariants = {
  initial: { y: 0 },
  hover: { y: -8, transition: { duration: 0.3 } }
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5 }
  })
};

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const coordinators = [
    { name: "Dr. Rahul Kumar", role: "Chief Coordinator", dept: "BCA", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
    { name: "Prof. Anita Singh", role: "Faculty Lead", dept: "BCA", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" }
  ];

  const developers = [
    { name: "Aditya Verma", role: "Senior Developer", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
    { name: "Sneha Gupta", role: "Junior Developer", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" }
  ];

  const plans = [
    {
      title: "Individual Pass",
      price: "$49",
      description: "Single event registration",
      features: ["Register for 1 event", "Access to event venue", "Digital certificate", "Networking badge"],
      popular: false
    },
    {
      title: "All Access Pass",
      price: "$149",
      description: "Attend all events",
      features: ["Unlimited event registration", "VIP access to all venues", "Premium digital certificate", "Exclusive networking sessions", "Merchandise kit", "Priority support"],
      popular: true
    }
  ];

  return (
    <Layout>
      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParticlesBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.div
              className="inline-block px-6 py-2 rounded-full border border-primary/40 bg-gradient-to-r from-primary/20 to-accent/20 text-primary text-sm font-medium mb-8 neon-text"
              animate={{ boxShadow: ["0 0 10px rgba(168, 85, 247, 0.5)", "0 0 20px rgba(168, 85, 247, 0.8)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              MARCH 8, 2026
            </motion.div>

            {/* Thunder Strike Animated Name */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8"
            >
              <h1 className="text-7xl md:text-9xl font-black thunder-strike leading-none tracking-tighter" style={{fontFamily: "'Space Grotesk', sans-serif"}}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                  Creation 2K26
                </span>
              </h1>
            </motion.div>

            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              The Ultimate National Symposium showcasing innovation, creativity, and technical excellence. 
              Join hundreds of participants across technical and non-technical events.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/events">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="text-base bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                    Explore Events
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/schedule">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="lg" className="text-base border-white/20 hover:bg-white/5">
                    View Schedule
                  </Button>
                </motion.div>
              </Link>
            </div>

            {/* Stats Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16"
            >
              {[
                { icon: Cpu, label: "Events", value: "15+", color: "text-secondary" },
                { icon: Users, label: "Participants", value: "500+", color: "text-accent" },
                { icon: Award, label: "Prize Pool", value: "$5000", color: "text-primary" },
                { icon: Zap, label: "Total Hours", value: "24+", color: "text-secondary" }
              ].map((stat, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <motion.div
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={statVariants}
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    className="p-6 rounded-xl bg-white/3 border border-white/15 hover:border-primary/40 transition-colors cursor-pointer"
                  >
                    <stat.icon className={`w-8 h-8 ${stat.color} mb-3 mx-auto`} />
                    <div className="text-3xl font-bold font-mono mb-1">{stat.value}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========== ABOUT SYMPOSIUM ========== */}
      <section className="py-24 bg-gradient-to-b from-background to-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">About the Symposium</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-8" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Creation 2K26 is a national-level symposium bringing together the brightest minds in technology, 
              innovation, and creativity for a day of intense competition, learning, and networking.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Code,
                title: "Technical Excellence",
                description: "Hackathons, AI/ML challenges, web development competitions, and cybersecurity CTFs testing your coding prowess."
              },
              {
                icon: Palette,
                title: "Creative Expression",
                description: "Design contests, short film festivals, photography exhibitions, and creative workshops for artistic minds."
              },
              {
                icon: Briefcase,
                title: "Professional Growth",
                description: "Startup pitches, business case competitions, and networking with industry leaders and mentors."
              }
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants}>
                <motion.div
                  variants={cardHoverVariants}
                  initial="initial"
                  whileHover="hover"
                  className="h-full p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/2 border border-white/10 hover:border-primary/50 transition-colors group"
                >
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:from-primary/40 group-hover:to-accent/40 transition-colors"
                  >
                    <item.icon className="w-7 h-7 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== ABOUT DEPARTMENT ========== */}
      <section className="py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Bachelor of Computer Applications</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-primary to-accent rounded-full mb-8" />
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our BCA department stands at the forefront of technological innovation and academic excellence. 
                With state-of-the-art laboratories, experienced faculty, and a vibrant community of students, 
                we foster an environment where ideas transform into groundbreaking solutions.
              </p>
              <div className="space-y-4">
                {[
                  "500+ Students across all years",
                  "50+ Faculty members",
                  "15 Modern laboratories",
                  "100% Campus placement",
                  "5-star industry partnerships"
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <Card className="relative p-8 bg-white/5 border-white/10">
                <GraduationCap className="w-16 h-16 text-secondary mb-6" />
                <h3 className="text-2xl font-bold mb-4">BCA Program</h3>
                <p className="text-muted-foreground">
                  Leading the digital revolution through cutting-edge research, 
                  quality education, and industry collaboration.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========== COORDINATORS ========== */}
      <section className="py-24 bg-gradient-to-b from-background to-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Event Coordinators</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-8" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the visionary team making Creation 2K26 possible
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto"
          >
            {coordinators.map((coord, i) => (
              <motion.div key={i} variants={itemVariants}>
                <motion.div
                  initial="initial"
                  whileHover="hover"
                  className="relative group"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl"
                  />
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="relative h-full rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-primary/50 transition-all backdrop-blur"
                  >
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.4 }}
                      className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10"
                    >
                      <img 
                        src={coord.image} 
                        alt={coord.name}
                        className="w-full h-full object-cover"
                      />
                      <motion.div 
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
                      />
                    </motion.div>
                    <div className="p-8 text-center">
                      <h3 className="text-2xl font-bold mb-2">{coord.name}</h3>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        className="h-1 w-12 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-3 origin-center"
                      />
                      <p className="text-base text-primary font-medium mb-1">{coord.role}</p>
                      <p className="text-sm text-muted-foreground">{coord.dept}</p>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== STRUCTURE ========== */}
      <section className="py-24 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Symposium Structure</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {[
              {
                title: "Technical Events",
                items: ["Hackathon (24 hours)", "Web Development Showdown", "AI/ML Challenge", "Cybersecurity CTF", "Mobile App Dev", "IoT & Embedded Systems", "Robo Wars"]
              },
              {
                title: "Non-Technical Events",
                items: ["Gaming Tournament", "Debate Championship", "Quiz Challenge", "Business Case Competition", "Startup Pitch", "Creative Design", "Short Film Festival", "Photography Exhibition"]
              }
            ].map((section, i) => (
              <motion.div key={i} variants={itemVariants}>
                <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/2 border border-white/10">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {section.title}
                  </h3>
                  <div className="space-y-3">
                    {section.items.map((item, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: j * 0.05 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer"
                      >
                        <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                        <span className="text-foreground">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== FEES STRUCTURE (with Modal) ========== */}
      <section className="py-24 bg-gradient-to-b from-black/20 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Pricing Plans</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-8" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your symposium experience
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {plans.map((plan, i) => (
              <motion.div key={i} variants={itemVariants}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -10 }}
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-8 rounded-2xl border-2 transition-all cursor-pointer ${
                    plan.popular
                      ? "bg-gradient-to-br from-primary/20 to-accent/10 border-primary/50"
                      : "bg-gradient-to-br from-white/5 to-white/2 border-white/10 hover:border-primary/30"
                  }`}
                >
                  {plan.popular && (
                    <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold mb-4">
                      POPULAR
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  <div className="text-5xl font-bold text-primary mb-6">{plan.price}</div>
                  <Button className="w-full mb-6" onClick={() => setSelectedPlan(plan)}>
                    Learn More
                  </Button>
                  <div className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== DEVELOPERS ========== */}
      <section className="py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Website Developers</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-8" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The talented team behind this platform
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto"
          >
            {developers.map((dev, i) => (
              <motion.div key={i} variants={itemVariants}>
                <motion.div
                  initial="initial"
                  whileHover="hover"
                  className="relative group"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className={`absolute inset-0 rounded-3xl blur-2xl ${i === 0 ? 'bg-gradient-to-r from-secondary/20 to-primary/20' : 'bg-gradient-to-r from-accent/20 to-primary/20'}`}
                  />
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="relative h-full rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-primary/50 transition-all backdrop-blur"
                  >
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.4 }}
                      className={`relative h-64 overflow-hidden ${i === 0 ? 'bg-gradient-to-br from-secondary/10 to-primary/10' : 'bg-gradient-to-br from-accent/10 to-primary/10'}`}
                    >
                      <img 
                        src={dev.image} 
                        alt={dev.name}
                        className="w-full h-full object-cover"
                      />
                      <motion.div 
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
                      />
                    </motion.div>
                    <div className="p-8 text-center">
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${i === 0 ? 'bg-secondary/20 text-secondary' : 'bg-accent/20 text-accent'}`}
                      >
                        {i === 0 ? 'SENIOR' : 'JUNIOR'}
                      </motion.div>
                      <h3 className="text-2xl font-bold text-center mb-2">{dev.name}</h3>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        className={`h-1 w-12 mx-auto rounded-full mb-3 origin-center ${i === 0 ? 'bg-gradient-to-r from-secondary to-primary' : 'bg-gradient-to-r from-accent to-primary'}`}
                      />
                      <p className={`text-base font-medium text-center ${i === 0 ? 'text-secondary' : 'text-accent'}`}>{dev.role}</p>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="py-24 relative overflow-hidden">
        <ParticlesBackground />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Ready to Showcase Your Talent?
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Register now for Creation 2K26 and be part of the most exciting symposium of the year.
              Limited spots available!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="text-base bg-gradient-to-r from-primary to-accent hover:opacity-90">
                    Register Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/announcements">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="lg" className="text-base border-white/20">
                    View Announcements
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== PLAN MODAL ========== */}
      {selectedPlan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedPlan(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl border border-white/10 p-8 max-w-lg w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold">{selectedPlan.title}</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedPlan(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                data-testid="button-close-modal"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
            <div className="text-5xl font-bold text-primary mb-2">{selectedPlan.price}</div>
            <p className="text-muted-foreground mb-8">{selectedPlan.description}</p>
            <div className="space-y-4 mb-8">
              {selectedPlan.features.map((feature: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
            <Button size="lg" className="w-full bg-gradient-to-r from-primary to-accent mb-4">
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => setSelectedPlan(null)}
            >
              Close
            </Button>
          </motion.div>
        </motion.div>
      )}
    </Layout>
  );
}
