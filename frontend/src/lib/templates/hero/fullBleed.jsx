// /src/lib/templates/hero/fullBleed.js
import { getIconBase64 } from "../../../utils/iconHelper.js";
import * as LucideIcons from "lucide-react";

export function Preview({ data }) {
  const theme = data.theme;
  const Icon = data.icon ? LucideIcons[data.icon] : null;

  return (
    <div
      className="w-full h-full relative flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Solid accent overlay - replaces gradient (8% opacity) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: theme.accentColor,
          opacity: 0.08,
        }}
      />

      {/* Subtle radial glow for depth - solid color, no gradient */}
      <div
        className="absolute rounded-full"
        style={{
          width: "800px",
          height: "800px",
          left: "50%",
          top: "40%",
          transform: "translate(-50%, -50%)",
          backgroundColor: theme.accentColor,
          opacity: 0.05,
          filter: "blur(100px)",
        }}
      />

      <div className="relative z-10 text-center px-12 w-full max-w-5xl">
        {Icon && (
          <div className="mb-6 flex justify-center">
            <Icon
              size={64}
              color={theme.primaryTextColor}
              strokeWidth={1.5}
              style={{ opacity: 0.9 }}
            />
          </div>
        )}
        <h1
          className="font-bold mb-4 leading-tight"
          style={{
            color: theme.primaryTextColor,
            fontFamily: theme.fontFamily || "Inter, system-ui, sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 3.75rem)", // 40-60px responsive
            lineHeight: "1.1",
          }}
        >
          {data.title}
        </h1>
        {data.subtitle && (
          <p
            className="mx-auto"
            style={{
              color: theme.secondaryTextColor,
              fontFamily: theme.fontFamily || "Inter, system-ui, sans-serif",
              fontSize: "clamp(1rem, 2vw, 1.25rem)", // 16-20px
              lineHeight: "1.5",
              maxWidth: "700px",
            }}
          >
            {data.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const theme = data.theme;
  const SLIDE_W = 10;
  const SLIDE_H = 5.625;

  const accent = (theme.accentColor || "#8B5CF6").replace("#", "");
  const primary = theme.primaryTextColor.replace("#", "");
  const secondary = theme.secondaryTextColor.replace("#", "");

  // 1. Solid background
  slide.background = {
    color: theme.backgroundColor.replace("#", ""),
  };

  // 2. Accent overlay - SOLID COLOR with transparency (no gradient)
  // Replaces the CSS gradient with 8% opacity solid
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: SLIDE_W,
    h: SLIDE_H,
    fill: {
      color: accent,
      transparency: 92, // 8% opacity = 92% transparent
    },
    line: { type: "none" },
  });

  // 3. Center glow - solid circle with high transparency
  slide.addShape("ellipse", {
    x: 2.5, // Centered: (10 - 5) / 2
    y: 0.8, // Slightly above center
    w: 5,
    h: 5,
    fill: {
      color: accent,
      transparency: 95, // 5% opacity
    },
    line: { type: "none" },
  });

  // 4. Icon - perfectly centered
  if (data.icon) {
    try {
      const iconData = await getIconBase64(
        data.icon,
        theme.primaryTextColor,
        0.8
      );
      slide.addImage({
        data: iconData,
        x: 4.6, // (10 - 0.8) / 2 = 4.6
        y: 1.4, // Above title
        w: 0.8,
        h: 0.8,
        sizing: { type: "contain" },
      });
    } catch (e) {
      console.warn("Icon failed:", data.icon);
    }
  }

  // 5. Title - centered, matches Preview
  const titleY = data.icon ? 2.4 : 2.1; // Adjust if no icon
  slide.addText(data.title || "", {
    x: 1, // 10% margin
    y: titleY,
    w: 8, // 80% width
    h: 1.1,
    fontSize: 40,
    bold: true,
    align: "center",
    color: primary,
    fontFace: theme.fontFamily || "Calibri",
    fit: "shrink",
    wrap: true,
    valign: "middle",
    lineSpacingMultiple: 1.1,
  });

  // 6. Subtitle
  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 1.5, // 15% margin
      y: 3.6, // Below title
      w: 7, // 70% width
      h: 0.7,
      fontSize: 16,
      align: "center",
      color: secondary,
      fontFace: theme.fontFamily || "Calibri",
      fit: "shrink",
      wrap: true,
      valign: "top",
      lineSpacingMultiple: 1.4,
    });
  }
}

export const meta = {
  id: "hero_full_bleed",
  name: "Full Bleed",
  description: "Centered hero with subtle accent wash - 100% solid colors",
  category: "hero",
  supports: ["title", "subtitle", "icon"],
};
