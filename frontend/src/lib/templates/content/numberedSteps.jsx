export function Preview({ data }) {
  const t = data.theme;
  const steps = data.steps || [];
  return (
    <div
      className="w-full h-full p-12 flex flex-col"
      style={{ backgroundColor: t.backgroundColor }}
    >
      <h1
        className="text-3xl font-bold mb-10 text-center"
        style={{ color: t.primaryTextColor }}
      >
        {data.title}
      </h1>
      <div className="flex justify-between items-start px-8">
        {steps.slice(0, 4).map((s, i) => (
          <div key={i} className="flex flex-col items-center text-center w-1/4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4"
              style={{
                backgroundColor: t.accentColor,
                color: t.backgroundColor,
              }}
            >
              {i + 1}
            </div>
            <h3
              className="font-bold mb-2"
              style={{ color: t.primaryTextColor }}
            >
              {s.title}
            </h3>
            <p className="text-sm" style={{ color: t.secondaryTextColor }}>
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const t = data.theme;
  const steps = data.steps || [];
  slide.background = { color: t.backgroundColor.replace("#", "") };
  slide.addText(data.title, {
    x: 0.5,
    y: 0.6,
    w: 9,
    h: 0.7,
    fontSize: 26,
    bold: true,
    align: "center",
    color: t.primaryTextColor.replace("#", ""),
  });

  const w = 2.1,
    gap = 0.2,
    start = 0.7;
  steps.slice(0, 4).forEach((s, i) => {
    const x = start + i * (w + gap);
    slide.addShape("ellipse", {
      x: x + 0.65,
      y: 1.8,
      w: 0.8,
      h: 0.8,
      fill: { color: t.accentColor.replace("#", "") },
    });
    slide.addText(String(i + 1), {
      x: x + 0.65,
      y: 1.8,
      w: 0.8,
      h: 0.8,
      fontSize: 20,
      bold: true,
      align: "center",
      valign: "middle",
      color: "FFFFFF",
    });
    slide.addText(s.title, {
      x,
      y: 2.8,
      w,
      h: 0.4,
      fontSize: 16,
      bold: true,
      align: "center",
      color: t.primaryTextColor.replace("#", ""),
    });
    slide.addText(s.desc, {
      x,
      y: 3.3,
      w,
      h: 1,
      fontSize: 13,
      align: "center",
      color: t.secondaryTextColor.replace("#", ""),
      wrap: true,
    });
  });
}
export const meta = {
  id: "content_numbered_steps",
  name: "Numbered Steps",
  category: "content",
};
