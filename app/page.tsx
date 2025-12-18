
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, Users, BarChart3, BookOpen, Rocket, Star, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"
import { AnimatedCard } from "@/components/animated-card"
import { InteractiveStats } from "@/components/interactive-stats"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedLogo2D } from "@/components/animated-logo"
import { StudentSteppingUp } from "@/components/student-stepping-up"
import { CustomCursor } from "@/components/custom-cursor"
import { Mesh3DBackground } from "@/components/3d-mesh-background"

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
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden cursor-none">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* 3D Mesh Background */}
      <Mesh3DBackground />

      {/* Animated gradient overlays - rock8.io style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 70%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
            ]
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Hero Section with Student Stepping Up Animation */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full text-sm font-medium shadow-lg"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Star className="w-4 h-4 fill-blue-400" />
                </motion.div>
                <span>India's Leading College Placement Portal</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold leading-tight"
              >
                <span className="text-white">Reach the </span>
                <motion.span
                  className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: "200% auto"
                  }}
                >
                  TOP
                </motion.span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  of Your Life
                </span>
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 text-xl md:text-2xl font-semibold text-white/90">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    <TrendingUp className="w-8 h-8 text-cyan-400" />
                  </motion.div>
                  <span>Use our platform and</span>
                </div>
                <p className="text-xl md:text-2xl text-gray-300 font-medium leading-relaxed">
                  <span className="text-cyan-400">Step Up to Success!</span> Your journey to the top starts here. 
                  Connect with top companies and achieve your career dreams.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/login">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:from-blue-600 hover:to-cyan-600 shadow-xl shadow-blue-500/50">
                      Get Started <ArrowRight className="w-5 h-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link to="#features">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" variant="outline" className="gap-2 bg-transparent border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                      Learn More
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Student Stepping Up Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[500px] lg:h-[600px] flex items-center justify-center"
            >
              {/* 3D depth effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.7, 0.5]
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut"
                }}
              />
              
              <div className="relative z-10 w-full h-full">
                <StudentSteppingUp />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator with upward arrow */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-blue-400 rounded-full flex items-start justify-center p-2 backdrop-blur-sm bg-white/5"
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              className="w-1.5 h-1.5 bg-blue-400 rounded-full"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4 md:px-8 bg-[#0a0a0a]">
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
      <section id="features" className="relative py-20 px-4 md:px-8 bg-[#0a0a0a]">
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
      <section className="relative py-20 px-4 md:px-8 bg-[#0a0a0a]">
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