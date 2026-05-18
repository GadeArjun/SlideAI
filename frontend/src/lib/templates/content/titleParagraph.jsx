export function Preview({ data }) {
  const t = data.theme;
  return (
    <div
      className="w-full h-full p-16 flex flex-col"
      style={{ backgroundColor: t.backgroundColor }}
    >
      <h1
        className="text-4xl font-bold mb-6"
        style={{ color: t.primaryTextColor, fontFamily: t.fontFamily }}
      >
        {data.title}
      </h1>
      <div
        className="w-16 h-1 mb-8"
        style={{ backgroundColor: t.accentColor }}
      />
      <p
        className="text-xl leading-relaxed max-w-4xl"
        style={{ color: t.secondaryTextColor }}
      >
        {data.content}
      </p>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const t = data.theme;
  slide.background = { color: t.backgroundColor.replace("#", "") };

  slide.addText(data.title, {
    x: 0.6,
    y: 0.6,
    w: 8.8,
    h: 0.8,
    fontSize: 28,
    bold: true,
    color: t.primaryTextColor.replace("#", ""),
  });
  slide.addShape("rect", {
    x: 0.6,
    y: 1.5,
    w: 0.8,
    h: 0.05,
    fill: { color: t.accentColor.replace("#", "") },
  });
  slide.addText(data.content, {
    x: 0.6,
    y: 1.8,
    w: 8.8,
    h: 3.2,
    fontSize: 16,
    color: t.secondaryTextColor.replace("#", ""),
    valign: "top",
    wrap: true,
  });
}

export const meta = {
  id: "content_title_paragraph",
  name: "Title + Paragraph",
  category: "content",
  supports: ["title", "content"],
};
