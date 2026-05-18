export function Preview({ data }) {
  const t = data.theme;
  const items = data.items || [];
  return (
    <div
      className="w-full h-full p-10 flex flex-col"
      style={{ backgroundColor: t.backgroundColor }}
    >
      <h1
        className="text-2xl font-bold mb-6"
        style={{ color: t.primaryTextColor, fontFamily: t.fontFamily }}
      >
        {data.title}
      </h1>
      <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1">
        {items.slice(0, 4).map((it, i) => {
          const title = it.title || "";
          const content = it.content || it.desc || "";
          return (
            <div
              key={i}
              className="p-5 rounded-xl flex flex-col"
              style={{
                backgroundColor: t.surfaceColor,
                borderLeft: `4px solid ${t.accentColor}`,
              }}
            >
              <h3
                className="font-bold mb-2 text-base"
                style={{ color: t.primaryTextColor }}
              >
                {title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: t.secondaryTextColor }}
              >
                {content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const t = data.theme;
  const items = data.items || [];

  slide.background = { color: t.backgroundColor.replace("#", "") };

  // Title
  slide.addText(data.title || "", {
    x: 0.5,
    y: 0.4,
    w: 9,
    h: 0.6,
    fontSize: 24,
    bold: true,
    color: t.primaryTextColor.replace("#", ""),
    fontFace: t.fontFamily || "Calibri",
  });

  const positions = [
    [0.5, 1.25],
    [5.1, 1.25],
    [0.5, 3.35],
    [5.1, 3.35],
  ];

  items.slice(0, 4).forEach((it, i) => {
    const [x, y] = positions[i];
    const title = it.title || "";
    const content = it.content || it.desc || "";

    // Card background
    slide.addShape(pptx.ShapeType.rect, {
      x,
      y,
      w: 4.4,
      h: 1.9,
      fill: { color: t.surfaceColor.replace("#", "") },
      line: { type: "none" },
    });

    // Accent left bar
    slide.addShape(pptx.ShapeType.rect, {
      x,
      y,
      w: 0.08,
      h: 1.9,
      fill: { color: t.accentColor.replace("#", "") },
      line: { type: "none" },
    });

    // Title
    slide.addText(title, {
      x: x + 0.25,
      y: y + 0.25,
      w: 4.0,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: t.primaryTextColor.replace("#", ""),
      fontFace: t.fontFamily || "Calibri",
    });

    // Content
    slide.addText(content, {
      x: x + 0.25,
      y: y + 0.75,
      w: 4.0,
      h: 0.95,
      fontSize: 13,
      color: t.secondaryTextColor.replace("#", ""),
      fontFace: t.fontFamily || "Calibri",
      wrap: true,
      valign: "top",
      lineSpacing: 16,
    });
  });
}

export const meta = {
  id: "content_four_grid",
  name: "Four Grid",
  category: "content",
  supports: ["title", "items"],
};
