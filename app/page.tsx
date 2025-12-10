
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, Users, BarChart3, BookOpen, Rocket, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { AnimatedCard } from "@/components/animated-card"
import { InteractiveStats } from "@/components/interactive-stats"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedLogo2D } from "@/components/animated-logo"

const features = [
  {
    icon: <Briefcase className="w-8 h-8 text-accent" />,
    title: "For Students",
    description: "Access placement drives, apply easily, track applications, and prepare for interviews.",
    href: "/login",
  },
  {
    icon: <Users className="w-8 h-8 text-secondary" />,
    title: "For Faculty",
    description: "Manage student data, upload assignments, track placements and student performance.",
    href: "/login",
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-primary" />,
    title: "For Admin",
    description: "Monitor all placements, manage drives, view analytics, and generate reports.",
    href: "/login",
  },
  {
    icon: <BookOpen className="w-8 h-8 text-accent" />,
    title: "Resources",
    description: "Access preparation materials, coding platforms, and learning resources.",
    href: "#resources",
  },
]

const stats = [
  { label: "Active Students", value: 4000, icon: "👥" },
  { label: "Partner Companies", value: 500, icon: "🏢" },
  { label: "Success Rate", value: "95%", icon: "🎯" },
  { label: "Avg. Package", value: "62.3 LPA", icon: "💼" },
]

const testimonials = [
  {
    name: "Arjun Singh",
    role: "Software Engineer @ Google",
    content: "RCE Career Hub made my placement journey seamless. The interview prep resources were invaluable!",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Data Scientist @ Microsoft",
    content: "The platform's real-time updates and easy application process helped me secure my dream job.",
    rating: 5,
  },
  {
    name: "Rahul Kumar",
    role: "Full Stack Developer @ Amazon",
    content: "Excellent platform with comprehensive features. The faculty support was outstanding!",
    rating: 5,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Hero Section with 3D Logo */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-20" />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
                <Star className="w-4 h-4" />
                <span>India's Leading College Placement Portal</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Welcome to{" "}
                <span className="gradient-text">RCE Career Hub</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-xl">
                Your comprehensive platform for placement drives, career preparation, and professional growth. 
                Connect with top companies and launch your dream career.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/login">
                  <Button size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 hover-lift">
                    Get Started <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="#features">
                  <Button size="lg" variant="outline" className="gap-2 bg-transparent hover-lift">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right: 3D Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[400px] lg:h-[500px]"
            >
              <AnimatedLogo2D className="w-full h-full" />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="w-6 h-10 border-2 border-accent rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 bg-accent rounded-full"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4 md:px-8 bg-gradient-to-b from-background to-primary/5 dark:to-primary/3">
        <div className="container mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                By the Numbers
              </h2>
              <p className="text-lg text-muted-foreground">Join thousands of successful graduates</p>
            </div>
          </ScrollReveal>

          <InteractiveStats stats={stats} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 md:px-8 bg-gradient-to-b from-primary/5 to-background dark:from-primary/3">
        <div className="container mx-auto">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Comprehensive{" "}
                <span className="gradient-text">Solutions</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need for career success in one platform
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <ScrollReveal key={index} direction={index % 2 === 0 ? "left" : "right"} delay={index * 0.1}>
                <Link to={feature.href}>
                  <AnimatedCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    delay={index * 0.1}
                  >
                    <div className="text-accent text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Get Started →
                    </div>
                  </AnimatedCard>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-background to-secondary/5 dark:to-secondary/3">
        <div className="container mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Success <span className="gradient-text">Stories</span>
              </h2>
              <p className="text-lg text-muted-foreground">Hear from our placed students</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div
                  className="glass-lg rounded-xl p-6 hover-lift"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-accent/10 via-primary/10 to-secondary/10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-lg rounded-2xl p-12 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="inline-block mb-6"
            >
              <Rocket className="w-12 h-12 text-accent" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Launch Your Career?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join RCE Career Hub today and connect with top companies seeking talent like yours
            </p>
            <Link to="/login">
              <Button size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 hover-lift">
                Start Your Journey <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}