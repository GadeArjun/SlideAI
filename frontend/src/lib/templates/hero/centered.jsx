import { getIconBase64 } from "../../../utils/iconHelper.js";
import * as LucideIcons from "lucide-react";

/* =====================================================
   PREVIEW COMPONENT - React (browser)
   ===================================================== */

export function Preview({ data }) {
  const theme = data.theme;
  const IconComponent = data.iconName ? LucideIcons[data.iconName] : null;
  const accentColor = theme.accentColor;

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily || "Inter, system-ui, sans-serif",
      }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{ height: "8px", backgroundColor: accentColor }}
      />

      {/* Icon */}
      {IconComponent && (
        <div className="mb-8 transform transition-all duration-300 hover:scale-110">
          <IconComponent size={72} color={accentColor} strokeWidth={1.5} />
        </div>
      )}

      {/* Title */}
      <h1
        className="text-5xl xl:text-6xl font-bold text-center px-12 mb-6 leading-tight"
        style={{
          color: theme.primaryTextColor,
          maxWidth: "900px",
          lineHeight: "1.1",
        }}
      >
        {data.title}
      </h1>

      {/* Subtitle */}
      {data.subtitle && (
        <p
          className="text-xl xl:text-2xl text-center px-12"
          style={{
            color: theme.secondaryTextColor,
            maxWidth: "700px",
            lineHeight: "1.4",
          }}
        >
          {data.subtitle}
        </p>
      )}

      {/* Bottom accent */}
      <div
        className="absolute"
        style={{
          bottom: "48px",
          width: "128px",
          height: "3px",
          backgroundColor: accentColor,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
    </div>
  );
}

/* =====================================================
   PPTX GENERATOR - Perfectly balanced for 10" × 5.625"
   ===================================================== */

export async function toPptx(slide, pptx, data) {
  // === SLIDE DIMENSIONS (pptxgenjs 16:9) ===
  const theme = data.theme;
  const SLIDE_W = 10;
  const SLIDE_H = 5.625;
  const MARGIN_X = 0.6;
  const CONTENT_W = SLIDE_W - MARGIN_X * 2; // 8.8"

  // === COLORS ===
  const bgColor = (theme.backgroundColor || "#0F172A").replace("#", "");
  const primaryColor = (theme.primaryTextColor || "#F8FAFC").replace("#", "");
  const secondaryColor = (theme.secondaryTextColor || "#CBD5E1").replace(
    "#",
    ""
  );
  const accentColor = (theme.accentColor || "#3B82F6").replace("#", "");
  const fontFamily = theme.fontFamily || "Arial";

  // === BACKGROUND ===
  slide.background = { color: bgColor };

  // === TOP ACCENT BAR ===
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: SLIDE_W,
    h: 0.05,
    fill: { color: accentColor },
    line: { color: accentColor },
  });

  // === ICON (PERFECTLY CENTERED AND VISIBLE) ===
  let hasIcon = false;
  const ICON_SIZE = 0.75; // Optimal size - fully visible, not too big
  const ICON_Y = 0.85; // Positioned with proper top margin

  if (data.iconName) {
    try {
      // Generate SVG at exact display size for crisp rendering
      const iconData = await getIconBase64(
        data.iconName,
        theme.accentColor,
        ICON_SIZE // Match display size
      );

      if (iconData) {
        hasIcon = true;
        const iconX = (SLIDE_W - ICON_SIZE) / 2;

        // Add subtle background circle for better visibility
        slide.addShape(pptx.ShapeType.ellipse, {
          x: iconX - 0.08,
          y: ICON_Y - 0.08,
          w: ICON_SIZE + 0.16,
          h: ICON_SIZE + 0.16,
          fill: { color: accentColor, transparency: 90 },
          line: { type: "none" },
        });

        // Main icon
        slide.addImage({
          data: iconData,
          x: iconX,
          y: ICON_Y,
          w: ICON_SIZE,
          h: ICON_SIZE,
          sizing: { type: "contain" },
        });
      }
    } catch (error) {
      console.warn(`[Hero] Icon load failed: ${error.message}`);
      hasIcon = false;
    }
  }

  // === TITLE (DYNAMIC POSITIONING) ===
  const TITLE_Y = hasIcon ? 1.85 : 2.1;
  const TITLE_H = data.subtitle ? 0.9 : 1.3;

  slide.addText(data.title || "", {
    x: MARGIN_X,
    y: TITLE_Y,
    w: CONTENT_W,
    h: TITLE_H,
    fontSize: 34, // Optimized for 10" width
    bold: true,
    align: "center",
    valign: "middle",
    color: primaryColor,
    fontFace: fontFamily,
    fit: "shrink",
    wrap: true,
    breakWord: true,
    lineSpacingMultiple: 1.05,
    margin: 0,
  });

  // === SUBTITLE ===
  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: MARGIN_X + 0.5,
      y: TITLE_Y + TITLE_H + 0.12,
      w: CONTENT_W - 1,
      h: 0.55,
      fontSize: 15,
      align: "center",
      valign: "top",
      color: secondaryColor,
      fontFace: fontFamily,
      fit: "shrink",
      wrap: true,
      lineSpacingMultiple: 1.25,
      margin: 0,
    });
  }

  // === BOTTOM ACCENT ===
  const BOTTOM_Y = hasIcon ? 4.35 : 4.5;
  slide.addShape(pptx.ShapeType.rect, {
    x: (SLIDE_W - 1.8) / 2,
    y: BOTTOM_Y,
    w: 1.8,
    h: 0.025,
    fill: { color: accentColor },
    line: { color: accentColor },
    rectRadius: 0.01,
  });
}

/* =====================================================
   METADATA
   ===================================================== */

export const meta = {
  id: "hero_centered",
  name: "Hero - Centered",
  description: "Large centered title with optional icon",
  category: "hero",
  supports: ["title", "subtitle", "icon"],
};
