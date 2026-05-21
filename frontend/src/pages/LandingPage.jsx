import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Layers,
  Sparkles,
  Zap,
  BarChart2,
  Palette,
  Download,
  ArrowRight,
  CheckCircle2,
  Star,
  ChevronDown,
  Brain,
  Globe,
  Shield,
  Users,
  TrendingUp,
  Play,
  X,
  Menu,
} from "lucide-react";
import { useUIStore } from "../store/uiStore";
import { useAuthStore } from "../store/authStore";
import { cn } from "../lib/utils";

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Features", "Workflow", "Pricing", "FAQ"];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-(--border) shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-(--text-primary) tracking-tight">
            SlideAI
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="btn-ghost text-sm"
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3 ml-auto">
          {isAuthenticated ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="btn-primary text-sm"
            >
              Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <Link to="/auth/login" className="btn-ghost text-sm">
                Log in
              </Link>
              <Link to="/auth/register" className="btn-primary text-sm">
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu btn */}
        <button
          className="md:hidden ml-auto btn-ghost p-2"
          onClick={() => setMobileOpen((p) => !p)}
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-(--surface)border-b border-(--border) px-5 pb-4 space-y-1"
          >
            {links.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm text-(--text-secondary) hover:text-(--text-primary)"
              >
                {l}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="btn-primary justify-center"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="btn-secondary justify-center text-center"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/auth/register"
                    className="btn-primary justify-center text-center"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ─── Hero ─── */
function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [typed, setTyped] = useState("");
  const phrases = [
    "Create Stunning Presentations with AI",
    "Generate Pitch Decks in Seconds",
    "Turn Ideas into Beautiful Slides",
  ];
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    let i = 0;
    let current = phrases[phraseIdx];
    setTyped("");
    const interval = setInterval(() => {
      setTyped(current.slice(0, i + 1));
      i++;
      if (i === current.length) {
        clearInterval(interval);
        setTimeout(() => {
          setPhraseIdx((p) => (p + 1) % phrases.length);
        }, 2200);
      }
    }, 38);
    return () => clearInterval(interval);
  }, [phraseIdx]);

  const floatingCards = [
    {
      label: "AI Pitch Deck",
      color: "from-blue-500 to-blue-600",
      x: "-left-4",
      y: "top-8",
      delay: 0,
    },
    {
      label: "Marketing Deck",
      color: "from-violet-500 to-violet-600",
      x: "-right-6",
      y: "top-20",
      delay: 0.5,
    },
    {
      label: "Product Roadmap",
      color: "from-emerald-500 to-emerald-600",
      x: "-left-8",
      y: "bottom-12",
      delay: 1,
    },
    {
      label: "Sales Proposal",
      color: "from-amber-500 to-amber-600",
      x: "-right-4",
      y: "bottom-4",
      delay: 1.5,
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background glows */}
      <div className="hero-glow w-96 h-96 bg-blue-500 -top-20 -left-20" />
      <div className="hero-glow w-80 h-80 bg-violet-500 top-1/3 -right-20" />
      <div className="hero-glow w-64 h-64 bg-cyan-400 bottom-0 left-1/3" />
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern" />

      <div className="relative z-10 max-w-5xl mx-auto px-5 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-(--border) bg-(--surface)shadow-sm text-sm font-medium text-(--text-secondary) mb-7"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          Powered by Advanced AI Models
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-(--text-primary) leading-tight tracking-tight mb-5"
        >
          <span className="gradient-text">{typed}</span>
          <span className="animate-pulse text-blue-400">|</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-lg text-(--text-secondary) max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Generate professional PowerPoint presentations in seconds. Just
          describe your idea — AI plans, designs, and builds every slide.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() =>
              navigate(isAuthenticated ? "/dashboard/create" : "/auth/register")
            }
            className="btn-primary text-base px-7 py-3 rounded-2xl gap-3 shadow-brand"
          >
            <Sparkles className="w-5 h-5" />
            Generate Free
          </button>
          <a
            href="#workflow"
            className="btn-secondary text-base px-7 py-3 rounded-2xl gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            See how it works
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5 text-sm text-(--text-muted)"
        >
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-1">4.9/5 from 500+ users</span>
          </div>
          <span className="hidden sm:block w-px h-4 bg-(--border)" />
          <span>✨ No credit card required</span>
          <span className="hidden sm:block w-px h-4 bg-(--border)" />
          <span>⚡ Generates in under 2 minutes</span>
        </motion.div>

        {/* Floating slide cards visual */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative mt-16 mx-auto max-w-3xl"
        >
          {/* Main preview card */}
          <div className="card shadow-card-hover overflow-hidden rounded-2xl border-(--border)">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-(--border) bg-(--bg-secondary)">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="flex-1 mx-3 h-6 rounded-md bg-(--bg-tertiary) flex items-center px-3">
                <span className="text-xs text-(--text-muted)">
                  slideai.app/editor
                </span>
              </div>
            </div>
            {/* Fake editor */}
            <div className="flex h-56 sm:h-72">
              {/* Left panel */}
              <div className="w-24 sm:w-32 border-r border-(--border) bg-(--bg-secondary) p-2 space-y-2 shrink-0">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-14 rounded-lg",
                      i === 0
                        ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-400"
                        : "bg-(--bg-tertiary)"
                    )}
                  />
                ))}
              </div>
              {/* Center slide */}
              <div className="flex-1 bg-linear-to-br from-blue-50 to-violet-50 dark:from-zinc-900 dark:to-zinc-800 flex flex-col items-center justify-center gap-4 p-6">
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-center space-y-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center mx-auto">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div
                    className="h-4 w-48 rounded 
                  bg-(--text-primary) opacity-80 mx-auto"
                  />
                  <div
                    className="h-2.5 w-36 rounded 
                  bg-(--text-muted) opacity-50 mx-auto"
                  />
                  <div
                    className="h-2.5 w-40 rounded 
                  bg-(--text-muted) opacity-40 mx-auto"
                  />
                </motion.div>
              </div>
              {/* Right panel */}
              <div className="w-44 border-l border-(--border) bg-(--bg-secondary) p-3 space-y-3 hidden sm:block shrink-0">
                <div className="h-3 w-20 rounded bg-(--bg-tertiary)" />
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 rounded-lg bg-(--bg-tertiary) flex items-center px-3 gap-2"
                  >
                    <div className="w-3 h-3 rounded bg-blue-300 dark:bg-blue-700 shrink-0" />
                    <div
                      className="h-2 flex-1 rounded 
                    bg-(--border)"
                    />
                  </div>
                ))}
                <div className="h-24 rounded-xl bg-linear-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 flex items-center justify-center">
                  <BarChart2 className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-4 -left-6 bg-(--surface)border border-(--border) rounded-xl px-3 py-2 shadow-card text-xs font-semibold text-(--text-primary) items-center gap-2 hidden sm:flex"
          >
            <Brain className="w-4 h-4 text-blue-500" /> AI Planning
          </motion.div>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
            className="absolute -top-4 -right-4 bg-(--surface)border border-(--border) rounded-xl px-3 py-2 shadow-card text-xs font-semibold text-emerald-600  items-center gap-2 hidden sm:flex"
          >
            <CheckCircle2 className="w-4 h-4" /> Slide Ready!
          </motion.div>
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-(--surface)border border-(--border) rounded-xl px-3 py-2 shadow-card text-xs font-semibold text-violet-600 flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> PPTX Export Ready
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronDown className="w-5 h-5 text-(--text-muted)" />
      </motion.div>
    </section>
  );
}

