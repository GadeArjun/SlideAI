export function Preview({ data }) {
  const t = data.theme;
  const items = data.items || [];
  return (
    <div
      className="w-full h-full p-12 flex"
      style={{ backgroundColor: t.backgroundColor }}
    >
      <div className="w-1/3">
        <h1
          className="text-2xl font-bold"
          style={{ color: t.primaryTextColor }}
        >
          {data.title}
        </h1>
      </div>
      <div className="w-2/3 relative pl-8">
        <div
          className="absolute left-3 top-0 bottom-0 w-0.5"
          style={{ backgroundColor: t.accentColor }}
        />
        {items.slice(0, 4).map((it, i) => (
          <div key={i} className="relative mb-8">
            <div
              className="absolute -left-8 w-4 h-4 rounded-full border-4"
              style={{
                backgroundColor: t.backgroundColor,
                borderColor: t.accentColor,
                top: 4,
              }}
            />
            <p
              className="text-xs font-bold mb-1"
              style={{ color: t.accentColor }}
            >
              {it.date}
            </p>
            <p className="font-bold mb-1" style={{ color: t.primaryTextColor }}>
              {it.title}
            </p>
            <p className="text-sm" style={{ color: t.secondaryTextColor }}>
              {it.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
export async function toPptx(slide, pptx, data) {
  const t = data.theme;
  const items = data.items || [];
  slide.background = { color: t.backgroundColor.replace("#", "") };
  slide.addText(data.title, {
    x: 0.5,
    y: 0.6,
    w: 3,
    h: 1,
    fontSize: 24,
    bold: true,
    color: t.primaryTextColor.replace("#", ""),
  });
  slide.addShape("line", {
    x: 4.2,
    y: 1,
    w: 0,
    h: 4,
    line: { color: t.accentColor.replace("#", ""), width: 2 },
  });
  items.slice(0, 4).forEach((it, i) => {
    const y = 1.2 + i * 1;
    slide.addShape("ellipse", {
      x: 4.1,
      y,
      w: 0.2,
      h: 0.2,
      fill: { color: t.backgroundColor.replace("#", "") },
      line: { color: t.accentColor.replace("#", ""), width: 2 },
    });
    slide.addText(it.date, {
      x: 4.5,
      y: y - 0.1,
      w: 1,
      h: 0.3,
      fontSize: 11,
      bold: true,
      color: t.accentColor.replace("#", ""),
    });
    slide.addText(it.title, {
      x: 4.5,
      y: y + 0.15,
      w: 4.8,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: t.primaryTextColor.replace("#", ""),
    });
    slide.addText(it.text, {
      x: 4.5,
      y: y + 0.45,
      w: 4.8,
      h: 0.4,
      fontSize: 12,
      color: t.secondaryTextColor.replace("#", ""),
    });
  });
}
export const meta = {
  id: "content_timeline_vertical",
  name: "Vertical Timeline",
};
