/**
 * TemplateDeckExplorer.jsx
 *
 * ARCHITECTURE OVERVIEW
 * ─────────────────────────────────────────────────────────────────
 * • 200 unique theme tokens (expanded from 100)
 * • 2,000 deck combinations (expanded from 1,000)
 * • ProjectDetailPage-exact preview viewport with correct scale-fit
 * • Left sidebar: scrollable slide thumbnail strip (like ProjectDetailPage)
 * • Center: scale-fitted preview that NEVER overflows
 * • Right panel: Theme editor + deck metadata inspector
 * • Full search + filter bar in header
 * • Inspector modal with full slide-by-slide navigation
 * • PPTX export pipeline preserved
 * • All responsive breakpoints handled correctly
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PptxGenJS from "pptxgenjs";
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  BookOpen,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Cloud,
  Code2,
  Copy,
  Cpu,
  Database,
  Download,
  Eye,
  FileText,
  Filter,
  Flame,
  GitBranch,
  Layers,
  LayoutGrid,
  LineChart,
  ListChecks,
  Lock,
  MapPin,
  MessageSquareMore,
  MonitorPlay,
  Palette,
  Radar,
  Rocket,
  Search,
  Workflow,
  X,
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Sliders,
  RefreshCw,
  ArrowLeft,
  Shuffle,
  SlidersHorizontal,
  ExternalLink,
  CheckCheck,
  Layers3,
  Moon,
  Sun,
  Wand2,
  BotMessageSquare,
} from "lucide-react";
import { toast } from "sonner";

// ── Template registry ──────────────────────────────────────────────
import { heroTemplates } from "../lib/templates/hero";
import { contentTemplates } from "../lib/templates/content";
import { closingTemplates } from "../lib/templates/closing";
import { Link, useNavigate } from "react-router-dom";

const templateRegistry = {
  ...heroTemplates,
  ...contentTemplates,
  ...closingTemplates,
};

const HERO_KEYS =
  Object.keys(heroTemplates).length > 0
    ? Object.keys(heroTemplates)
    : [
        "hero_centered",
        "hero_split_left",
        "hero_split_right",
        "hero_full_bleed",
        "hero_gradient",
        "hero_diagonal",
        "hero_minimal",
      ];

const CONTENT_KEYS =
  Object.keys(contentTemplates).length > 0
    ? Object.keys(contentTemplates)
    : [
        "content_title_bullets",
        "content_title_paragraph",
        "content_two_column",
        "content_image_left",
        "content_image_right",
        "content_three_column",
        "content_four_grid",
        "content_icon_list",
        "content_numbered_steps",
        "content_timeline_horizontal",
        "content_checklist",
        "content_comparison_table",
        "content_pros_cons",
        "content_stats_metrics",
        "content_timeline_vertical",
        "content_process_flow",
        "content_chart_placeholder",
        "content_pricing_table",
        "content_icon_grid_3x2",
        "content_image_gallery",
        "content_quote_testimonial",
        "content_team_grid",
        "content_faq_accordion",
        "content_code_block",
        "content_callout_box",
      ];

const CLOSING_KEYS =
  Object.keys(closingTemplates).length > 0
    ? Object.keys(closingTemplates)
    : [
        "closing_contact_card",
        "closing_questions_cta",
        "closing_social_connect",
        "closing_elegant_minimal",
        "closing_simple",
      ];

const FONT_FAMILIES = [
  "Inter",
  "Manrope",
  "Sora",
  "Poppins",
  "Montserrat",
  "DM Sans",
  "Outfit",
  "Space Grotesk",
  "Plus Jakarta Sans",
  "IBM Plex Sans",
  "Nunito",
  "Raleway",
  "Figtree",
  "Geist",
];

// ── Comprehensive mock data (all template keys) ────────────────────
const MOCK_DATA = {
  global: {
    topic: "Enterprise Core Operational Architecture",
    subtitle: "High-Fidelity Automated Analysis Execution Systems",
    organization: "Zorvyn Advanced FinTech Networks",
    timestamp: "Q3 Fiscal Operations Blueprint",
  },
  hero_centered: {
    title: "Enterprise Core Operational Architecture",
    subtitle: "High-Fidelity Automated Analysis Execution Systems",
    icon: "Sparkles",
  },
  hero_split_left: {
    title: "Systemic Infrastructure Overhaul",
    subtitle: "Zorvyn Advanced FinTech Networks",
    icon: "Zap",
  },
  hero_split_right: {
    title: "Distributed Ledger Systems",
    subtitle: "High-Fidelity Automated Analysis Execution Systems",
    icon: "Shield",
  },
  hero_full_bleed: {
    title: "Next-Gen Analytics Engine",
    subtitle: "Autonomous Control Plane Data Flow Systems",
    icon: "Activity",
  },
  hero_gradient: {
    title: "Fluid Scalability Models",
    subtitle: "Adaptive Framework Engineering Matrix",
    icon: "Flame",
  },
  hero_diagonal: {
    title: "Vector Intersection Points",
    subtitle: "Cross-Platform Pipeline Ingestion Matrix",
    icon: "Target",
  },
  hero_minimal: {
    title: "Minimal Core Interface",
    subtitle: "Streamlined Architecture Platform Specs",
    icon: "Cpu",
  },
  content_title_bullets: {
    title: "Primary Operational Benchmarks",
    subtitle: "Key telemetry points monitored across infrastructure",
    bullets: [
      "Real-time data stream parsing engines at sub-millisecond latency",
      "Automated fault isolation and self-healing pipeline triggers",
      "Dynamic color palette runtime adjustments across all nodes",
      "Encrypted transaction validation with zero downtime guarantees",
    ],
  },
  content_title_paragraph: {
    title: "Systemic Structural Assessment",
    content:
      "The distributed operations framework balances high-throughput ledger ingestion with low-overhead color mapping matrices. This state preserves client connectivity while performing live parallel computing calculations across globally distributed partitions with enterprise-grade reliability and fault tolerance built in at every layer.",
  },
  content_two_column: {
    title: "Comparative System Execution",
    contentLeft:
      "Legacy network layouts rely on static data nodes requiring frequent manual interventions, causing higher latency and potential layout drift during extreme traffic scale expansions across multiple geographic regions.",
    contentRight:
      "Modern modular micro-engines use real-time color processing protocols and isolated layout arrays to provide real-time updates without taxing centralized database infrastructure elements.",
  },
  content_image_left: {
    title: "Visual Analytics Ingestion",
    content:
      "The attached visual diagram maps current node cluster operations and data sync integrity states across all live geographic datacenters, showing real-time performance metrics and anomaly detection patterns.",
    imageUrl: "https://picsum.photos/seed/analytics-left/1000/750",
  },
  content_image_right: {
    title: "Telemetry Dashboard Frame",
    content:
      "Operators track micro-frontend pipeline anomalies directly from this layout template panel without leaving the central workspace window context, enabling faster response times and improved operational visibility.",
    imageUrl: "https://picsum.photos/seed/telemetry-right/1000/750",
  },
  content_three_column: {
    title: "Tri-Factor Process Breakdown",
    columns: [
      {
        title: "Ingestion Core",
        content:
          "Parses multiple real-time feeds from active edge computing units with automatic backpressure management.",
      },
      {
        title: "Processing Node",
        content:
          "Executes micro-obfuscation algorithms and applies dynamic styles across all active pipeline segments.",
      },
      {
        title: "Delivery Grid",
        content:
          "Outputs formatted telemetry files instantly to presentation layer interfaces with zero-copy buffer transfers.",
      },
    ],
  },
  content_four_grid: {
    title: "Quad-Domain Architecture Breakdown",
    items: [
      {
        title: "Security Matrix",
        content:
          "Automated threat intelligence scans operational layers continuously with ML-powered anomaly detection.",
      },
      {
        title: "Style Injector",
        content:
          "Applies 200 programmatic custom themes fluidly on active canvas nodes without reinitialization.",
      },
      {
        title: "Export Pipeline",
        content:
          "Generates high-fidelity PowerPoint binary files natively via memory buffers with vector preservation.",
      },
      {
        title: "Validation Engine",
        content:
          "Enforces structure and layout rules across all cards seamlessly with schema-level guarantees.",
      },
    ],
  },
  content_icon_list: {
    title: "Integrated Tooling Stack Overview",
    items: [
      {
        text: "Socket.IO real-time bi-directional messaging pipeline integrations for live collaboration",
      },
      {
        text: "WebRTC peer connection frameworks for enterprise-grade live streaming viewport operations",
      },
      {
        text: "Tailwind CSS utility architecture with JIT compilation for zero-runtime style injection",
      },
      {
        text: "Framer Motion complex programmatic spring animation systems with hardware acceleration",
      },
    ],
  },
  content_numbered_steps: {
    title: "System Deployment Protocol",
    steps: [
      {
        title: "1. Scope Definition",
        desc: "Isolate client target parameters and register structural requirements across all service boundaries.",
      },
      {
        title: "2. Palette Ingestion",
        desc: "Select from 200 generated color tokens using relative contrast maps and WCAG compliance checks.",
      },
      {
        title: "3. Layout Assembly",
        desc: "Inject specific layout blocks between hero and closing pairs using deterministic combination rules.",
      },
      {
        title: "4. Output Distribution",
        desc: "Package complete data payloads directly into production-ready binary presentation structures.",
      },
    ],
  },
  content_timeline_horizontal: {
    title: "Fiscal Development Timeline",
    items: [
      {
        title: "Phase 1",
        desc: "Establish core platform specifications and initialize distributed service repositories.",
      },
      {
        title: "Phase 2",
        desc: "Develop relative luminance algorithms and test palette scale generation accuracy.",
      },
      {
        title: "Phase 3",
        desc: "Deploy automated layout combination generators supporting up to 2000 variation seeds.",
      },
      {
        title: "Phase 4",
        desc: "Optimize responsive flex container rows and paginate layouts across all viewports.",
      },
    ],
  },
  content_checklist: {
    title: "Compliance Audit Checklist",
    subtitle: "Mandatory steps before triggering production deployments",
    items: [
      "Verify WCAG AAA relative color luminance values across all theme profiles",
      "Validate absolute structural unique identities inside array hooks",
      "Confirm flex wrapping bounds across standard and ultra-wide viewports",
      "Sanitize structural inputs against null parsing and injection anomalies",
    ],
  },
  content_comparison_table: {
    title: "Architecture Performance Comparison",
    headers: [
      "Infrastructure Vector",
      "Standard Platform",
      "Optimized Cluster",
    ],
    rows: [
      [
        "Initialization Latency",
        "1250ms Core Startup",
        "85ms Immediate Hydration",
      ],
      ["Maximum Operational Load", "450 Actions/Sec", "12,500 Actions/Sec"],
      [
        "Dynamic Config Support",
        "Manual Restart Required",
        "Hot Module Reload Direct",
      ],
    ],
  },
  content_pros_cons: {
    title: "Algorithmic Generation Review",
    pros: [
      "Creates thousands of diverse combinations immediately on application load",
      "Maintains clean structural rules across variable slide count configurations",
      "Enforces layout isolation principles inside each card scope boundary",
    ],
    cons: [
      "Increased client-side calculation spikes on lower-end processor hardware",
      "Requires exhaustive placeholder objects for all layout configuration keys",
    ],
  },
  content_stats_metrics: {
    title: "Infrastructure Scale Performance Metrics",
    stats: [
      { label: "Data Throughput", value: "4.8 Gbps" },
      { label: "Active Engine Nodes", value: "2,048 Units" },
      { label: "System Uptime Rate", value: "99.998%" },
      { label: "Live Connections", value: "87.4k Active" },
    ],
  },
  content_timeline_vertical: {
    title: "Operational Milestone Records",
    items: [
      {
        date: "01/26",
        title: "Core Architecture Setup",
        text: "Initialized internal structures and registered basic layout template assets.",
      },
      {
        date: "03/26",
        title: "Combinatorial Engine Alpha",
        text: "Achieved deterministic processing of large structural configuration chains at scale.",
      },
      {
        date: "05/26",
        title: "Production Deployment",
        text: "Integrated layout dashboards and multi-channel selector panels across environments.",
      },
    ],
  },
  content_process_flow: {
    title: "Data Stream Lifecycle Graph",
    steps: [
      "Raw Packet Ingestion",
      "Luminance Validation",
      "Obfuscation Processing",
      "Final Interface Delivery",
    ],
    theme: {},
  },
  content_chart_placeholder: {
    title: "Operational Scaling Projection Charts",
    chartType: "bar",
    seriesName: "Ingestion Volume",
    chartData: {
      labels: ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"],
      values: [45, 72, 58, 91, 64],
    },
  },
  content_pricing_table: {
    title: "Enterprise Service Licensing Tiers",
    plans: [
      {
        name: "Standard Cluster",
        price: "$499/mo",
        features: [
          "50 structural pipelines",
          "Standard palette support",
          "Basic telemetry export",
        ],
      },
      {
        name: "Advanced Network",
        price: "$1,499/mo",
        features: [
          "Unlimited layout builds",
          "Full 200 themes library",
          "Sub-ms update guarantees",
        ],
      },
      {
        name: "Enterprise Critical",
        price: "Custom Quote",
        features: [
          "Isolated deployment pods",
          "Dedicated tuning teams",
          "Custom cryptographic keys",
        ],
      },
    ],
  },
  content_icon_grid_3x2: {
    title: "Platform Architecture Key Pillars",
    items: Array.from({ length: 6 }, (_, i) => ({
      icon: ["Shield", "Cpu", "Zap", "Cloud", "Lock", "TrendingUp"][i],
      title: [
        "Impenetrable Security",
        "High-Density Processing",
        "Instant Response",
        "Cloud Native",
        "Encrypted Transactions",
        "Predictive Scaling",
      ][i],
      text: "Guarantees reliable, predictable computing metrics under the most complex workflow conditions.",
    })),
  },
  content_image_gallery: {
    title: "Geographic Infrastructure Gallery",
    images: [
      {
        url: "https://picsum.photos/seed/node-a/600/400",
        caption: "Primary Datacenter Node",
      },
      {
        url: "https://picsum.photos/seed/node-b/600/400",
        caption: "Secondary Backup Vault",
      },
      {
        url: "https://picsum.photos/seed/node-c/600/400",
        caption: "Edge Computing Tower",
      },
      {
        url: "https://picsum.photos/seed/node-d/600/400",
        caption: "High-Throughput Mainframe",
      },
    ],
  },
  content_quote_testimonial: {
    title: "Executive Endorsement Review",
    quote:
      '"Transitioning to programmatic layout assemblies completely eliminated manual design bottlenecks, letting our engineers focus entirely on low-latency telemetry tooling for critical pipeline monitoring."',
    author: "Arjun S. Gade",
    role: "Principal Systems Infrastructure Architect",
    company: "Zorvyn FinTech Corporation",
  },
  content_team_grid: {
    title: "Core Development Leadership",
    members: [
      { name: "Arjun S. Gade", role: "Lead Systems Architect" },
      { name: "Sarah Jenkins", role: "Framework Engineering Director" },
      { name: "Marcus Vance", role: "Color Calibration Specialist" },
      { name: "Elena Rostova", role: "Distributed Database Architect" },
    ],
  },
  content_faq_accordion: {
    title: "Platform FAQ",
    faqs: [
      {
        q: "How are 200 theme tokens calculated?",
        a: "Built dynamically from core baseline palettes by shifting hue/saturation values and calculating relative readability contrast ratios per WCAG standards.",
      },
      {
        q: "Can slides export to editable PPTX?",
        a: "Yes — the system hooks natively into PptxGenJS memory buffers to export fully structured, editable PowerPoint slide configurations.",
      },
      {
        q: "What rules govern combination generation?",
        a: "Decks are 7–11 slides. Slot 1 is a Hero, last slot is Closing, and all middle slots contain randomized but structurally valid content templates.",
      },
    ],
  },
  content_code_block: {
    title: "Theme Calculation Runtime Manifest",
    language: "javascript",
    code: `function generateTheme(baseColor, idx) {\n  const accent = mixHex(baseColor, "#FFFFFF", idx * 0.03);\n  const font = FONT_FAMILIES[idx % FONT_FAMILIES.length];\n  return {\n    id: \`theme_\${idx}\`,\n    accentColor: accent,\n    fontFamily: font,\n    contrastOptimized: true,\n  };\n}`,
  },
  content_callout_box: {
    title: "Critical Safety Operations Notice",
    type: "warning",
    message:
      "System metrics indicate elevated synchronization density across fallback zones. Ensure all relative luminance contrast levels map safely to accessible text constraints before updating production pipelines.",
  },
  closing_contact_card: {
    title: "Initialize Platform Engagement",
    name: "Zorvyn Operations Command Center",
    email: "infrastructure@zorvyn.com",
    phone: "+1 (888) 505-CORE",
    theme: {},
  },
  closing_questions_cta: {
    title: "Questions About This System?",
    subtitle:
      "Reach out to discuss scalability metrics or custom integration tracks.",
    cta: "Schedule System Review",
    theme: {},
  },
  closing_social_connect: {
    title: "Global Developer Channels",
    socials: [
      { platform: "LinkedIn", handle: "linkedin.com/company/zorvyn" },
      { platform: "GitHub", handle: "github.com/zorvyn-labs" },
      { platform: "Status", handle: "status.zorvyn.net" },
    ],
    icons: ["Users", "Code2", "Activity"],
  },
  closing_elegant_minimal: {
    title: "Operational Briefing Adjourned",
    subtitle: "Zorvyn Advanced FinTech Networks Platform Overview",
    theme: {},
  },
  closing_simple: {
    title: "Thank You For Your Review",
    subtitle: "End of Telemetry Infrastructure Deployment Briefing",
    theme: {},
  },
};

// ── Color math helpers ─────────────────────────────────────────────
function hexToRgb(hex) {
  const c = hex.replace("#", "");
  const v =
    c.length === 3
      ? c
          .split("")
          .map((x) => x + x)
          .join("")
      : c;
  const n = parseInt(v, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHex(r, g, b) {
  return `#${[r, g, b]
    .map((v) =>
      Math.max(0, Math.min(255, Math.round(v)))
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;
}
function mixHex(hexA, hexB, t = 0.5) {
  const a = hexToRgb(hexA),
    b = hexToRgb(hexB);
  return rgbToHex(
    a.r + (b.r - a.r) * t,
    a.g + (b.g - a.g) * t,
    a.b + (b.b - a.b) * t
  );
}
function readableText(bg) {
  const { r, g, b } = hexToRgb(bg);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55
    ? "#0F172A"
    : "#F8FAFC";
}

// ── 200-token theme generator ──────────────────────────────────────
function generateThemePresets() {
  const BASE_PROFILES = [
    {
      name: "Obsidian Core",
      bg: "#090D16",
      surface: "#111827",
      accent: "#3B82F6",
      mode: "dark",
    },
    {
      name: "Emerald Command",
      bg: "#04241C",
      surface: "#093A2F",
      accent: "#10B981",
      mode: "dark",
    },
    {
      name: "Neon Slate",
      bg: "#0B0F19",
      surface: "#1E293B",
      accent: "#8B5CF6",
      mode: "dark",
    },
    {
      name: "Crimson Forge",
      bg: "#1C0A0A",
      surface: "#2D1515",
      accent: "#EF4444",
      mode: "dark",
    },
    {
      name: "Amber Grid",
      bg: "#120B02",
      surface: "#1F1507",
      accent: "#F59E0B",
      mode: "dark",
    },
    {
      name: "Midnight Teal",
      bg: "#060F12",
      surface: "#0D1F25",
      accent: "#06B6D4",
      mode: "dark",
    },
    {
      name: "Deep Violet",
      bg: "#0D0714",
      surface: "#1A0F2E",
      accent: "#A855F7",
      mode: "dark",
    },
    {
      name: "Iron Furnace",
      bg: "#111111",
      surface: "#1C1C1C",
      accent: "#F97316",
      mode: "dark",
    },
    {
      name: "Navy Ops",
      bg: "#05101E",
      surface: "#0A1F35",
      accent: "#38BDF8",
      mode: "dark",
    },
    {
      name: "Forest Deep",
      bg: "#071410",
      surface: "#0F2520",
      accent: "#84CC16",
      mode: "dark",
    },
    {
      name: "Alabaster Base",
      bg: "#F8FAFC",
      surface: "#FFFFFF",
      accent: "#2563EB",
      mode: "light",
    },
    {
      name: "Ivory Mint",
      bg: "#F4FBF7",
      surface: "#FFFFFF",
      accent: "#059669",
      mode: "light",
    },
    {
      name: "Frosted Slate",
      bg: "#F1F5F9",
      surface: "#FFFFFF",
      accent: "#4F46E5",
      mode: "light",
    },
    {
      name: "Rose Quartz",
      bg: "#FFF5F5",
      surface: "#FFFFFF",
      accent: "#DB2777",
      mode: "light",
    },
    {
      name: "Sunset Cloud",
      bg: "#FFFBEB",
      surface: "#FFFFFF",
      accent: "#D97706",
      mode: "light",
    },
    {
      name: "Pearl Cyan",
      bg: "#F0FFFE",
      surface: "#FFFFFF",
      accent: "#0891B2",
      mode: "light",
    },
    {
      name: "Lavender Mist",
      bg: "#F5F3FF",
      surface: "#FFFFFF",
      accent: "#7C3AED",
      mode: "light",
    },
    {
      name: "Soft Coral",
      bg: "#FFF7F3",
      surface: "#FFFFFF",
      accent: "#EA580C",
      mode: "light",
    },
    {
      name: "Sky Wash",
      bg: "#F0F9FF",
      surface: "#FFFFFF",
      accent: "#0284C7",
      mode: "light",
    },
    {
      name: "Warm Linen",
      bg: "#FAFAF7",
      surface: "#FFFFFF",
      accent: "#65A30D",
      mode: "light",
    },
  ];

  const palettes = [];
  let id = 1;
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < BASE_PROFILES.length; j++) {
      const p = BASE_PROFILES[j];
      const t = i * 0.07;
      const accent = mixHex(p.accent, j % 2 === 0 ? "#F43F5E" : "#10B981", t);
      const bg =
        p.mode === "dark"
          ? mixHex(p.bg, "#020408", i * 0.04)
          : mixHex(p.bg, "#FFFFFF", i * 0.025);
      const surface =
        p.mode === "dark"
          ? mixHex(p.surface, "#1F2937", i * 0.035)
          : mixHex(p.surface, "#E2E8F0", i * 0.018);
      const text = readableText(bg);
      const secText = mixHex(text, bg, p.mode === "dark" ? 0.38 : 0.52);
      palettes.push({
        id: `theme_${String(id).padStart(3, "0")}`,
        name: `${p.name} S${i + 1}`,
        backgroundColor: bg,
        surfaceColor: surface,
        primaryTextColor: text,
        secondaryTextColor: secText,
        accentColor: accent,
        fontFamily: FONT_FAMILIES[id % FONT_FAMILIES.length],
        mode: p.mode,
      });
      id++;
    }
  }
  return palettes;
}

const THEME_PRESETS = generateThemePresets();

// ── 2000-deck combination engine ───────────────────────────────────
function generate2000Decks(themes) {
  const decks = [];
  let seed = 7919; // prime seed

  // FIXED: Removed the invalid mixed-type BigInt evaluation expression
  const rng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 1; i <= 2000; i++) {
    const theme = themes[(i - 1) % themes.length];
    const slideCount = Math.floor(rng() * 5) + 7; // 7–11
    const heroKey = HERO_KEYS[(i - 1) % HERO_KEYS.length];
    const closingKey = CLOSING_KEYS[(i * 7) % CLOSING_KEYS.length];

    const slides = [];

    // Slot 1 → Hero
    slides.push({
      id: `s1_hero_${i}`,
      template: heroKey,
      category: "hero",
      title: MOCK_DATA[heroKey]?.title || MOCK_DATA.global.topic,
      data: { ...(MOCK_DATA[heroKey] || {}), theme },
    });

    // Middle slots → Content
    for (let c = 0; c < slideCount - 2; c++) {
      const key = CONTENT_KEYS[Math.floor(rng() * CONTENT_KEYS.length)];
      slides.push({
        id: `s_content_${i}_${c}`,
        template: key,
        category: "content",
        title: MOCK_DATA[key]?.title || "Content Frame",
        data: { ...(MOCK_DATA[key] || {}), theme },
      });
    }

    // Last slot → Closing
    slides.push({
      id: `s_closing_${i}`,
      template: closingKey,
      category: "closing",
      title: MOCK_DATA[closingKey]?.title || "Closing",
      data: { ...(MOCK_DATA[closingKey] || {}), theme },
    });

    decks.push({
      id: `deck_${String(i).padStart(4, "0")}`,
      index: i,
      name: `Combination Cluster #${String(i).padStart(4, "0")}`,
      slideCount,
      theme,
      heroSubtype: heroKey,
      closingSubtype: closingKey,
      slides,
    });
  }
  return decks;
}

const PPT_W = 960;
const PPT_H = 540;

// ── Slide thumbnail (matches ProjectDetailPage's SlideThumb) ───────
function SlideThumb({ slide, num, selected, onClick }) {
  const Template = templateRegistry[slide?.template];
  const theme = slide?.data?.theme || {};

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl overflow-hidden border transition-all duration-150 text-left group ${
        selected
          ? "border-indigo-500 shadow-md shadow-indigo-500/20 bg-(--surface-tertiary)"
          : "border-(--border-primary) bg-(--surface-secondary)/60 hover:border-neutral-600 hover:bg-(--surface-tertiary)/70"
      }`}
    >
      {/* Thumbnail preview */}
      <div className="h-18 overflow-hidden relative bg-(--surface) border-b border-(--border-primary)/60">
        {Template?.Preview ? (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="scale-[0.18] origin-center">
              <div
                style={{
                  width: `${PPT_W}px`,
                  height: `${PPT_H}px`,
                }}
              >
                <Template.Preview data={{ ...(slide?.data || slide), theme }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <LayoutGrid className="w-4 h-4 text-(--text-secondary)" />
          </div>
        )}
      </div>
      {/* Meta */}
      <div className="px-2.5 py-2">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[9px] font-mono text-(--text-secondary) uppercase tracking-widest">
            Slide {num}
          </span>
          <span
            className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
              slide?.category === "hero"
                ? "bg-indigo-950 text-indigo-400"
                : slide?.category === "closing"
                ? "bg-emerald-950 text-emerald-400"
                : "bg-(--surface-tertiary) text-neutral-400"
            }`}
          >
            {slide?.category}
          </span>
        </div>
        <p className="text-[10px] font-semibold text-(--text-primary) truncate leading-tight">
          {slide?.title || slide?.template}
        </p>
        <p className="text-[9px] font-mono text-(--text-secondary) truncate mt-0.5">
          {slide?.template}
        </p>
      </div>
    </button>
  );
}

// ── Scale-fitted preview frame (EXACT ProjectDetailPage behavior) ──
function ScaledPreviewFrame({ slide, containerRef, externalScale }) {
  const Template = slide?.template ? templateRegistry[slide.template] : null;
  const theme = slide?.data?.theme || {};

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-(--border-primary) bg-(--surface) shrink-0"
      style={{
        width: `${PPT_W}px`,
        height: `${PPT_H}px`,
        transform: `scale(${externalScale})`,
        transformOrigin: "center center",
      }}
    >
      {Template?.Preview ? (
        <Template.Preview data={{ ...(slide?.data || {}), theme }} />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-(--surface) gap-3">
          <LayoutGrid className="w-10 h-10 text-(--text-secondary) stroke-1" />
          <p className="text-xs font-mono text-(--text-secondary)">
            {slide?.template
              ? slide.template.replace(/_/g, " ")
              : "No template"}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Deck card for the grid ─────────────────────────────────────────
function DeckCard({ deck, onInspect, onDownload, onCopy, gridScale }) {
  const heroSlide = deck.slides[0];
  const Template = templateRegistry[heroSlide?.template];
  const theme = heroSlide?.data?.theme || {};

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      onClick={() => onInspect(deck)}
      className="group flex flex-col rounded-2xl border border-(--border-primary) bg-(--surface-secondary) cursor-pointer overflow-hidden transition-all duration-250 hover:border-neutral-600 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5"
    >
      {/* Preview thumbnail */}
      <div className="w-full aspect-video bg-(--surface) relative overflow-hidden border-b border-(--border-primary)">
        <div className="absolute inset-0 z-10 bg-transparent group-hover:bg-(--text-primary)/5 transition-colors duration-200" />
        {Template?.Preview ? (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="scale-[0.18] origin-center">
              <div
                className="origin-center transition-transform duration-300 group-hover:scale-[1.03]"
                style={{
                  transform: "scale(1.5)",
                  width: `${PPT_W}px`,
                  height: `${PPT_H}px`,
                }}
              >
                <Template.Preview
                  data={{ ...(heroSlide?.data || {}), theme }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <LayoutGrid className="w-8 h-8 text-(--text-secondary) stroke-1" />
          </div>
        )}
        {/* Mode badge */}
        <div className="absolute top-2 right-2 z-20">
          <span
            className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full backdrop-blur-sm border ${
              deck.theme.mode === "dark"
                ? "bg-black/60 border-(--border-primary)/10 text-neutral-400"
                : "bg-(--text-primary)/70 border-(--border-primary)/10 text-(--text-secondary)"
            }`}
          >
            {deck.theme.mode}
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="p-3 flex-1 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[9px] font-mono text-(--text-secondary) uppercase tracking-wider">
            #{deck.index}
          </p>
          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-(--surface-tertiary) text-neutral-400 rounded-md">
            {deck.slideCount} slides
          </span>
        </div>

        <div>
          <p className="text-[11px] font-semibold text-(--text-primary) truncate group-hover:text-(--text-primary) transition-colors">
            {deck.name}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Palette className="w-2.5 h-2.5 text-(--text-secondary) shrink-0" />
            <p className="text-[9px] text-(--text-secondary) truncate">
              {deck.theme.name}
            </p>
          </div>
        </div>

        {/* Color swatches */}
        <div className="flex items-center gap-1">
          {[
            deck.theme.backgroundColor,
            deck.theme.surfaceColor,
            deck.theme.accentColor,
            deck.theme.primaryTextColor,
          ].map((c, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full border border-(--border-primary)/10 shrink-0"
              style={{ backgroundColor: c }}
            />
          ))}
          <span className="text-[9px] font-mono text-(--text-secondary) ml-1 truncate flex-1">
            {deck.theme.fontFamily}
          </span>
        </div>

        {/* Actions */}
        <div
          className="flex items-center justify-between pt-2 border-t border-(--border-primary)/70"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[8px] font-mono text-(--text-secondary) truncate">
            {deck.heroSubtype.replace("hero_", "")}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onCopy(deck)}
              title="Create With AI"
              className="p-1.5 rounded-lg border border-(--border-primary) hover:bg-(--surface-tertiary) text-(--text-secondary) hover:text-(--text-primary) transition-colors"
            >
              <BotMessageSquare className="w-2.5 h-2.5" />
            </button>
            <button
              onClick={(e) => onDownload(e, deck)}
              title="Export PPTX"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-(--text-secondary) text-(--surface) text-[9px] font-bold hover:bg-(--text-muted)  transition-colors active:scale-95"
            >
              <Download className="w-2.5 h-2.5" /> Export
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── PPTX export ────────────────────────────────────────────────────
async function exportDeckToPptx(deck) {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "TemplateDeckExplorer";
  pptx.title = deck.name;
  for (const slide of deck.slides) {
    const entry = templateRegistry[slide.template];
    if (!entry?.toPptx) continue;
    const pSlide = pptx.addSlide();
    const data = {
      ...(MOCK_DATA[slide.template] || {}),
      theme: deck.theme,
      global: MOCK_DATA.global,
    };
    await entry.toPptx(pSlide, pptx, data);
  }
  await pptx.writeFile({ fileName: `deck_${deck.id}.pptx` });
}

