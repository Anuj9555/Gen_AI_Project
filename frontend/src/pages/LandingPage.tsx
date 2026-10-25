import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-28">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-500/20 to-teal-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-xs font-bold text-brand-700 dark:text-brand-300 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-brand-500 animate-pulse" />
            <span>AI-Powered Autonomous Travel Orchestration</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1] font-['Plus_Jakarta_Sans',sans-serif]">
            Your Dream Journey,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-teal-500 to-emerald-500">
              Curated in Seconds.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stop spending hours toggling tabs and maps. WanderAI creates geographically optimized,
            budget-respecting day-by-day travel itineraries customized to your personal pace and style.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/trips/create')}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto shadow-lg shadow-brand-500/25"
            >
              Start Planning Trip Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto"
            >
              Explore Demo Itineraries
            </Button>
          </div>

          {/* Social Proof */}
          <div className="mt-10 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="text-slate-700 dark:text-slate-300 ml-1">4.9/5 from 12,000+ travelers</span>
            </div>
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />
            <span className="hidden sm:inline">150+ Countries Covered</span>
          </div>

          {/* Interactive Hero Preview Card */}
          <div className="mt-14 max-w-4xl mx-auto rounded-3xl p-2 bg-gradient-to-b from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-2xl border border-slate-200/60 dark:border-slate-800">
            <div className="rounded-2xl bg-white dark:bg-slate-950 p-6 sm:p-8 text-left shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
                <div>
                  <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider block">
                    Curated Preview
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                    4 Days in Kyoto: Temples, Matcha & Historic Alleys
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-500" /> Kyoto, Japan • Balanced Pace • $1,800 USD Budget
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    Est. $1,420 • Under Budget
                  </span>
                </div>
              </div>

              {/* Sample Day Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">09:30 AM • Culture</span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">Fushimi Inari Torii Paths</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Early morning hike through sacred vermilion gates without crowds.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-amber-500 uppercase">01:00 PM • Dining</span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">Nishiki Market Food Crawl</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Tasting skewers, seasonal dango, and artisanal matcha tea.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-indigo-500 uppercase">05:30 PM • Sunset</span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">Gion Lantern Walking Tour</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Evening stroll through preserved wooden machiya architecture.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900/60 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2">
              Engineered For Modern Travelers
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Everything You Need to Travel with Confidence
            </h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Built with state-of-the-art algorithms that prevent zig-zag travel, respect strict budgets, and adapt to your style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <Globe2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Geographic Optimization
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Activities are clustered by district and walking proximity to eliminate wasted hours sitting in traffic or subway transfers.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Real-Time Budget Guardrails
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Automatic daily spending estimation across activities, food, lodging, and transit so you never get surprise bills.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Instant Day Regeneration
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Don't like Day 3? Click regenerate, specify your preference (e.g. "Focus on hidden gardens"), and get an instant re-curation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-teal-700 text-white p-10 sm:p-14 shadow-2xl space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Experience Effortless Travel Planning?
            </h2>
            <p className="text-sm sm:text-base text-brand-100 max-w-xl mx-auto">
              Join thousands of adventurers who trust WanderAI to build their day-by-day itineraries. Free to get started.
            </p>
            <div className="pt-2">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/register')}
                className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 shadow-lg"
              >
                Create Your First Trip Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
