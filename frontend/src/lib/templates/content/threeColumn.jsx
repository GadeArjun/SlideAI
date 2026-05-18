export function Preview({ data }) {
  const t = data.theme;
  const cols = data.columns || [];
  return (
    <div
      className="w-full h-full p-12 flex flex-col"
      style={{ backgroundColor: t.backgroundColor }}
    >
      <h1
        className="text-3xl font-bold mb-10 text-center"
        style={{ color: t.primaryTextColor, fontFamily: t.fontFamily }}
      >
        {data.title}
      </h1>
      <div className="grid grid-cols-3 gap-8 flex-1">
        {cols.slice(0, 3).map((c, i) => {
          const title = c.title || c.heading || "";
          const content = c.content || c.text || "";
          return (
            <div key={i} className="flex flex-col items-center text-center">
              <div
                className="w-14 h-14 rounded-2xl mb-5 flex items-center justify-center shadow-lg"
                style={{ backgroundColor: t.accentColor }}
              >
                <span
                  className="text-xl font-bold"
                  style={{ color: t.backgroundColor }}
                >
                  {i + 1}
                </span>
              </div>
              <h3
                className="text-lg font-bold mb-3"
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
  const cols = data.columns || [];

  // Solid background
  slide.background = { color: t.backgroundColor.replace("#", "") };

  // Title
  slide.addText(data.title || "", {
    x: 0.5,
    y: 0.6,
    w: 9,
    h: 0.8,
    fontSize: 28,
    bold: true,
    align: "center",
    color: t.primaryTextColor.replace("#", ""),
    fontFace: t.fontFamily || "Calibri",
  });

  const colW = 2.85;
  const startX = 0.6;
  const gap = 0.225;

  cols.slice(0, 3).forEach((c, i) => {
    const x = startX + i * (colW + gap);
    const title = c.title || c.heading || "";
    const content = c.content || c.text || "";

    // Number box
    slide.addShape(pptx.ShapeType.rect, {
      x: x + 1.075,
      y: 1.7,
      w: 0.7,
      h: 0.7,
      fill: { color: t.accentColor.replace("#", "") },
      line: { type: "none" },
    });

    slide.addText(String(i + 1), {
      x: x + 1.075,
      y: 1.7,
      w: 0.7,
      h: 0.7,
      fontSize: 22,
      bold: true,
      align: "center",
      valign: "middle",
      color: "FFFFFF",
      fontFace: t.fontFamily || "Calibri",
    });

    // Column title
    slide.addText(title, {
      x: x,
      y: 2.55,
      w: colW,
      h: 0.5,
      fontSize: 18,
      bold: true,
      align: "center",
      color: t.primaryTextColor.replace("#", ""),
      fontFace: t.fontFamily || "Calibri",
    });

    // Column content
    slide.addText(content, {
      x: x,
      y: 3.1,
      w: colW,
      h: 1.7,
      fontSize: 14,
      align: "center",
      valign: "top",
      wrap: true,
      color: t.secondaryTextColor.replace("#", ""),
      fontFace: t.fontFamily || "Calibri",
      lineSpacing: 18,
    });
  });
}

export const meta = {
  id: "content_three_column",
  name: "Three Columns",
  category: "content",
  supports: ["title", "columns"],
};
