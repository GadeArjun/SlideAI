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
  backgroundColor: "#FFF8E1",
  surfaceColor: "#FFE0B2",
  primaryTextColor: "#212121",
  secondaryTextColor: "#555555",
  accentColor: "#F59E0B",
  fontFamily: "Calibri",
};

// === FULL 7-SLIDE AI AGENTS DECK ===
const fullDeck = [
  {
    slideId: "slide_1",
    category: "hero",
    template: "hero_full_bleed",
    templateDirection: "hero",
    title: "AI Powered Healthcare",
    description:
      "A bold visual introducing AI in healthcare.\nHighlight the transformative impact on patient care and operations.\nUse vibrant yellow‑orange accents to convey energy and innovation.",
    keyPoints: [],
    prompt: "",
    data: {
      title: "AI Powered Healthcare",
      subtitle: "Transforming patient care and operations",
      icon: "HeartBeat",
    },
    status: "completed",
    error: "",
  },
];

export default function FullDeckTester() {
  const [current, setCurrent] = useState(0);
  const slide = fullDeck[current];
  const Template = allTemplates[slide.template];

  const exportPPTX = async () => {
    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_16x9";
    pptx.author = "AI Agents Deck";
    pptx.title = "AI Agents - Full Presentation";

    for (const s of fullDeck) {
      const tpl = allTemplates[s.template];
      const pptSlide = pptx.addSlide();
      if (tpl?.toPptx) {
        await tpl.toPptx(
          pptSlide,
          pptx,
          s.data
            ? { ...s.data, theme: globalTheme }
            : { ...s, theme: globalTheme }
        );
      }
    }
    await pptx.writeFile({ fileName: "AI-Agents-Deck.pptx" });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
        <h1 className="text-xl font-bold text-indigo-600">
          AI Agents Deck • {fullDeck.length} Slides
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
      <div className="flex-1 p-8 flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-6xl aspect-video bg-white rounded-2xl shadow-2xl overflow-hidden border">
          {Template?.Preview ? (
            <Template.Preview
              data={
                slide.data
                  ? { ...slide.data, theme: globalTheme }
                  : { ...slide, theme: globalTheme }
              }
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              No preview for {slide.template}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-white text-xs text-gray-500 flex justify-between">
        <span>{slide.template}</span>
        <span>{slide.data ? slide.data.title : slide.title}</span>
      </div>
    </div>
  );
}
