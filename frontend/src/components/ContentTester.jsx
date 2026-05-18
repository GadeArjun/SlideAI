import SlideTester from "./SlideTester.jsx";
import { contentTemplates } from "../lib/templates/content/index.jsx";

const aiGeneratedContent = {
  bullets_example: {
    subtype: "content_title_bullets",
    title: "Key Benefits",
    subtitle: "Why teams choose agentic AI",
    bullets: [
      "Automates complex workflows end-to-end",
      "Learns and adapts from every interaction",
      "Integrates with your existing tools",
      "Scales across teams instantly",
    ],
    theme: {
      backgroundColor: "#FFFFFF",
      surfaceColor: "#F8FAFC",
      primaryTextColor: "#0F172A",
      secondaryTextColor: "#475569",
      accentColor: "#8B5CF6",
      fontFamily: "Calibri",
    },
  },
  two_col_example: {
    subtype: "content_two_column",
    title: "Built for Scale",
    content:
      "Deploy agents across your organization with enterprise-grade security, compliance, and monitoring. Start small, scale fast.",
    theme: {
      backgroundColor: "#0F172A",
      surfaceColor: "#1E293B",
      primaryTextColor: "#F1F5F9",
      secondaryTextColor: "#94A3B8",
      accentColor: "#10B981",
      fontFamily: "Calibri",
    },
  },
  bullets_dark: {
    subtype: "content_title_bullets",
    title: "Implementation Steps",
    subtitle: "Get started in minutes",
    bullets: [
      "Connect your data sources",
      "Configure agent behaviors",
      "Test in sandbox environment",
      "Deploy to production",
    ],
    theme: {
      backgroundColor: "#000000",
      surfaceColor: "#171717",
      primaryTextColor: "#FFFFFF",
      secondaryTextColor: "#A3A3A3",
      accentColor: "#00B8D9",
      fontFamily: "Calibri",
    },
  },

  paragraph_example: {
    subtype: "content_title_paragraph",
    title: "Our Mission",
    content:
      "We build AI agents that work alongside humans, not replace them. Every interaction is designed to amplify creativity, reduce repetitive work, and unlock new possibilities for teams of all sizes.",
    theme: {
      backgroundColor: "#FFFFFF",
      surfaceColor: "#F8FAFC",
      primaryTextColor: "#0F172A",
      secondaryTextColor: "#475569",
      accentColor: "#8B5CF6",
      fontFamily: "Calibri",
    },
  },
  image_left_example: {
    subtype: "content_image_left",
    title: "Visual First",
    content:
      "Show, don't tell. Place your product screenshot or diagram on the left, with key benefits explained on the right.",
    theme: {
      backgroundColor: "#0F172A",
      surfaceColor: "#1E293B",
      primaryTextColor: "#F1F5F9",
      secondaryTextColor: "#94A3B8",
      accentColor: "#F59E0B",
      fontFamily: "Calibri",
    },
  },
  three_col_example: {
    subtype: "content_three_column",
    title: "How It Works",
    columns: [
      { heading: "Connect", text: "Link your tools in one click" },
      { heading: "Configure", text: "Set goals and guardrails" },
      { heading: "Deploy", text: "Go live in minutes" },
    ],
    theme: {
      backgroundColor: "#FFFFFF",
      surfaceColor: "#F1F5F9",
      primaryTextColor: "#0F172A",
      secondaryTextColor: "#64748B",
      accentColor: "#10B981",
      fontFamily: "Calibri",
    },
  },
  four_grid_example: {
    subtype: "content_four_grid",
    title: "Platform Capabilities",
    items: [
      { title: "Automation", desc: "End-to-end workflow execution" },
      { title: "Analytics", desc: "Real-time performance insights" },
      { title: "Security", desc: "Enterprise-grade compliance" },
      { title: "Integration", desc: "500+ app connections" },
    ],
    theme: {
      backgroundColor: "#000000",
      surfaceColor: "#171717",
      primaryTextColor: "#FFFFFF",
      secondaryTextColor: "#A3A3A3",
      accentColor: "#00B8D9",
      fontFamily: "Calibri",
    },
  },
  icon_list_example: {
    subtype: "content_icon_list",
    title: "Core Capabilities",
    items: [
      { text: "Natural language understanding across 50+ languages" },
      { text: "Real-time data processing and analysis" },
      { text: "Seamless integration with existing workflows" },
      { text: "Enterprise-grade security and compliance" },
      { text: "Continuous learning from user feedback" },
    ],
    theme: {
      backgroundColor: "#FFFFFF",
      surfaceColor: "#F8FAFC",
      primaryTextColor: "#0F172A",
      secondaryTextColor: "#475569",
      accentColor: "#8B5CF6",
      fontFamily: "Calibri",
    },
  },

  numbered_steps_example: {
    subtype: "content_numbered_steps",
    title: "Get Started in 4 Steps",
    steps: [
      { title: "Connect", desc: "Link your data sources in one click" },
      { title: "Configure", desc: "Set up agent behaviors and rules" },
      { title: "Test", desc: "Validate in sandbox environment" },
      { title: "Deploy", desc: "Go live across your team" },
    ],
    theme: {
      backgroundColor: "#0F172A",
      surfaceColor: "#1E293B",
      primaryTextColor: "#F1F5F9",
      secondaryTextColor: "#94A3B8",
      accentColor: "#10B981",
      fontFamily: "Calibri",
    },
  },

  timeline_example: {
    subtype: "content_timeline_horizontal",
    title: "Product Roadmap 2024",
    items: [
      { date: "Q1", text: "Beta launch" },
      { date: "Q2", text: "Enterprise features" },
      { date: "Q3", text: "Mobile apps" },
      { date: "Q4", text: "AI marketplace" },
      { date: "2025", text: "Global scale" },
    ],
    theme: {
      backgroundColor: "#FFFFFF",
      surfaceColor: "#F1F5F9",
      primaryTextColor: "#0F172A",
      secondaryTextColor: "#64748B",
      accentColor: "#F59E0B",
      fontFamily: "Calibri",
    },
  },

  checklist_example: {
    subtype: "content_checklist",
    title: "Implementation Checklist",
    subtitle: "Everything you need for a successful rollout",
    items: [
      "Data sources connected",
      "Security policies configured",
      "Team members invited",
      "First workflow automated",
      "Analytics dashboard setup",
      "Support team trained",
    ],
    theme: {
      backgroundColor: "#000000",
      surfaceColor: "#171717",
      primaryTextColor: "#FFFFFF",
      secondaryTextColor: "#A3A3A3",
      accentColor: "#00B8D9",
      fontFamily: "Calibri",
    },
  },
  comparison_table_example: {
    subtype: "content_comparison_table",
    title: "Feature Comparison",
    headers: ["Feature", "Starter", "Enterprise"],
    rows: [
      ["AI Agents", "3 agents", "Unlimited"],
      ["Integrations", "20 apps", "500+ apps"],
      ["Storage", "10 GB", "Unlimited"],
      ["Support", "Email only", "24/7 Dedicated"],
    ],
    theme: {
      backgroundColor: "#FFFFFF",
      surfaceColor: "#F1F5F9",
      primaryTextColor: "#0F172A",
      secondaryTextColor: "#475569",
      accentColor: "#8B5CF6",
      fontFamily: "Calibri",
    },
  },

  pros_cons_example: {
    subtype: "content_pros_cons",
    title: "Build vs Buy Decision",
    pros: [
      "Faster time to market",
      "Lower upfront costs",
      "Proven reliability",
      "Regular updates included",
    ],
    cons: [
      "Less customization",
      "Vendor dependency",
      "Recurring fees",
      "Limited control",
    ],
    theme: {
      backgroundColor: "#0F172A",
      surfaceColor: "#1E293B",
      primaryTextColor: "#F1F5F9",
      secondaryTextColor: "#94A3B8",
      accentColor: "#10B981",
      fontFamily: "Calibri",
    },
  },

  stats_metrics_example: {
    subtype: "content_stats_metrics",
    title: "Platform Impact",
    stats: [
      { value: "94%", label: "Time Saved" },
      { value: "3.2x", label: "ROI Increase" },
      { value: "50K+", label: "Active Users" },
      { value: "99.9%", label: "Uptime" },
    ],
    theme: {
      backgroundColor: "#000000",
      surfaceColor: "#171717",
      primaryTextColor: "#FFFFFF",
      secondaryTextColor: "#A3A3A3",
      accentColor: "#00B8D9",
      fontFamily: "Calibri",
    },
  },
};

export default function ContentTester() {
  return (
    <SlideTester
      templates={contentTemplates}
      slides={aiGeneratedContent}
      title="Content Tester"
      initialKey="bullets_example"
    />
  );
}
