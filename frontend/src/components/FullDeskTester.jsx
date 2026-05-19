import { useState } from "react";
import PptxGenJS from "pptxgenjs";

// Import all 3 indexes
import { heroTemplates } from "../lib/templates/hero/index.jsx";
import { contentTemplates } from "../lib/templates/content/index.jsx";
import { closingTemplates } from "../lib/templates/closing/index.jsx";

// Merge all templates
const allTemplates = {
  ...heroTemplates,
  ...contentTemplates,
  ...closingTemplates,
};

// === GLOBAL LIGHT THEME ===
const globalTheme = {
  backgroundColor: "#FFFFFF",
  surfaceColor: "#F8FAFC",
  primaryTextColor: "#0F172A",
  secondaryTextColor: "#475569",
  accentColor: "#6366F1", // Indigo
  fontFamily: "Calibri",
};

// === FULL 7-SLIDE AI AGENTS DECK ===
const fullDeck = [
  // 1. HERO
  {
    id: "hero1",
    subtype: "hero_centered",
    title: "AI Agents: The Future of Autonomous Work",
    subtitle:
      "From chatbots to digital teammates that reason, plan, and execute complex workflows end-to-end",
    icon: "Bot",
    theme: globalTheme,
  },

  // 2. WHAT ARE AI AGENTS
  {
    id: "content1",
    subtype: "content_title_bullets",
    title: "What Are AI Agents?",
    bullets: [
      "Autonomous software entities that perceive goals, reason through tasks, and take actions without constant human prompting",
      "Built on LLMs + reasoning frameworks (ReAct, Tree-of-Thought) + persistent memory + tool access",
      "Unlike traditional chatbots: they maintain context across days, break down multi-step work, and self-correct",
      "Core loop: Observe → Plan → Act → Reflect. They use browsers, APIs, code execution, and databases as tools",
      "Deploy today as: Customer Support Agents, Research Analysts, Sales SDRs, Operations Copilots, and Personal Assistants",
    ],
    theme: globalTheme,
  },

  // 3. CORE CAPABILITIES
  {
    id: "content2",
    subtype: "content_icon_grid_3x2",
    title: "6 Core Capabilities of Modern Agents",
    items: [
      {
        icon: "Brain",
        title: "Reasoning",
        text: "Chain-of-thought and tree search to decompose complex goals into executable steps",
      },
      {
        icon: "Database",
        title: "Memory",
        text: "Vector databases for long-term recall + working memory for current task context",
      },
      {
        icon: "Wrench",
        title: "Tool Use",
        text: "Native integration with 500+ tools: web search, Slack, Gmail, Salesforce, SQL, Python",
      },
      {
        icon: "Route",
        title: "Planning",
        text: "Dynamic task planning with fallback strategies and self-reflection loops",
      },
      {
        icon: "GraduationCap",
        title: "Learning",
        text: "Improves from human feedback, success metrics, and past trajectories",
      },
      {
        icon: "Users",
        title: "Multi-Agent",
        text: "Teams of specialized agents collaborate: researcher, writer, critic, executor",
      },
    ],
    theme: globalTheme,
  },

  // 4. IMPACT NUMBERS
  {
    id: "content3",
    subtype: "content_stats_metrics",
    title: "Measured Business Impact",
    stats: [
      { value: "80%", label: "Faster workflow completion" },
      { value: "3.5x", label: "Productivity gain per employee" },
      { value: "60%", label: "Reduction in operational costs" },
      { value: "24/7", label: "Always-on coverage" },
    ],
    theme: globalTheme,
  },

  // 5. HOW THEY WORK
  {
    id: "content4",
    subtype: "content_numbered_steps",
    title: "How an AI Agent Works (In 4 Steps)",
    steps: [
      {
        title: "1. Understand",
        text: "Ingests goal, retrieves relevant memory, and gathers context from connected tools",
      },
      {
        title: "2. Plan",
        text: "Breaks goal into sub-tasks using reasoning engine, selects optimal tools for each step",
      },
      {
        title: "3. Execute",
        text: "Calls APIs, browses web, writes code, updates CRM – with full audit trail",
      },
      {
        title: "4. Reflect",
        text: "Evaluates outcome, stores learnings, and asks for human input only on edge cases",
      },
    ],
    theme: globalTheme,
  },

  // 6. REAL USE CASES
  {
    id: "content5",
    subtype: "content_image_gallery",
    title: "AI Agents in Production Today",
    images: [
      {
        caption: "Customer Support: Resolves 73% of tickets autonomously",
        url: "https://picsum.photos/seed/support/800/600",
      },
      {
        caption:
          "Sales SDR: Researches leads, writes personalized emails, books meetings",
        url: "https://picsum.photos/seed/sales/800/600",
      },
      {
        caption:
          "Research Analyst: Reads 100s of docs, synthesizes reports in minutes",
        url: "https://picsum.photos/seed/research/800/600",
      },
      {
        caption:
          "Operations: Monitors systems, creates tickets, runs playbooks",
        url: "https://picsum.photos/seed/ops/800/600",
      },
    ],
    theme: {
      ...globalTheme,
      backgroundColor: "#F8FAFC",
      surfaceColor: "#FFFFFF",
    },
  },

  // 7. CLOSING
  {
    id: "closing1",
    subtype: "content_closing_simple",
    title: "Thank You",
    subtitle:
      "Ready to deploy your first AI agent? Let's discuss your use case",
    theme: globalTheme,
  },
];

export default function FullDeckTester() {
  const [current, setCurrent] = useState(0);
  const slide = fullDeck[current];
  const Template = allTemplates[slide.subtype];

  const exportPPTX = async () => {
    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_16x9";
    pptx.author = "AI Agents Deck";
    pptx.title = "AI Agents - Full Presentation";

    for (const s of fullDeck) {
      const tpl = allTemplates[s.subtype];
      const pptSlide = pptx.addSlide();
      if (tpl?.toPptx) {
        await tpl.toPptx(pptSlide, pptx, s);
      }
    }
    await pptx.writeFile({ fileName: "AI-Agents-Deck.pptx" });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
        <h1 className="text-xl font-bold text-indigo-600">
          AI Agents Deck • 7 Slides
        </h1>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
            className="px-3 py-1.5 bg-gray-100 rounded-lg disabled:opacity-30 hover:bg-gray-200"
          >
            ← Prev
          </button>
          <span className="px-3 py-1.5 text-sm font-medium bg-indigo-50 text-indigo-700 rounded-lg">
            {current + 1} / {fullDeck.length}
          </span>
          <button
            onClick={() =>
              setCurrent(Math.min(fullDeck.length - 1, current + 1))
            }
            disabled={current === fullDeck.length - 1}
            className="px-3 py-1.5 bg-gray-100 rounded-lg disabled:opacity-30 hover:bg-gray-200"
          >
            Next →
          </button>
          <button
            onClick={exportPPTX}
            className="px-5 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 shadow"
          >
            Export PPTX
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 p-8 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-6xl aspect-video bg-white rounded-2xl shadow-2xl overflow-hidden border">
          {Template?.Preview ? (
            <Template.Preview data={slide} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              No preview for {slide.subtype}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-white text-xs text-gray-500 flex justify-between">
        <span>{slide.subtype}</span>
        <span>{slide.title}</span>
      </div>
    </div>
  );
}