/* ─── Features ─── */
const FEATURES = [
  {
    icon: Brain,
    label: "AI Slide Generation",
    desc: "Describe your topic and AI builds the entire presentation structure, layout, and content automatically.",
    color: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  },
  {
    icon: Sparkles,
    label: "Smart Layout Engine",
    desc: "Premium slide layouts chosen automatically based on content type — charts, diagrams, bullet points.",
    color:
      "bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400",
  },
  {
    icon: BarChart2,
    label: "Charts & Diagrams",
    desc: "Auto-generated donut charts, bar charts, flow diagrams, and architecture visuals built into slides.",
    color: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
  },
  {
    icon: Palette,
    label: "Theme Generator",
    desc: "Beautiful color themes generated for each presentation — dark, light, corporate, and more.",
    color: "bg-pink-50 dark:bg-pink-950 text-pink-600 dark:text-pink-400",
  },
  {
    icon: Zap,
    label: "Real-time Editing",
    desc: "Use AI to edit individual slides with natural language instructions after generation.",
    color: "bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400",
  },
  {
    icon: Download,
    label: "Export to PPTX",
    desc: "Download your presentation as a real PowerPoint .pptx file ready to present or share.",
    color:
      "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Globe,
    label: "Any Topic",
    desc: "Business, education, technology, healthcare, marketing — works across all industries and subjects.",
    color:
      "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400",
  },
  {
    icon: Shield,
    label: "Secure & Private",
    desc: "Your prompts and presentations are stored securely and are only accessible by you.",
    color: "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-5">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-(--brand) mb-3 block">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-(--text-primary) mb-4">
            Everything you need to create
            <br className="hidden sm:block" /> amazing presentations
          </h2>
          <p className="text-(--text-secondary) max-w-xl mx-auto">
            SlideAI handles the entire pipeline — from understanding your prompt
            to generating download-ready PPTX files.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="card p-5 hover:shadow-card-hover transition-all duration-300 group"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                  f.color
                )}
              >
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-(--text-primary) mb-1.5">
                {f.label}
              </h3>
              <p className="text-xs text-(--text-muted) leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Workflow ─── */
