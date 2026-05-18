export function Preview({ data }) {
  const t = data.theme;
  const stats = data.stats || [];
  return (
    <div
      className="w-full h-full p-14 flex flex-col justify-center"
      style={{ backgroundColor: t.backgroundColor }}
    >
      <h1
        className="text-2xl font-bold mb-10 text-center"
        style={{ color: t.primaryTextColor }}
      >
        {data.title}
      </h1>
      <div className="grid grid-cols-4 gap-8">
        {stats.slice(0, 4).map((s, i) => (
          <div key={i} className="text-center">
            <div
              className="text-5xl font-bold mb-2"
              style={{ color: t.accentColor }}
            >
              {s.value}
            </div>
            <div className="text-sm" style={{ color: t.secondaryTextColor }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const t = data.theme;
  const stats = data.stats || [];
  slide.background = { color: t.backgroundColor.replace("#", "") };
  slide.addText(data.title, {
    x: 0.5,
    y: 0.8,
    w: 9,
    h: 0.7,
    fontSize: 26,
    bold: true,
    align: "center",
    color: t.primaryTextColor.replace("#", ""),
  });

  const w = 2.1,
    start = 0.7;
  stats.slice(0, 4).forEach((s, i) => {
    const x = start + i * (w + 0.2);
    slide.addText(s.value, {
      x,
      y: 2.2,
      w,
      h: 0.8,
      fontSize: 44,
      bold: true,
      align: "center",
      color: t.accentColor.replace("#", ""),
    });
    slide.addText(s.label, {
      x,
      y: 3.1,
      w,
      h: 0.5,
      fontSize: 14,
      align: "center",
      color: t.secondaryTextColor.replace("#", ""),
    });
  });
}
export const meta = { id: "content_stats_metrics", name: "Stats Metrics" };
