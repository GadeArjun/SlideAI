export function Preview({ data }) {
  const t = data.theme;
  return (
    <div
      className="w-full h-full p-16 flex flex-col justify-center items-center text-center"
      style={{ backgroundColor: t.backgroundColor }}
    >
      <div className="text-7xl mb-4" style={{ color: t.accentColor }}>
        "
      </div>
      <p
        className="text-2xl leading-relaxed max-w-3xl mb-8"
        style={{ color: t.primaryTextColor }}
      >
        {data.quote}
      </p>
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
          style={{ backgroundColor: t.accentColor, color: "#fff" }}
        >
          {data.author?.[0]}
        </div>
        <div className="text-left">
          <p className="font-bold" style={{ color: t.primaryTextColor }}>
            {data.author}
          </p>
          <p className="text-sm" style={{ color: t.secondaryTextColor }}>
            {data.role} • {data.company}
          </p>
        </div>
      </div>
    </div>
  );
}
export async function toPptx(slide, pptx, data) {
  const t = data.theme;
  slide.background = { color: t.backgroundColor.replace("#", "") };
  slide.addText('"', {
    x: 4.7,
    y: 1.2,
    w: 0.6,
    h: 0.8,
    fontSize: 72,
    color: t.accentColor.replace("#", ""),
    align: "center",
  });
  slide.addText(data.quote, {
    x: 1.5,
    y: 2.0,
    w: 7,
    h: 1.8,
    fontSize: 22,
    italic: true,
    align: "center",
    color: t.primaryTextColor.replace("#", ""),
    wrap: true,
  });
  slide.addText(data.author, {
    x: 3,
    y: 4.0,
    w: 4,
    h: 0.3,
    fontSize: 16,
    bold: true,
    align: "center",
    color: t.primaryTextColor.replace("#", ""),
  });
  slide.addText(`${data.role} • ${data.company}`, {
    x: 3,
    y: 4.35,
    w: 4,
    h: 0.3,
    fontSize: 12,
    align: "center",
    color: t.secondaryTextColor.replace("#", ""),
  });
}
export const meta = { id: "content_quote_testimonial", name: "Quote" };
