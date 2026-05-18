import { useState, useRef, useEffect } from "react";
import PptxGenJS from "pptxgenjs";
import { heroTemplates } from "../lib/templates/hero";
import SlideTester from "./SlideTester";

/* =====================================================
   AI-GENERATED SLIDES - AI OWNS EVERYTHING
   We pass the ENTIRE object to templates (no separate theme)
   ===================================================== */

const aiGeneratedSlides = {
  // 1. CENTERED
  hero_centered: {
    subtype: "hero_centered",
    title: "Agentic AI",
    subtitle: "Autonomous agents that think, plan, and act independently",
    iconName: "Bot",
    theme: {
      backgroundColor: "#0B1020",
      surfaceColor: "#1A2234",
      primaryTextColor: "#F8FAFC",
      secondaryTextColor: "#94A3B8",
      accentColor: "#8B5CF6",
      fontFamily: "Calibri",
    },
  },

  // 2. SPLIT LEFT
  hero_split_left: {
    subtype: "hero_split_left",
    title: "The Rise of Agentic AI",
    subtitle:
      "From chatbots to autonomous teammates that execute complex workflows",
    iconName: "Brain",
    theme: {
      backgroundColor: "#FFFBF5",
      surfaceColor: "#F5F1E8",
      primaryTextColor: "#1C1917",
      secondaryTextColor: "#57534E",
      accentColor: "#EA580C",
      fontFamily: "Georgia",
    },
  },

  // 3. FULL BLEED
  hero_full_bleed: {
    subtype: "hero_full_bleed",
    title: "Welcome to the Future",
    subtitle: "Where AI meets human creativity",
    iconName: "Rocket",
    theme: {
      backgroundColor: "#0A0E1A",
      surfaceColor: "#151B2D",
      primaryTextColor: "#FFFFFF",
      secondaryTextColor: "#9CA3AF",
      accentColor: "#F59E0B",
      fontFamily: "Calibri",
    },
  },

  // 4. GRADIENT (uses solid colors only - template must be updated)
  hero_gradient: {
    subtype: "hero_gradient",
    title: "Bold Ideas",
    subtitle: "Design that makes an impact",
    iconName: "Zap",
    theme: {
      backgroundColor: "#1E3A8A", // Solid blue (no gradient)
      surfaceColor: "#1E40AF", // Solid
      primaryTextColor: "#FFFFFF",
      secondaryTextColor: "#DBEAFE",
      accentColor: "#FBBF24",
      fontFamily: "Calibri",
    },
  },

  // 5. MINIMAL
  hero_minimal: {
    subtype: "hero_minimal",
    title: "Simplicity",
    subtitle: "Less is more",
    iconName: "Minus",
    theme: {
      backgroundColor: "#FFFFFF",
      surfaceColor: "#F5F5F5",
      primaryTextColor: "#000000",
      secondaryTextColor: "#525252",
      accentColor: "#000000",
      fontFamily: "Georgia",
    },
  },

  // 6. SPLIT RIGHT
  hero_split_right: {
    subtype: "hero_split_right",
    title: "Autonomous Systems",
    subtitle: "Building AI that acts, not just responds",
    iconName: "Cpu",
    theme: {
      backgroundColor: "#0F172A",
      surfaceColor: "#1E293B",
      primaryTextColor: "#E2E8F0",
      secondaryTextColor: "#94A3B8",
      accentColor: "#10B981",
      fontFamily: "Calibri",
    },
  },

  // 7. DIAGONAL
  hero_diagonal: {
    subtype: "hero_diagonal",
    title: "Next Generation",
    subtitle: "The evolution of intelligent systems",
    iconName: "Sparkles",
    theme: {
      backgroundColor: "#FEF3C7",
      surfaceColor: "#FDE68A",
      primaryTextColor: "#78350F",
      secondaryTextColor: "#92400E",
      accentColor: "#D97706",
      fontFamily: "Calibri",
    },
  },

  // BONUS VARIANTS FOR TESTING
  hero_centered_dark: {
    subtype: "hero_centered",
    title: "The Future of Work",
    subtitle: "AI agents as your digital teammates",
    iconName: "Users",
    theme: {
      backgroundColor: "#000000",
      surfaceColor: "#171717",
      primaryTextColor: "#FFFFFF",
      secondaryTextColor: "#A3A3A3",
      accentColor: "#00B8D9",
      fontFamily: "Calibri",
    },
  },

  hero_corporate: {
    subtype: "hero_split_left",
    title: "Enterprise Ready",
    subtitle: "Secure, scalable, and compliant",
    iconName: "Shield",
    theme: {
      backgroundColor: "#FFFFFF",
      surfaceColor: "#F1F5F9",
      primaryTextColor: "#0F172A",
      secondaryTextColor: "#475569",
      accentColor: "#2563EB",
      fontFamily: "Calibri",
    },
  },

  hero_creative: {
    subtype: "hero_full_bleed",
    title: "Create Without Limits",
    subtitle: "Unleash your imagination",
    iconName: "Palette",
    theme: {
      backgroundColor: "#1F0A3D",
      surfaceColor: "#2D1B4E",
      primaryTextColor: "#F5F3FF",
      secondaryTextColor: "#C4B5FD",
      accentColor: "#EC4899",
      fontFamily: "Calibri",
    },
  },
};


export default function HeroTester() {
  return (
    <SlideTester
      slides={aiGeneratedSlides}
      templates={heroTemplates}
      title="Hero tester"
      initialKey={"hero_creative"}
    />
  );
}
