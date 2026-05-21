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
  timeline_vertical_example: {
    subtype: "content_timeline_vertical",
    title: "Company Journey",
    items: [
      {
        date: "2021",
        title: "Founded",
        text: "Started with 3 people in a garage",
      },
      { date: "2022", title: "Seed Round", text: "Raised $2M to build v1" },
      {
        date: "2023",
        title: "Product Launch",
        text: "10,000 users in first month",
      },
      { date: "2024", title: "Series A", text: "Scaling to enterprise" },
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

  process_flow_example: {
    subtype: "content_process_flow",
    title: "How It Works",
    steps: ["Upload Data", "AI Analyzes", "Generate Insights", "Take Action"],
    theme: {
      backgroundColor: "#0F172A",
      surfaceColor: "#1E293B",
      primaryTextColor: "#F1F5F9",
      secondaryTextColor: "#94A3B8",
      accentColor: "#10B981",
      fontFamily: "Calibri",
    },
  },

  // 1. BAR CHART
  chart_placeholder_example: {
    subtype: "content_chart_placeholder",
    title: "Quarterly Sales Performance",
    chartType: "bar",
    chartData: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      values: [45, 72, 58, 95],
    },
    seriesName: "Sales ($M)",
    theme: {
      backgroundColor: "#FFFFFF",
      surfaceColor: "#F8FAFC",
      primaryTextColor: "#0F172A",
      secondaryTextColor: "#64748B",
      accentColor: "#8B5CF6",
      fontFamily: "Calibri",
    },
  },

  // 2. LINE CHART
  chart_line_example: {
    subtype: "content_chart_placeholder",
    title: "Revenue Growth 2024",
    chartType: "line",
    chartData: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      values: [120, 145, 190, 210, 275, 360],
    },
    seriesName: "Revenue ($K)",
    theme: {
      backgroundColor: "#0F172A",
      surfaceColor: "#1E293B",
      primaryTextColor: "#F1F5F9",
      secondaryTextColor: "#94A3B8",
      accentColor: "#10B981",
      fontFamily: "Calibri",
    },
  },

  // 3. PIE CHART
  chart_pie_example: {
    subtype: "content_chart_placeholder",
    title: "Market Share by Region",
    chartType: "pie",
    chartData: {
      labels: ["North America", "Europe", "APAC", "Others"],
      values: [42, 28, 22, 8],
    },
    seriesName: "Share %",
    theme: {
      backgroundColor: "#000000",
      surfaceColor: "#171717",
      primaryTextColor: "#FFFFFF",
      secondaryTextColor: "#A3A3A3",
      accentColor: "#F59E0B",
      fontFamily: "Calibri",
    },
  },

  // 4. BAR CHART - DARK (for testing)
  chart_bar_dark_example: {
    subtype: "content_chart_placeholder",
    title: "User Acquisition",
    chartType: "bar",
    chartData: {
      labels: ["Organic", "Paid", "Referral", "Social"],
      values: [320, 180, 240, 150],
    },
    seriesName: "Users",
    theme: {
      backgroundColor: "#000000",
      surfaceColor: "#171717",
      primaryTextColor: "#FFFFFF",
      secondaryTextColor: "#A3A3A3",
      accentColor: "#00B8D9",
      fontFamily: "Calibri",
    },
  },

  // 5. LINE CHART - STEEP GROWTH
  chart_line_steep_example: {
    subtype: "content_chart_placeholder",
    title: "AI Adoption Rate",
    chartType: "line",
    chartData: {
      labels: ["2020", "2021", "2022", "2023", "2024"],
      values: [5, 12, 28, 55, 89],
    },
    seriesName: "Adoption %",
    theme: {
      backgroundColor: "#FFFFFF",
      surfaceColor: "#FEF3C7",
      primaryTextColor: "#92400E",
      secondaryTextColor: "#B45309",
      accentColor: "#F59E0B",
      fontFamily: "Calibri",
    },
  },
  pricing_table_example: {
    subtype: "content_pricing_table",
    title: "Choose Your Plan",
    plans: [
      {
        name: "Starter",
        price: "$29",
        features: ["5 agents", "Basic analytics", "Email support"],
      },
      {
        name: "Pro",
        price: "$99",
        features: [
          "Unlimited agents",
          "Advanced analytics",
          "Priority support",
          "API access",
        ],
      },
      {
        name: "Enterprise",
        price: "Custom",
        features: [
          "Custom models",
          "SLA",
          "Dedicated manager",
          "On-prem option",
        ],
      },
    ],
    theme: {
      backgroundColor: "#FFFFFF",
      surfaceColor: "#F1F5F9",
      primaryTextColor: "#0F172A",
      secondaryTextColor: "#64748B",
      accentColor: "#00B8D9",
      fontFamily: "Calibri",
    },
  },
  // 1. ICON GRID 3x2
  iconGrid3x2_example: {
    subtype: "content_icon_grid_3x2",
    title: "Platform Capabilities1",
    items: [
      {
        icon: "Rocket",
        title: "Lightning Fast",
        text: "Deploy agents in under 30 seconds",
      },
      {
        icon: "Brain",
        title: "AI Native",
        text: "Built on latest LLM models",
      },
      {
        icon: "ShieldCheck",
        title: "Enterprise Security",
        text: "SOC2 & GDPR compliant",
      },
      {
        icon: "Plug",
        title: "500+ Integrations",
        text: "Connect to any tool",
      },
      {
        icon: "BarChart",
        title: "Real-time Analytics",
        text: "Track every interaction",
      },
      {
        icon: "Globe",
        title: "Global Scale",
        text: "99.99% uptime SLA",
      },
    ],
    theme: {
      backgroundColor: "#FFFFFF",
      surfaceColor: "#F8FAFC",
      primaryTextColor: "#0F172A",
      secondaryTextColor: "#64748B",
      accentColor: "#8B5CF6",
      fontFamily: "Calibri",
    },
  },

  // 2. IMAGE GALLERY
  imageGallery_example: {
    subtype: "content_image_gallery",
    title: "Product Showcase",
    images: [
      {
        caption: "Dashboard Overview",
        url: "https://picsum.photos/seed/dashboard/800/600",
      },
      {
        caption: "Analytics View",
        url: "https://picsum.photos/seed/analytics/800/600",
      },
      {
        caption: "Mobile App",
        url: "https://picsum.photos/seed/mobile/800/600",
      },
      {
        caption: "Team Collaboration",
        url: "https://picsum.photos/seed/team/800/600",
      },
    ],
    theme: {
      backgroundColor: "#0F172A",
      surfaceColor: "#1E293B",
      primaryTextColor: "#F1F5F9",
      secondaryTextColor: "#94A3B8",
      accentColor: "#00B8D9",
      fontFamily: "Calibri",
    },
  },

  // 3. QUOTE TESTIMONIAL
  quoteTestimonial_example: {
    subtype: "content_quote_testimonial",
    quote:
      "This platform reduced our support response time by 80% and increased customer satisfaction to 4.9/5. Game changer.",
    author: "Sarah Chen",
    role: "VP of Customer Success, TechCorp",
    company: "TechCorp",
    theme: {
      backgroundColor: "#000000",
      surfaceColor: "#171717",
      primaryTextColor: "#FFFFFF",
      secondaryTextColor: "#A3A3A3",
      accentColor: "#F59E0B",
      fontFamily: "Calibri",
    },
  },

  // 4. TEAM GRID
  teamGrid_example: {
    subtype: "content_team_grid",
    title: "Leadership Team",
    members: [
      { name: "Alex Rivera", role: "CEO & Founder", initials: "AR" },
      { name: "Maya Patel", role: "CTO", initials: "MP" },
      { name: "Jordan Kim", role: "Head of Product", initials: "JK" },
      { name: "Taylor Wu", role: "VP Engineering", initials: "TW" },
    ],
    theme: {
      backgroundColor: "#FFFFFF",
      surfaceColor: "#F1F5F9",
      primaryTextColor: "#0F172A",
      secondaryTextColor: "#475569",
      accentColor: "#10B981",
      fontFamily: "Calibri",
    },
  },

  // 6. FAQ ACCORDION
  faqAccordion_example: {
    subtype: "content_faq_accordion",
    title: "Frequently Asked Questions",
    faqs: [
      {
        q: "How long does implementation take?",
        a: "Most teams are live in under 1 day with our guided setup.",
      },
      {
        q: "Do you integrate with Salesforce?",
        a: "Yes, plus 500+ other tools via native integrations and API.",
      },
      {
        q: "What about data security?",
        a: "SOC2 Type II, GDPR compliant, with end-to-end encryption.",
      },
      {
        q: "Can we try before buying?",
        a: "14-day free trial, no credit card required.",
      },
    ],
    theme: {
      backgroundColor: "#FFFFFF",
      surfaceColor: "#F8FAFC",
      primaryTextColor: "#0F172A",
      secondaryTextColor: "#64748B",
      accentColor: "#6366F1",
      fontFamily: "Calibri",
    },
  },

  // 7. CODE BLOCK
  codeBlock_example: {
    subtype: "content_code_block",
    title: "Quick Start API",
    language: "javascript",
    code: `import { Agent } from '@company/sdk';

const agent = new Agent({
  apiKey: process.env.API_KEY,
  model: 'gpt-4-turbo'
});

const response = await agent.chat(
  'Analyze this customer feedback'
);`,
    theme: {
      backgroundColor: "#0F172A",
      surfaceColor: "#1E293B",
      primaryTextColor: "#E2E8F0",
      secondaryTextColor: "#94A3B8",
      accentColor: "#22D3EE",
      fontFamily: "JetBrains Mono",
    },
  },

  // 8. CALLOUT BOX
  calloutBox_example: {
    subtype: "content_callout_box",
    type: "warning", // 'info' | 'warning' | 'success' | 'error'
    title: "Pro Tip",
    message:
      "Teams that connect their CRM in the first week see 3.2x faster time-to-value. Set up your integration during onboarding.",
    theme: {
      backgroundColor: "#FFFBEB",
      surfaceColor: "#FEF3C7",
      primaryTextColor: "#92400E",
      secondaryTextColor: "#B45309",
      accentColor: "#F59E0B",
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
