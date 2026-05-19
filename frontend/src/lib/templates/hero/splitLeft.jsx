import { getIconBase64 } from "../../../utils/iconHelper.js";
import * as LucideIcons from "lucide-react";

/* =====================================================
   PREVIEW COMPONENT
   ===================================================== */

export function Preview({ data }) {
  const theme = data.theme;
  const IconComponent = data.icon ? LucideIcons[data.icon] : null;
  const accentColor = theme.accentColor;

  return (
    <div
      className="w-full h-full flex overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div
        className="w-[45%] h-full flex items-center justify-center relative"
        style={{ backgroundColor: theme.surfaceColor }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(45deg, ${theme.primaryTextColor} 25%, transparent 25%), linear-gradient(-45deg, ${theme.primaryTextColor} 25%, transparent 25%)`,
            backgroundSize: "20px 20px",
          }}
        />
        {IconComponent && (
          <div className="relative z-10">
            <IconComponent size={110} color={accentColor} strokeWidth={1.25} />
          </div>
        )}
        <div
          className="absolute right-0 top-0 bottom-0 w-1"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      <div className="w-[55%] h-full flex flex-col justify-center px-14">
        <div
          className="w-12 h-1 mb-6 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        <h1
          className="text-4xl xl:text-5xl font-bold mb-4"
          style={{ color: theme.primaryTextColor, lineHeight: "1.15" }}
        >
          {data.title}
        </h1>
        {data.subtitle && (
          <p
            className="text-lg"
            style={{ color: theme.secondaryTextColor, lineHeight: "1.5" }}
          >
            {data.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   PPTX GENERATOR - FIXED ICON SIZE
   ===================================================== */

export async function toPptx(slide, pptx, data) {
  const theme = data.theme;

  const SLIDE_W = 10;
  const SLIDE_H = 5.625;
  const LEFT_W = 4.2;
  const RIGHT_X = 4.6;
  const RIGHT_W = 4.9;

  const bgColor = (theme.backgroundColor || "#FEFCF8").replace("#", "");
  const surfaceColor = (theme.surfaceColor || "#F9F7F3").replace("#", "");
  const primaryColor = (theme.primaryTextColor || "#1C1917").replace("#", "");
  const secondaryColor = (theme.secondaryTextColor || "#57534E").replace(
    "#",
    ""
  );
  const accentColor = theme.accentColor.replace("#", "");

  slide.background = { color: bgColor };

  // Left panel
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: LEFT_W,
    h: SLIDE_H,
    fill: { color: surfaceColor },
    line: { type: "none" },
  });

  // Add subtle pattern (approximate the web version)
  // PowerPoint can't do CSS patterns, so we skip or use light dots
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 12; j++) {
      slide.addShape(pptx.ShapeType.rect, {
        x: i * 0.22,
        y: j * 0.48,
        w: 0.015,
        h: 0.015,
        fill: { color: primaryColor, transparency: 97 },
        line: { type: "none" },
      });
    }
  }

  // Orange divider
  slide.addShape(pptx.ShapeType.rect, {
    x: LEFT_W,
    y: 0,
    w: 0.04,
    h: SLIDE_H,
    fill: { color: accentColor },
    line: { type: "none" },
  });

  // === ICON - FIXED ===
  if (data.icon) {
    const ICON_SIZE = 1.1; // Slightly smaller for PPT
    const iconData = await getIconBase64(data.icon, `#${accentColor}`, 1);

    slide.addImage({
      data: iconData,
      x: (LEFT_W - ICON_SIZE) / 2,
      y: (SLIDE_H - ICON_SIZE) / 2,
      w: ICON_SIZE,
      h: ICON_SIZE,
      // NO sizing parameter - let PowerPoint scale naturally
    });
  }

  // Right content
  slide.addShape(pptx.ShapeType.rect, {
    x: RIGHT_X,
    y: 1.9,
    w: 0.7,
    h: 0.04,
    fill: { color: accentColor },
    line: { type: "none" },
  });

  slide.addText(data.title || "", {
    x: RIGHT_X,
    y: 2.05,
    w: RIGHT_W,
    h: 1.0,
    fontSize: 32,
    bold: true,
    color: primaryColor,
    fontFace: "Calibri",
    align: "left",
    valign: "top",
    fit: "shrink",
    wrap: true,
    lang: "en-US", // Reduces spellcheck squiggles
  });

  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: RIGHT_X,
      y: 3.15,
      w: RIGHT_W - 0.3,
      h: 0.8,
      fontSize: 13,
      color: secondaryColor,
      fontFace: "Calibri",
      align: "left",
      valign: "top",
      fit: "shrink",
      wrap: true,
      lineSpacing: 18,
      lang: "en-US",
    });
  }
}

/* =====================================================
   METADATA
   ===================================================== */

export const meta = {
  id: "hero_split_left",
  name: "Hero - Split Left",
  description: "Icon left, content right",
  category: "hero",
  supports: ["title", "subtitle", "icon"],
};
