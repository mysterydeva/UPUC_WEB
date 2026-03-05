"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Box,
  Construction,
  LayoutDashboard,
  ArrowRight,
  ShieldCheck,
  Globe,
  Wallet
} from "lucide-react";
import { FeatureCard } from "@/components/ui/feature-card";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "Smart Construction",
      description: "Monitor job sites and progress with high-resolution visual tracking.",
      icon: <Construction className="w-6 h-6" />,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Inventory Control",
      description: "Real-time stock management with predictive alerts and deep analytics.",
      icon: <Box className="w-6 h-6" />,
      color: "bg-orange-500/10 text-orange-600",
    },
    {
      title: "Financial Precision",
      description: "Automated billing, expense tracking, and comprehensive financial reports.",
      icon: <Wallet className="w-6 h-6" />,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Global Dashboard",
      description: "A bird's-eye view of your entire operation across all platforms.",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "bg-indigo-500/10 text-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen selection:bg-accent/30 flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass premium-shadow px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center text-white font-bold text-xl premium-shadow">
            U
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">UPUC <span className="text-accent">ERP</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#about" className="hover:text-primary transition-colors">About</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">Enterprise</Link>
          <Link href="/dashboard" className="bg-primary text-white px-6 py-2.5 rounded-full hover:bg-primary-light transition-all premium-shadow active:scale-95 text-center">
            Launch Portal
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow pt-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                Next Generation ERP Solution
              </div>
              <h1 className="text-6xl md:text-7xl font-bold text-primary leading-[1.1] tracking-tight">
                Empower Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">Infrastructure</span> Management.
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed max-w-xl">
                The most advanced cloud-based ERP for modern construction and construction firms. Streamline your workflow from the office to the field.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard" className="h-14 px-8 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary-light transition-all premium-shadow group">
                  Go to Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="h-14 px-8 rounded-2xl glass font-bold text-primary hover:bg-white transition-all flex items-center justify-center gap-2">
                  <Globe className="w-5 h-5" /> Schedule Demo
                </button>
              </div>
              <div className="flex items-center gap-6 pt-4 text-sm font-medium text-text-secondary">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-zinc-200 flex items-center justify-center overflow-hidden`}>
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="user" />
                    </div>
                  ))}
                </div>
                <span>Trusted by <span className="text-primary font-bold">500+</span> industry leaders</span>
              </div>
            </motion.div>

            {/* Dashboard Preview Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-3xl bg-zinc-900 overflow-hidden premium-shadow border-[8px] border-zinc-800 shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/10 pointer-events-none" />
                {/* Mockup UI */}
                <div className="p-6 h-full flex flex-col gap-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-4">
                      <LayoutDashboard className="w-5 h-5 text-accent" />
                      <div className="w-32 h-3 bg-white/10 rounded-full" />
                    </div>
                    <div className="flex gap-2">
                      <div className="w-16 h-3 bg-white/5 rounded-full" />
                      <div className="w-8 h-8 rounded-full bg-accent/20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 glass rounded-xl border-white/10 p-4 flex flex-col justify-between">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/20" />
                      <div className="w-full h-2 bg-white/10 rounded-full" />
                    </div>
                    <div className="h-24 glass rounded-xl border-white/10 p-4 flex flex-col justify-between">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20" />
                      <div className="w-full h-2 bg-white/10 rounded-full" />
                    </div>
                  </div>
                  <div className="flex-grow glass rounded-2xl border-white/10 p-4 space-y-4">
                    <div className="w-1/2 h-4 bg-white/10 rounded-full" />
                    <div className="w-full h-32 bg-white/5 rounded-xl animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Floating Element */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-8 -left-8 glass premium-shadow p-6 rounded-2xl border-white/20 z-10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-secondary uppercase">Profit Growth</div>
                    <div className="text-2xl font-bold text-primary">+32.5%</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-primary">Everything you need to <span className="text-accent">scale</span>.</h2>
            <p className="text-text-secondary text-lg">
              One platform, limitless possibilities. Manage every aspect of your construction business from a single interface.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <FeatureCard
                key={idx}
                index={idx}
                {...feature}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-100 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-8 h-8 gradient-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
              U
            </div>
            <span className="font-bold tracking-tight text-primary">UPUC ERP</span>
          </div>
          <p className="text-text-secondary text-sm">
            © 2026 UPUC ERP Solutions Inc. Built for infrastructure excellence.
          </p>
          <div className="flex gap-6 text-sm font-medium text-text-secondary">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
