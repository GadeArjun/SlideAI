import { getIconBase64 } from "../../../utils/iconHelper.js";
import * as LucideIcons from "lucide-react";

/* =====================================================
   PREVIEW - React
   ===================================================== */
export function Preview({ data }) {
  const t = data.theme;
  const socials = data.socials || [
    { icon: "Twitter", handle: "@company" },
    { icon: "Linkedin", handle: "company" },
    { icon: "Github", handle: "company" },
    { icon: "Instagram", handle: "@company" },
  ];

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center"
      style={{ backgroundColor: t.backgroundColor, fontFamily: t.fontFamily }}
    >
      <h1
        className="text-5xl font-bold mb-12"
        style={{ color: t.primaryTextColor }}
      >
        {data.title || "Thank You"}
      </h1>

      <div className="flex gap-5">
        {socials.map((s, i) => {
          const Icon = LucideIcons[s.icon] || LucideIcons.Link;
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                style={{ backgroundColor: t.accentColor }}
              >
                <Icon size={24} color="#FFFFFF" strokeWidth={2} />
              </div>
              {s.handle && (
                <span
                  className="text-xs"
                  style={{ color: t.secondaryTextColor }}
                >
                  {s.handle}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {data.subtitle && (
        <p className="mt-10 text-lg" style={{ color: t.secondaryTextColor }}>
          {data.subtitle}
        </p>
      )}
    </div>
  );
}

/* =====================================================
   PPTX - PowerPoint
   ===================================================== */
export async function toPptx(slide, pptx, data) {
  const t = data.theme;
  const socials = data.socials || [
    { icon: "Twitter" },
    { icon: "Linkedin" },
    { icon: "Github" },
    { icon: "Instagram" },
  ];

  // Background
  slide.background = { color: t.backgroundColor.replace("#", "") };

  // Title
  slide.addText(data.title || "Thank You", {
    x: 2.5,
    y: 1.6,
    w: 5,
    h: 0.8,
    fontSize: 36,
    bold: true,
    align: "center",
    color: t.primaryTextColor.replace("#", ""),
    fontFace: t.fontFamily || "Arial",
  });

  // Social icons - perfectly centered
  const totalWidth = socials.length * 1.1 - 0.2;
  const startX = (10 - totalWidth) / 2;

  for (let i = 0; i < socials.length; i++) {
    const s = socials[i];
    const x = startX + i * 1.1;
    const y = 2.8;

    // Circle background
    slide.addShape(pptx.ShapeType.ellipse, {
      x,
      y,
      w: 0.9,
      h: 0.9,
      fill: { color: t.accentColor.replace("#", "") },
      line: { type: "none" },
      shadow: {
        type: "outer",
        blur: 4,
        offset: 2,
        color: "000000",
        opacity: 0.2,
      },
    });

    // Lucide icon (white)
    try {
      const iconData = await getIconBase64(s.icon, "#FFFFFF", 28);
      slide.addImage({
        data: iconData,
        x: x + 0.23,
        y: y + 0.23,
        w: 0.44,
        h: 0.44,
        sizing: { type: "contain" },
      });
    } catch (e) {
      console.warn(`Icon ${s.icon} failed`);
    }

    // Handle text below
    if (s.handle) {
      slide.addText(s.handle, {
        x: x - 0.1,
        y: y + 0.95,
        w: 1.1,
        h: 0.25,
        fontSize: 9,
        align: "center",
        color: t.secondaryTextColor.replace("#", ""),
      });
    }
  }

  // Subtitle
  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 2,
      y: 4.2,
      w: 6,
      h: 0.4,
      fontSize: 14,
      align: "center",
      color: t.secondaryTextColor.replace("#", ""),
    });
  }
}

export const meta = {
  id: "content_closing_social",
  name: "Closing - Social Connect",
  supports: ["title", "socials", "icons"],
};
