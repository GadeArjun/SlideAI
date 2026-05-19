import SlideTester from "./SlideTester.jsx";
import { closingTemplates } from "../lib/templates/closing";

const aiGeneratedContent = {
  simple_example: {
    subtype: "content_closing_simple",
    title: "Thank You",
    subtitle: "We appreciate your time and attention",
    theme: {
      backgroundColor: "#FFFFFF",
      primaryTextColor: "#0F172A",
      secondaryTextColor: "#64748B",
      accentColor: "#8B5CF6",
      fontFamily: "Calibri",
    },
  },
  contact_example: {
    subtype: "content_closing_contact",
    contacts: [
      { icon: "Mail", text: "hello@company.com" },
      { icon: "Phone", text: "+1 (555) 123-4567" },
      { icon: "Globe", text: "www.company.com" },
      { icon: "MapPin", text: "San Francisco, CA" },
    ],
    theme: {
      backgroundColor: "#0F172A",
      primaryTextColor: "#F8FAFC",
      secondaryTextColor: "#CBD5E1",
      accentColor: "#3B82F6",
      fontFamily: "Calibri",
    },
  },
  questions_example: {
    subtype: "content_closing_questions",
    title: "Questions?",
    subtitle: "Let's build something amazing together",
    theme: {
      backgroundColor: "#F8FAFC",
      surfaceColor: "#FFFFFF",
      primaryTextColor: "#0F172A",
      secondaryTextColor: "#475569",
      accentColor: "#10B981",
      fontFamily: "Calibri",
    },
  },
  social_example: {
    subtype: "content_closing_social",
    title: "Thank You",
    subtitle: "Follow us for updates",
    socials: [
      { icon: "Twitter", handle: "@company" },
      { icon: "Linkedin", handle: "/company" },
      { icon: "Github", handle: "company" },
      { icon: "Instagram", handle: "@company" },
    ],
    theme: {
      backgroundColor: "#FFFFFF",
      primaryTextColor: "#0F172A",
      secondaryTextColor: "#64748B",
      accentColor: "#6366F1",
    },
  },
  elegant_example: {
    subtype: "content_closing_elegant",
    title: "thank you",
    theme: {
      backgroundColor: "#000000",
      primaryTextColor: "#FFFFFF",
      accentColor: "#F59E0B",
      fontFamily: "Georgia",
    },
  },
};

export default function ClosingTester() {
  return (
    <SlideTester
      templates={closingTemplates}
      slides={aiGeneratedContent}
      title="Closing Slides Tester"
      initialKey="simple_example"
    />
  );
}
