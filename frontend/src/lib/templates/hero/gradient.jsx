import { getIconBase64 } from "../../../utils/iconHelper.js";

export function Preview({ data }) {
  const theme = data.theme;
  return (
    <div
      className="w-full h-full flex items-center"
      style={{
        background: `linear-gradient(90deg, ${theme.backgroundColor} 0%, ${theme.surfaceColor} 100%)`,
      }}
    >
      <div className="px-16">
        <div
          className="w-16 h-1 mb-6"
          style={{ backgroundColor: theme.accentColor }}
        />
        <h1
          className="text-5xl font-bold mb-3"
          style={{ color: theme.primaryTextColor }}
        >
          {data.title}
        </h1>
        <p className="text-xl" style={{ color: theme.secondaryTextColor }}>
          {data.subtitle}
        </p>
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const theme = data.theme;
  const accent = theme.accentColor.replace("#", "");

  slide.background = {
    fill: {
      type: "gradient",
      colors: [
        { color: theme.backgroundColor.replace("#", ""), position: 0 },
        { color: theme.surfaceColor.replace("#", ""), position: 100 },
      ],
      angle: 0,
    },
  };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 1.8,
    w: 1,
    h: 0.06,
    fill: { color: accent },
    line: { type: "none" },
  });

  slide.addText(data.title, {
    x: 0.8,
    y: 2.0,
    w: 8.5,
    h: 1.2,
    fontSize: 36,
    bold: true,
    color: theme.primaryTextColor.replace("#", ""),
    fit: "shrink",
  });

  slide.addText(data.subtitle || "", {
    x: 0.8,
    y: 3.3,
    w: 7,
    h: 0.7,
    fontSize: 15,
    color: theme.secondaryTextColor.replace("#", ""),
    fit: "shrink",
  });
}

// hero_gradient.js
export const meta = {
  id: "hero_gradient",
  name: "Gradient",
  description: "Bold solid-color wash with accent bar - PowerPoint safe",
  category: "hero",
  supports: ["title", "subtitle"],
};