const STEPS = [
  {
    num: "01",
    icon: Brain,
    title: "Write Your Prompt",
    desc: "Describe your presentation topic, audience, number of slides, and style in plain English.",
    color: "text-blue-500",
  },
  {
    num: "02",
    icon: Sparkles,
    title: "AI Plans Structure",
    desc: "Our AI extracts intent, plans slide count, assigns layouts, icons, charts, and color themes.",
    color: "text-violet-500",
  },
  {
    num: "03",
    icon: Zap,
    title: "Slides Generated",
    desc: "Each slide is generated using PptxGenJS with professional layouts, charts, and diagrams.",
    color: "text-amber-500",
  },
  {
    num: "04",
    icon: Download,
    title: "Download PPTX",
    desc: "Your presentation downloads as a real .pptx file ready to open in PowerPoint or Google Slides.",
    color: "text-emerald-500",
  },
];

function WorkflowSection() {
  return (
    <section id="workflow" className="py-24 px-5 bg-(--bg-secondary)">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-(--brand) mb-3 block">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-(--text-primary) mb-4">
            From prompt to presentation
            <br className="hidden sm:block" /> in under 2 minutes
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div
                  className="hidden lg:block absolute top-7 left-[calc(50%+24px)] right-0 h-px bg-linear-to-r 
                from-(--border) to-transparent z-0"
                />
              )}
              <div className="card p-5 relative z-10 text-center">
                <div className="text-xs font-bold text-(--text-muted) mb-3">
                  {s.num}
                </div>
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl bg-(--bg-tertiary) flex items-center justify-center mx-auto mb-4",
                    s.color
                  )}
                >
                  <s.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-sm text-(--text-primary) mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-(--text-muted) leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Stats ─── */