// ── Main component ─────────────────────────────────────────────────
export default function TemplateDeckExplorer() {
  // ── Grid state ────────────────────────────────────────────────
  const [query, setQuery] = useState("");
  const [modeFilter, setModeFilter] = useState("all");
  const [heroFilter, setHeroFilter] = useState("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // ── Inspector state ───────────────────────────────────────────
  const [inspectedDeck, setInspectedDeck] = useState(null);
  const [inspSlideIdx, setInspSlideIdx] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  // ── Theme overrides (per inspected deck) ──────────────────────
  const [themeOverrides, setThemeOverrides] = useState({});

  // ── Grid card thumbnail scale ─────────────────────────────────
  const gridRef = useRef(null);
  const [gridScale, setGridScale] = useState(0.22);

  // ── Inspector preview scale (like ProjectDetailPage) ──────────
  const previewContainerRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);

  // ── Generate decks ────────────────────────────────────────────
  const allDecks = useMemo(() => generate2000Decks(THEME_PRESETS), []);

  // ── Current inspected deck with theme overrides merged ────────
  const mergedInspectedDeck = useMemo(() => {
    if (!inspectedDeck) return null;
    const overrides = themeOverrides[inspectedDeck.id] || {};
    const mergedTheme = { ...inspectedDeck.theme, ...overrides };
    return {
      ...inspectedDeck,
      theme: mergedTheme,
      slides: inspectedDeck.slides.map((s) => ({
        ...s,
        data: { ...(s.data || {}), theme: mergedTheme },
      })),
    };
  }, [inspectedDeck, themeOverrides]);

  // ── Current slide in inspector ────────────────────────────────
  const currentSlide = mergedInspectedDeck?.slides[inspSlideIdx] || null;

  // ── Filtered + paginated decks ────────────────────────────────
  const filtered = useMemo(() => {
    return allDecks.filter((d) => {
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.theme.name.toLowerCase().includes(q) ||
        d.theme.fontFamily.toLowerCase().includes(q) ||
        d.heroSubtype.toLowerCase().includes(q);
      const matchMode = modeFilter === "all" || d.theme.mode === modeFilter;
      const matchHero = heroFilter === "all" || d.heroSubtype === heroFilter;
      return matchQ && matchMode && matchHero;
    });
  }, [allDecks, query, modeFilter, heroFilter]);

  useEffect(() => {
    setPage(1);
  }, [query, modeFilter, heroFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = useMemo(() => {
    const s = (page - 1) * PER_PAGE;
    return filtered.slice(s, s + PER_PAGE);
  }, [filtered, page]);

  // ── Grid scale recalculation ──────────────────────────────────
  useEffect(() => {
    const update = () => {
      if (!gridRef.current) return;
      const w = gridRef.current.clientWidth;
      const cols = w > 1200 ? 5 : w > 900 ? 4 : w > 600 ? 3 : w > 400 ? 2 : 1;
      const cardW = (w - (cols - 1) * 16) / cols;
      const thumbH = cardW * (9 / 16);
      setGridScale(
        +(Math.min(cardW / PPT_W, thumbH / PPT_H) * 0.97).toFixed(4)
      );
    };
    update();
    const ro = new ResizeObserver(update);
    if (gridRef.current) ro.observe(gridRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Inspector preview scale (like ProjectDetailPage fitScale) ─
  useEffect(() => {
    if (!inspectedDeck) return;
    const fit = () => {
      if (!previewContainerRef.current) return;
      const { clientWidth: w, clientHeight: h } = previewContainerRef.current;
      const s = Math.min(
        1,
        Math.max(0.3, Math.min((w - 48) / PPT_W, (h - 48) / PPT_H))
      );
      setPreviewScale(+s.toFixed(4));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [inspectedDeck, sidebarOpen, rightPanelOpen]);

  // Re-fit when panels toggle
  useEffect(() => {
    setTimeout(() => {
      if (!previewContainerRef.current) return;
      const { clientWidth: w, clientHeight: h } = previewContainerRef.current;
      const s = Math.min(
        1,
        Math.max(0.3, Math.min((w - 48) / PPT_W, (h - 48) / PPT_H))
      );
      setPreviewScale(+s.toFixed(4));
    }, 250);
  }, [sidebarOpen, rightPanelOpen]);

  // ── Open inspector ────────────────────────────────────────────
  const openInspector = (deck) => {
    setInspectedDeck(deck);
    setInspSlideIdx(0);
    setSidebarOpen(true);
    setRightPanelOpen(true);
  };

  // ── Copy telemetry ────────────────────────────────────────────
  const navigate = useNavigate();

  const copyTelemetry = useCallback(
    (deck) => {
      navigate("/dashboard/create", {
        state: {
          templateDeck: deck,
        },
      });

      toast.success(`Template applied from Deck #${deck.index}`);
    },
    [navigate]
  );

  // ── Export PPTX ───────────────────────────────────────────────
  const handleExport = useCallback(
    async (e, deck) => {
      e?.stopPropagation();
      try {
        toast.info("Compiling presentation…");
        await exportDeckToPptx(mergedInspectedDeck || deck);
        toast.success("PPTX exported successfully");
      } catch (err) {
        console.error(err);
        toast.error("Export failed");
      }
    },
    [mergedInspectedDeck]
  );

  // ── Theme override helpers ────────────────────────────────────
  const applyOverride = (key, value) => {
    if (!inspectedDeck) return;
    setThemeOverrides((prev) => ({
      ...prev,
      [inspectedDeck.id]: { ...(prev[inspectedDeck.id] || {}), [key]: value },
    }));
  };

  const resetTheme = () => {
    if (!inspectedDeck) return;
    setThemeOverrides((prev) => {
      const n = { ...prev };
      delete n[inspectedDeck.id];
      return n;
    });
    toast.success("Theme reset to original");
  };

  // ── Keyboard navigation for inspector ─────────────────────────
  useEffect(() => {
    if (!inspectedDeck) return;
    const handler = (e) => {
      if (e.key === "ArrowLeft") setInspSlideIdx((c) => Math.max(0, c - 1));
      if (e.key === "ArrowRight")
        setInspSlideIdx((c) =>
          Math.min((mergedInspectedDeck?.slides.length || 1) - 1, c + 1)
        );
      if (e.key === "Escape") setInspectedDeck(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [inspectedDeck, mergedInspectedDeck]);

  const t = mergedInspectedDeck?.theme;

  // ── Render ────────────────────────────────────────────────────
  return (
    <>
      {/* ── GRID VIEW ─────────────────────────────────────────── */}
      <div className="flex flex-col h-screen w-full bg-(--surface) text-(--text-primary) overflow-hidden font-sans">
        {/* Header */}
        <header className="shrink-0 border-b border-(--border-primary) bg-(--surface-secondary)/80 backdrop-blur z-10">
          <div className="px-4 py-3 flex flex-col gap-3">
            {/* Brand row */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <Link to={"/"} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-bold text-(--text-primary) text-sm tracking-tight"
                  >
                    SlideAI
                  </motion.span>
                </div>
              </Link>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <div className="flex items-center gap-1.5 bg-(--surface-tertiary)/60 border border-(--border-primary) px-3 py-1.5 rounded-xl">
                  <span className="text-(--text-secondary)">Decks:</span>
                  <span className="text-indigo-400 font-bold">2,000</span>
                  <span className="text-(--text-secondary)">|</span>
                  <span className="text-(--text-secondary)">Themes:</span>
                  <span className="text-emerald-400 font-bold">200</span>
                  <span className="text-(--text-secondary)">|</span>
                  <span className="text-(--text-secondary)">Templates:</span>
                  <span className="text-amber-400 font-bold">
                    {HERO_KEYS.length +
                      CONTENT_KEYS.length +
                      CLOSING_KEYS.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Search + filters */}
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-(--text-secondary)" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, theme, font, hero subtype…"
                  className="w-full bg-(--surface-tertiary)/60 border border-(--border-primary) rounded-xl py-2 pl-9 pr-8 text-xs font-medium placeholder:text-(--text-secondary) outline-none focus:border-indigo-500 transition-colors"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-secondary) hover:text-(--text-primary)"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Mode filter */}
                <div className="flex rounded-xl bg-(--surface-tertiary) p-0.5 border border-(--border-primary)">
                  {[
                    {
                      id: "all",
                      icon: <Layers3 className="w-3 h-3" />,
                      label: "All",
                    },
                    {
                      id: "dark",
                      icon: <Moon className="w-3 h-3" />,
                      label: "Dark",
                    },
                    {
                      id: "light",
                      icon: <Sun className="w-3 h-3" />,
                      label: "Light",
                    },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setModeFilter(m.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                        modeFilter === m.id
                          ? "bg-(--brand) text-(--surface) shadow-sm"
                          : "text-neutral-400 hover:text-(--text-primary)"
                      }`}
                    >
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>

                {/* Hero filter */}
                <div className="flex items-center gap-1.5 bg-(--surface-tertiary) border border-(--border-primary) px-2.5 py-1.5 rounded-xl">
                  <Filter className="w-3 h-3 text-(--text-secondary)" />
                  <select
                    value={heroFilter}
                    onChange={(e) => setHeroFilter(e.target.value)}
                    className="bg-transparent text-[11px] font-semibold text-neutral-400 outline-none cursor-pointer max-w-36"
                  >
                    <option value="all">All Hero Types</option>
                    {HERO_KEYS.map((k) => (
                      <option
                        key={k}
                        value={k}
                        className="bg-(--surface-secondary)"
                      >
                        {k.replace("hero_", "")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Grid body */}
        <main ref={gridRef} className="flex-1 overflow-y-auto p-4 md:p-5">
          <AnimatePresence mode="popLayout">
            {paginated.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {paginated.map((deck) => (
                  <DeckCard
                    key={deck.id}
                    deck={deck}
                    gridScale={gridScale}
                    onInspect={openInspector}
                    onDownload={handleExport}
                    onCopy={copyTelemetry}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                <AlertTriangle className="w-10 h-10 text-amber-500/60 stroke-1" />
                <p className="text-sm font-semibold text-(--text-primary)">
                  No matches found
                </p>
                <p className="text-xs text-(--text-secondary) max-w-xs">
                  Try different keywords or reset filters to explore all 2,000
                  combinations.
                </p>
                <button
                  onClick={() => {
                    setQuery("");
                    setModeFilter("all");
                    setHeroFilter("all");
                  }}
                  className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-(--text-primary) text-xs font-bold rounded-xl transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </AnimatePresence>
        </main>

        {/* Pagination */}
        {filtered.length > PER_PAGE && (
          <footer className="shrink-0 border-t border-(--border-primary) bg-(--surface-secondary)/60 backdrop-blur px-4 py-3 flex items-center justify-between gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-(--surface-tertiary) border border-(--border-primary) rounded-xl text-[11px] font-bold disabled:opacity-30 disabled:pointer-events-none hover:bg-neutral-700 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <span className="text-[11px] font-mono text-neutral-400">
              Page{" "}
              <span className="text-(--text-primary) font-bold">{page}</span> of{" "}
              <span className="text-(--text-primary) font-bold">
                {totalPages}
              </span>
              <span className="ml-2 text-(--text-secondary)">
                ({filtered.length.toLocaleString()} results)
              </span>
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-(--surface-tertiary) border border-(--border-primary) rounded-xl text-[11px] font-bold disabled:opacity-30 disabled:pointer-events-none hover:bg-neutral-700 transition-colors"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </footer>
        )}
      </div>

      {/* ── INSPECTOR OVERLAY (ProjectDetailPage layout) ───────── */}
      <AnimatePresence>
        {inspectedDeck && mergedInspectedDeck && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col bg-(--surface) text-(--text-primary) overflow-hidden"
          >
            {/* ── TOP BAR ──────────────────────────────────────── */}
            <header className="shrink-0 h-14 border-b border-(--border-primary) bg-(--surface-secondary)/70 backdrop-blur px-4 flex items-center gap-3">
              <button
                onClick={() => setInspectedDeck(null)}
                className="p-2 rounded-xl bg-(--surface-tertiary) hover:bg-neutral-700 transition-colors"
                title="Close inspector (Esc)"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className={`p-2 rounded-xl transition-colors ${
                  sidebarOpen
                    ? "bg-(--brand)"
                    : "bg-(--surface-tertiary) hover:bg-(--brand)"
                }`}
                title={sidebarOpen ? "Hide slide list" : "Show slide list"}
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="w-4 h-4" />
                ) : (
                  <PanelLeftOpen className="w-4 h-4" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono bg-indigo-950/70 border border-indigo-900 text-indigo-400 px-2 py-0.5 rounded-md uppercase tracking-widest shrink-0">
                    #{mergedInspectedDeck.index}
                  </span>
                  <h2 className="text-sm font-black text-(--text-primary) truncate">
                    {mergedInspectedDeck.name}
                  </h2>
                </div>
                <p className="text-[10px] text-(--text-secondary) truncate">
                  {mergedInspectedDeck.theme.name} ·{" "}
                  {mergedInspectedDeck.slideCount} slides ·{" "}
                  {mergedInspectedDeck.theme.fontFamily}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => copyTelemetry(mergedInspectedDeck)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-(--surface-tertiary) hover:bg-(--brand) border border-(--border-primary) rounded-xl text-xs font-bold transition-colors"
                >
                  <BotMessageSquare className="w-3.5 h-3.5" /> Create With AI
                </button>
                <button
                  onClick={(e) => handleExport(e, mergedInspectedDeck)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-(--text-primary) text-(--surface) rounded-xl text-xs font-bold hover:bg-(--brand) transition-colors active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" /> Export PPTX
                </button>
                <button
                  onClick={() => setRightPanelOpen((v) => !v)}
                  className={`p-2 rounded-xl transition-colors ${
                    rightPanelOpen
                      ? "bg-(--brand)"
                      : "bg-(--surface-tertiary) hover:bg-(--brand)"
                  }`}
                  title="Toggle theme editor"
                >
                  {rightPanelOpen ? (
                    <PanelRightClose className="w-4 h-4" />
                  ) : (
                    <PanelRightOpen className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setInspectedDeck(null)}
                  className="p-2 rounded-xl bg-(--surface-tertiary) hover:bg-neutral-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* ── BODY ─────────────────────────────────────────── */}
            <div className="flex-1 flex overflow-hidden min-h-0">
              {/* LEFT: Slide list sidebar */}
              <AnimatePresence initial={false}>
                {sidebarOpen && (
                  <motion.aside
                    key="inspector-sidebar"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="shrink-0 border-r border-(--border-primary) bg-(--surface-secondary)/50 overflow-y-auto overflow-x-hidden flex flex-col"
                    style={{ minWidth: 0 }}
                  >
                    <div className="p-2 pt-3 space-y-2">
                      <p className="text-[9px] font-mono text-(--text-secondary) uppercase tracking-widest px-1">
                        {mergedInspectedDeck.slideCount} Slides
                      </p>
                      {mergedInspectedDeck.slides.map((slide, idx) => (
                        <SlideThumb
                          key={slide.id}
                          slide={slide}
                          num={idx + 1}
                          selected={inspSlideIdx === idx}
                          onClick={() => setInspSlideIdx(idx)}
                        />
                      ))}
                    </div>
                  </motion.aside>
                )}
              </AnimatePresence>

              {/* CENTER: Preview area — EXACT ProjectDetailPage behavior */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-(--surface)">
                {/* Slide nav bar */}
                <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-(--border-primary) bg-(--surface-secondary)/40">
                  <button
                    onClick={() => setInspSlideIdx((c) => Math.max(0, c - 1))}
                    disabled={inspSlideIdx === 0}
                    className="p-1.5 rounded-lg bg-(--surface-tertiary) hover:bg-neutral-700 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Dot indicators */}
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-2">
                    {mergedInspectedDeck.slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setInspSlideIdx(i)}
                        className={`rounded-full transition-all font-semibold text-[10px] min-w-6 h-6 px-1.5 ${
                          i === inspSlideIdx
                            ? "bg-(--text-primary) text-(--surface)"
                            : "bg-(--surface-tertiary) text-neutral-400 hover:bg-neutral-700"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setInspSlideIdx((c) =>
                        Math.min(mergedInspectedDeck.slides.length - 1, c + 1)
                      )
                    }
                    disabled={
                      inspSlideIdx === mergedInspectedDeck.slides.length - 1
                    }
                    className="p-1.5 rounded-lg bg-(--surface-tertiary) hover:bg-neutral-700 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* PREVIEW — scale-fitted, never overflows, identical to ProjectDetailPage */}
                <motion.div
                  key={inspSlideIdx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  ref={previewContainerRef}
                  className="flex-1 flex items-center justify-center p-4 md:p-6 min-h-0 overflow-hidden bg-(--surface)"
                >
                  {currentSlide ? (
                    <ScaledPreviewFrame
                      slide={currentSlide}
                      containerRef={previewContainerRef}
                      externalScale={previewScale}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-(--text-secondary)">
                      <LayoutGrid className="w-12 h-12 stroke-1" />
                      <p className="text-sm">No slide selected</p>
                    </div>
                  )}
                </motion.div>

                {/* Info bar */}
                {currentSlide && (
                  <div className="shrink-0 border-t border-(--border-primary) bg-(--surface-secondary)/40 px-4 py-2.5 flex items-center justify-between gap-4 text-xs text-(--text-secondary)">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-(--text-primary) truncate">
                        {currentSlide.title}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase shrink-0 ${
                          currentSlide.category === "hero"
                            ? "bg-indigo-950 text-indigo-400"
                            : currentSlide.category === "closing"
                            ? "bg-emerald-950 text-emerald-400"
                            : "bg-(--surface-tertiary) text-neutral-400"
                        }`}
                      >
                        {currentSlide.category}
                      </span>
                      <span className="hidden md:block font-mono text-(--text-secondary) truncate text-[10px]">
                        {currentSlide.template}
                      </span>
                    </div>
                    <span className="shrink-0 font-mono text-[10px]">
                      {inspSlideIdx + 1} / {mergedInspectedDeck.slideCount}
                    </span>
                  </div>
                )}
              </div>

              {/* RIGHT: Theme editor + metadata */}
              <AnimatePresence initial={false}>
                {rightPanelOpen && (
                  <motion.aside
                    key="inspector-right"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 272, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="shrink-0 border-l border-(--border-primary) bg-(--surface-secondary)/50 flex flex-col overflow-hidden"
                    style={{ minWidth: 0 }}
                  >
                    <div className="overflow-y-auto flex-1 flex flex-col p-4 gap-4 min-h-0">
                      {/* Theme section header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wand2 className="w-3.5 h-3.5 text-neutral-400" />
                          <span className="text-xs font-bold text-(--text-primary)">
                            Theme Editor
                          </span>
                        </div>
                        <button
                          onClick={resetTheme}
                          className="text-[10px] font-semibold text-(--text-secondary) hover:text-(--text-primary) flex items-center gap-1 transition-colors"
                        >
                          <RefreshCw className="w-2.5 h-2.5" /> Reset
                        </button>
                      </div>

                      {/* Theme token panel */}
                      <div className="rounded-xl border border-(--border-primary) bg-(--surface-secondary)/60 p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-[9px] font-mono text-(--text-secondary) uppercase tracking-widest">
                            Active Theme
                          </p>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                              t?.mode === "dark"
                                ? "bg-(--surface-tertiary) text-neutral-400"
                                : "bg-neutral-200 text-(--text-secondary)"
                            }`}
                          >
                            {t?.mode}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-(--text-primary)">
                          {t?.name}
                        </p>
                        <p className="text-[10px] font-mono text-(--text-secondary)">
                          {t?.fontFamily}
                        </p>

                        {/* Color swatches */}
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            {
                              label: "Background",
                              key: "backgroundColor",
                              color: t?.backgroundColor,
                            },
                            {
                              label: "Surface",
                              key: "surfaceColor",
                              color: t?.surfaceColor,
                            },
                            {
                              label: "Accent",
                              key: "accentColor",
                              color: t?.accentColor,
                            },
                            {
                              label: "Text",
                              key: "primaryTextColor",
                              color: t?.primaryTextColor,
                            },
                          ].map(({ label, key, color }) => (
                            <label
                              key={key}
                              className="flex flex-col gap-1 cursor-pointer group/swatch"
                            >
                              <div
                                className="w-full h-8 rounded-lg border border-(--border-primary)/10 relative overflow-hidden transition-all group-hover/swatch:ring-2 group-hover/swatch:ring-indigo-500/50"
                                style={{ backgroundColor: color }}
                              >
                                <input
                                  type="color"
                                  value={color || "#000000"}
                                  onChange={(e) =>
                                    applyOverride(key, e.target.value)
                                  }
                                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                />
                              </div>
                              <span className="text-[8px] font-mono text-(--text-secondary) truncate">
                                {label}: {color}
                              </span>
                            </label>
                          ))}
                        </div>

                        {/* Font selector */}
                        <div>
                          <p className="text-[9px] font-mono text-(--text-secondary) mb-1">
                            Font Family
                          </p>
                          <select
                            value={t?.fontFamily || "Inter"}
                            onChange={(e) =>
                              applyOverride("fontFamily", e.target.value)
                            }
                            className="w-full bg-(--surface-tertiary) border border-(--border-primary) rounded-lg px-2.5 py-1.5 text-xs font-medium text-(--text-primary) outline-none focus:border-indigo-500 transition-colors"
                          >
                            {FONT_FAMILIES.map((f) => (
                              <option
                                key={f}
                                value={f}
                                className="bg-(--surface-secondary)"
                              >
                                {f}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Quick theme presets */}
                        <div>
                          <p className="text-[9px] font-mono text-(--text-secondary) mb-1.5">
                            Quick Presets
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {THEME_PRESETS.slice(0, 12).map((preset) => (
                              <button
                                key={preset.id}
                                onClick={() => {
                                  if (!inspectedDeck) return;
                                  setThemeOverrides((prev) => ({
                                    ...prev,
                                    [inspectedDeck.id]: {
                                      backgroundColor: preset.backgroundColor,
                                      surfaceColor: preset.surfaceColor,
                                      accentColor: preset.accentColor,
                                      primaryTextColor: preset.primaryTextColor,
                                      secondaryTextColor:
                                        preset.secondaryTextColor,
                                      fontFamily: preset.fontFamily,
                                      mode: preset.mode,
                                      name: preset.name,
                                    },
                                  }));
                                }}
                                title={preset.name}
                                className="w-5 h-5 rounded-full border border-(--border-primary)/10 hover:ring-2 hover:ring-indigo-400 transition-all"
                                style={{ backgroundColor: preset.accentColor }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Slide layout trail */}
                      <div>
                        <p className="text-[9px] font-mono text-(--text-secondary) uppercase tracking-widest mb-2">
                          Layout Sequence ({mergedInspectedDeck.slideCount}{" "}
                          slides)
                        </p>
                        <div className="space-y-1.5">
                          {mergedInspectedDeck.slides.map((s, idx) => (
                            <button
                              key={`${s.id}_${idx}`}
                              onClick={() => setInspSlideIdx(idx)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-left transition-all ${
                                idx === inspSlideIdx
                                  ? "border-(--border-primary)/20 bg-(--surface-tertiary) text-(--text-primary)"
                                  : "border-(--border-primary)/60 bg-(--surface-secondary)/30 text-(--text-secondary) hover:bg-(--surface-tertiary)/50 hover:text-(--text-primary)"
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-semibold truncate text-inherit">
                                  {idx + 1}. {s.template}
                                </p>
                                <p className="text-[9px] text-(--text-secondary) truncate mt-0.5">
                                  {s.title}
                                </p>
                              </div>
                              <span
                                className={`text-[8px] font-mono font-bold uppercase shrink-0 ml-2 ${
                                  s.category === "hero"
                                    ? "text-indigo-500"
                                    : s.category === "closing"
                                    ? "text-emerald-500"
                                    : "text-(--text-secondary)"
                                }`}
                              >
                                {s.category}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom actions */}
                    <div className="shrink-0 p-3 border-t border-(--border-primary) space-y-2">
                      <button
                        onClick={() => copyTelemetry(mergedInspectedDeck)}
                        className="w-full inline-flex items-center justify-center gap-2 py-2 border border-dashed border-(--border-primary) hover:border-neutral-500 rounded-xl text-xs font-bold text-neutral-400 hover:text-(--text-primary) transition-colors"
                      >
                        <BotMessageSquare className="w-3 h-3 text-indigo-400" />{" "}
                        Create With AI
                      </button>
                      <button
                        onClick={(e) => handleExport(e, mergedInspectedDeck)}
                        className="w-full inline-flex items-center justify-center gap-2 py-2 bg-(--text-primary) text-(--surface) rounded-xl text-xs font-bold hover:bg-(--brand) transition-colors active:scale-95"
                      >
                        <Download className="w-3 h-3" /> Export PPTX
                      </button>
                    </div>
                  </motion.aside>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
