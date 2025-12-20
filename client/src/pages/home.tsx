import { Layout } from "@/components/layout";
import { ParticlesBackground } from "@/components/particles-background";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Cpu, Globe, Users, Award, Zap, Code, Palette, Briefcase, GraduationCap, Github, Linkedin, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";

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
  const coordinators = [
    { name: "Dr. Rahul Kumar", role: "Chief Coordinator", dept: "CSE" },
    { name: "Prof. Anita Singh", role: "Faculty Lead", dept: "IT" },
    { name: "Priya Sharma", role: "Event Manager", dept: "CSE" },
    { name: "Arjun Patel", role: "Technical Lead", dept: "IT" }
  ];

  const developers = [
    { name: "Aditya Verma", role: "Full Stack Developer", github: "#", linkedin: "#" },
    { name: "Sneha Gupta", role: "UI/UX Designer", github: "#", linkedin: "#" },
    { name: "Rohan Mishra", role: "Backend Developer", github: "#", linkedin: "#" }
  ];

  const feesStructure = [
    { event: "Hackathon", fee: 500, discount: "20% for teams" },
    { event: "Web Development", fee: 250, discount: "15% early bird" },
    { event: "AI/ML Challenge", fee: 350, discount: "No discount" },
    { event: "Gaming Tournament", fee: 200, discount: "10% group" },
    { event: "Technical Events Avg", fee: 300, discount: "Combined ticket" },
    { event: "Non-Technical Events", fee: 150, discount: "Combined ticket" }
  ];

  return (
    <Layout>
      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParticlesBackground />
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

            <h1 className="text-6xl md:text-8xl font-display font-bold leading-tight mb-6">
              <span className="block text-white">Creation</span>
              <span className="text-gradient text-7xl md:text-8xl">2K26</span>
            </h1>

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
                    className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors cursor-pointer"
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
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">About the Department</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-primary to-accent rounded-full mb-8" />
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our department stands at the forefront of technological innovation and academic excellence. 
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
                <h3 className="text-2xl font-bold mb-4">Computer Science & IT</h3>
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
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {coordinators.map((coord, i) => (
              <motion.div key={i} variants={itemVariants}>
                <motion.div
                  variants={cardHoverVariants}
                  initial="initial"
                  whileHover="hover"
                  className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">{coord.name}</h3>
                  <p className="text-sm text-primary font-medium mb-2">{coord.role}</p>
                  <p className="text-xs text-muted-foreground">{coord.dept}</p>
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

      {/* ========== FEES STRUCTURE ========== */}
      <section className="py-24 bg-gradient-to-b from-black/20 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Fees Structure</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-8" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Affordable participation with exciting offers and discounts
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="overflow-x-auto"
          >
            <div className="inline-block min-w-full">
              <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                {feesStructure.map((item, i) => (
                  <motion.div key={i} variants={itemVariants}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/2 border border-white/10 hover:border-primary/50 transition-colors text-center cursor-pointer group"
                    >
                      <h3 className="font-bold mb-3 text-sm">{item.event}</h3>
                      <div className="text-3xl font-mono font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                        ${item.fee}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.discount}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
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
            className="grid md:grid-cols-3 gap-8"
          >
            {developers.map((dev, i) => (
              <motion.div key={i} variants={itemVariants}>
                <motion.div
                  variants={cardHoverVariants}
                  initial="initial"
                  whileHover="hover"
                  className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/2 border border-white/10 hover:border-primary/50 transition-colors group"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mx-auto mb-6 group-hover:from-primary/60 group-hover:to-accent/60 transition-colors">
                    <Code className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">{dev.name}</h3>
                  <p className="text-sm text-primary text-center font-medium mb-6">{dev.role}</p>
                  <div className="flex justify-center gap-4">
                    <motion.a
                      href={dev.github}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 transition-colors"
                      data-testid={`link-github-${i}`}
                    >
                      <Github className="w-5 h-5 text-foreground" />
                    </motion.a>
                    <motion.a
                      href={dev.linkedin}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 transition-colors"
                      data-testid={`link-linkedin-${i}`}
                    >
                      <Linkedin className="w-5 h-5 text-foreground" />
                    </motion.a>
                    <motion.a
                      href={`mailto:${dev.name.toLowerCase().replace(" ", ".")}@example.com`}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 transition-colors"
                      data-testid={`link-email-${i}`}
                    >
                      <Mail className="w-5 h-5 text-foreground" />
                    </motion.a>
                  </div>
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
    </Layout>
  );
}
