export function Preview({ data }) {
  const theme = data.theme;
  return (
    <div
      className="w-full h-full flex flex-col justify-center px-20"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <h1
        className="text-7xl font-light tracking-tight mb-6"
        style={{ color: theme.primaryTextColor, fontFamily: "serif" }}
      >
        {data.title}
      </h1>
      <div
        className="w-24 h-px mb-6"
        style={{ backgroundColor: theme.accentColor }}
      />
      {data.subtitle && (
        <p
          className="text-2xl font-light max-w-2xl"
          style={{ color: theme.secondaryTextColor }}
        >
          {data.subtitle}
        </p>
      )}
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const theme = data.theme;
  slide.background = { color: theme.backgroundColor.replace("#", "") };

  slide.addText(data.title, {
    x: 0.8,
    y: 1.8,
    w: 8.4,
    h: 1.5,
    fontSize: 48,
    bold: false,
    color: theme.primaryTextColor.replace("#", ""),
    fontFace: "Georgia",
    fit: "shrink",
    valign: "bottom",
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 3.4,
    w: 1.5,
    h: 0.02,
    fill: { color: theme.accentColor.replace("#", "") },
    line: { type: "none" },
  });

  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 0.8,
      y: 3.6,
      w: 7,
      h: 0.8,
      fontSize: 18,
      color: theme.secondaryTextColor.replace("#", ""),
      fontFace: "Georgia",
      fit: "shrink",
    });
  }
}

// hero_minimal.js
export const meta = {
  id: "hero_minimal",
  name: "Minimal",
  description: "Ultra-clean typography focus with subtle divider line",
  category: "hero",
  supports: ["title", "subtitle"],
};
