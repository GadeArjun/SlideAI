export function Preview({ data }) {
  const t = data.theme;
  const items = data.items || [];
  return (
    <div
      className="w-full h-full p-12 flex flex-col justify-center"
      style={{ backgroundColor: t.backgroundColor }}
    >
      <h1
        className="text-2xl font-bold mb-12"
        style={{ color: t.primaryTextColor }}
      >
        {data.title}
      </h1>
      <div className="relative">
        <div
          className="absolute top-5 left-0 right-0 h-0.5"
          style={{ backgroundColor: t.accentColor }}
        />
        <div className="flex justify-between relative">
          {items.slice(0, 5).map((it, i) => (
            <div key={i} className="flex flex-col items-center w-1/5">
              <div
                className="w-10 h-10 rounded-full border-4 mb-3"
                style={{
                  backgroundColor: t.backgroundColor,
                  borderColor: t.accentColor,
                }}
              />
              <p className="text-xs font-bold" style={{ color: t.accentColor }}>
                {it.title}
              </p>
              <p
                className="text-sm text-center mt-1"
                style={{ color: t.secondaryTextColor }}
              >
                {it.desc}
              </p>
            </div>
          ))}
        </div>
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
    y: 0.5,
    w: 9,
    h: 0.6,
    fontSize: 24,
    bold: true,
    color: t.primaryTextColor.replace("#", ""),
  });
  slide.addShape("line", {
    x: 0.8,
    y: 2.8,
    w: 8.4,
    h: 0,
    line: { color: t.accentColor.replace("#", ""), width: 3 },
  });

  const step = 8.4 / Math.max(items.length - 1, 1);
  items.slice(0, 5).forEach((it, i) => {
    const x = 0.8 + i * step;
    slide.addShape("ellipse", {
      x: x - 0.15,
      y: 2.65,
      w: 0.3,
      h: 0.3,
      fill: { color: t.backgroundColor.replace("#", "") },
      line: { color: t.accentColor.replace("#", ""), width: 2 },
    });
    slide.addText(it.title, {
      x: x - 0.6,
      y: 2.2,
      w: 1.2,
      h: 0.3,
      fontSize: 12,
      bold: true,
      align: "center",
      color: t.accentColor.replace("#", ""),
    });
    slide.addText(it.desc, {
      x: x - 0.8,
      y: 3.1,
      w: 1.6,
      h: 0.8,
      fontSize: 11,
      align: "center",
      color: t.secondaryTextColor.replace("#", ""),
      wrap: true,
    });
  });
}
export const meta = {
  id: "content_timeline_horizontal",
  name: "Timeline",
  category: "content",
};