function StatsSection() {
  const stats = [
    { value: "10K+", label: "Presentations Generated" },
    { value: "500+", label: "Active Users" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "<2min", label: "Average Generation Time" },
  ];
  return (
    <section className="py-16 px-5 bg-linear-to-br from-blue-600 to-violet-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center text-white"
            >
              <p className="text-4xl font-extrabold mb-1">{s.value}</p>
              <p className="text-blue-100 text-sm">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ─── */
const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Get started and explore AI presentation generation.",
    features: [
      "5 presentations/month",
      "Up to 10 slides each",
      "PPTX export",
      "Basic themes",
      "Standard support",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    desc: "For professionals who create presentations regularly.",
    features: [
      "Unlimited presentations",
      "Up to 20 slides each",
      "PPTX export",
      "All premium themes",
      "AI slide editing",
      "Priority support",
      "Early access features",
    ],
    cta: "Start Pro Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    desc: "For teams and organizations at scale.",
    features: [
      "Everything in Pro",
      "Team workspace",
      "Custom branding",
      "API access",
      "SLA guarantee",
      "Dedicated support",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

function PricingSection() {
  const navigate = useNavigate();
  return (
    <section id="pricing" className="py-24 px-5">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-(--brand) mb-3 block">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-(--text-primary) mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-(--text-secondary)">
            Start free. Upgrade when you're ready.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "card p-6 flex flex-col relative",
                plan.highlight &&
                  "border-blue-500 ring-1 ring-blue-500 shadow-brand"
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-bold shadow">
                  Most Popular
                </div>
              )}
              <div className="mb-5">
                <h3 className="font-bold text-(--text-primary) text-lg">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-extrabold text-(--text-primary)">
                    {plan.price}
                  </span>
                  <span className="text-sm text-(--text-muted)">
                    /{plan.period}
                  </span>
                </div>
                <p className="text-xs text-(--text-muted) mt-2">{plan.desc}</p>
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-(--text-secondary)"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/auth/register")}
                className={cn(
                  plan.highlight
                    ? "btn-primary w-full justify-center"
                    : "btn-secondary w-full justify-center"
                )}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
const FAQS = [
  {
    q: "How does the AI generate presentations?",
    a: "You provide a text prompt. Our AI pipeline extracts your intent, plans slide structure, assigns layouts and chart types, then generates each slide as a real PPTX file using PptxGenJS.",
  },
  {
    q: "What formats can I download?",
    a: "You can download your presentation as a .pptx file compatible with Microsoft PowerPoint, Google Slides, and LibreOffice.",
  },
  {
    q: "Can I edit slides after generation?",
    a: "Yes! Once generated, you can use the AI editor to modify individual slides by writing natural language instructions. The AI will update that slide for you.",
  },
  {
    q: "How many slides can it generate?",
    a: "The AI can generate between 3 and 15 slides per presentation depending on your prompt and chosen plan.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your prompts and generated presentations are stored securely and are only visible to you. We never share or sell your data.",
  },
];

function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className="py-24 px-5 bg-(--bg-secondary)">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-(--brand) mb-3 block">
            FAQ
          </span>
          <h2 className="text-3xl font-extrabold text-(--text-primary)">
            Frequently asked questions
          </h2>
        </motion.div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="card overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-semibold text-sm text-(--text-primary)">
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-(--text-muted) shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm text-(--text-secondary) leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTASection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  return (
    <section className="py-24 px-5">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card p-10 text-center bg-linear-to-br from-blue-50 to-violet-50 dark:from-blue-950/40 dark:to-violet-950/40 border-blue-200 dark:border-blue-800 relative overflow-hidden"
        >
          <div className="hero-glow w-48 h-48 bg-blue-400 -top-10 -left-10" />
          <div className="hero-glow w-48 h-48 bg-violet-400 -bottom-10 -right-10" />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-5 shadow-brand">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-(--text-primary) mb-3">
              Ready to create your first AI presentation?
            </h2>
            <p className="text-(--text-secondary) mb-7 max-w-md mx-auto">
              Join thousands of professionals who save hours every week with
              SlideAI.
            </p>
            <button
              onClick={() =>
                navigate(
                  isAuthenticated ? "/dashboard/create" : "/auth/register"
                )
              }
              className="btn-primary text-base px-8 py-3 rounded-2xl shadow-brand"
            >
              <Sparkles className="w-5 h-5" />
              {isAuthenticated ? "Create Presentation" : "Get Started Free"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="border-t border-(--border) bg-(--bg-secondary) px-5 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-(--text-primary)">SlideAI</span>
            </div>
            <p className="text-xs text-(--text-muted) leading-relaxed">
              AI-powered presentations that look stunning and get results.
            </p>
          </div>
          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Templates", "Changelog"],
            },
            { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
            {
              title: "Legal",
              links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold text-(--text-primary) uppercase tracking-wide mb-3">
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-xs text-(--text-muted) hover:text-(--text-primary) transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-(--border) pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-(--text-muted)">
            © 2026 SlideAI. All rights reserved.
          </p>
          <p className="text-xs text-(--text-muted)">Built with ❤️ using AI</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Full Landing Page ─── */
export function LandingPage() {
  return (
    <div className="bg-(--bg)">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <WorkflowSection />
      <StatsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
