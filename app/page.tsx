
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, Users, BarChart3, BookOpen, Rocket, Star, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"
import { AnimatedCard } from "@/components/animated-card"
import { InteractiveStats } from "@/components/interactive-stats"
import { ScrollReveal } from "@/components/scroll-reveal"

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
    <div className="min-h-screen relative overflow-x-hidden bg-gray-50">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-x-hidden">

        <div className="container mx-auto px-4 py-20 relative z-10 max-w-7xl">
          <div className="max-w-4xl mx-auto w-full">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
              >
                <Star className="w-4 h-4 fill-blue-600" />
                <span>India's Leading College Placement Portal</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold leading-tight text-gray-900"
              >
                Reach the TOP
                <br />
                of Your Life
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center gap-3 text-xl md:text-2xl font-semibold text-gray-900">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                  <span>Use our platform and</span>
                </div>
                <p className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed">
                  <span className="text-blue-600 font-bold">Step Up to Success!</span> Your journey to the top starts here.
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
                  <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 text-gray-900 font-bold">
                    Get Started <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="#features">
                  <Button size="lg" variant="outline" className="gap-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-100">
                    Learn More
                  </Button>
                </Link>
              </motion.div>
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
            className="w-6 h-10 border-2 border-blue-600 rounded-full flex items-start justify-center p-2 bg-white"
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
      <section className="relative py-20 px-4 md:px-8 overflow-x-hidden">
        <div className="container mx-auto max-w-7xl">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 ">
                By the <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent ">Numbers</span>
              </h2>
              <p className="text-lg text-gray-600 ">Join thousands of successful graduates</p>
            </div>
          </ScrollReveal>

          <InteractiveStats stats={stats} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4 md:px-8 overflow-x-hidden">
        <div className="container mx-auto max-w-7xl">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Comprehensive{" "}
                <span className="text-blue-600">Solutions</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
                    <div className="text-cyan-300 text-sm font-medium group-hover:translate-x-1 transition-transform">
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
      <section className="relative py-20 px-4 md:px-8 overflow-x-hidden">
        <div className="container mx-auto max-w-7xl">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 ">
                Success <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent ">Stories</span>
              </h2>
              <p className="text-lg text-gray-600 ">Hear from our placed students</p>
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
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 overflow-x-hidden">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" as const }}
              className="inline-block mb-6"
            >
              <Rocket className="w-12 h-12 text-accent" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Ready to Launch Your Career?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join RCE Career Hub today and connect with top companies seeking talent like yours
            </p>
            <Link to="/login">
              <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 text-gray-900">
                Start Your Journey <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}