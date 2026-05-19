import React from "react";
export function Preview({ data }) {
  const t = data.theme;
  const steps = data.steps || [];
  return (
    <div
      className="w-full h-full p-12 flex flex-col justify-center"
      style={{ backgroundColor: t.backgroundColor }}
    >
      <h1
        className="text-2xl font-bold mb-10 text-center"
        style={{ color: t.primaryTextColor }}
      >
        {data.title}
      </h1>
      <div className="flex items-center justify-center gap-4">
        {steps.slice(0, 4).map((s, i) => (
          <React.Fragment key={i}>
            <div
              className="w-32 h-24 rounded-xl flex flex-col items-center justify-center p-3"
              style={{
                backgroundColor: t.surfaceColor,
                border: `2px solid ${t.accentColor}`,
              }}
            >
              <p
                className="font-bold text-sm text-center"
                style={{ color: t.primaryTextColor }}
              >
                {s}
              </p>
            </div>
            {i < steps.length - 1 && (
              <div className="text-2xl" style={{ color: t.accentColor }}>
                →
              </div>
            )}
          </React.Fragment>
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
    fontSize: 24,
    bold: true,
    align: "center",
    color: t.primaryTextColor.replace("#", ""),
  });
  const w = 1.8,
    gap = 0.5,
    start = 1.0;
  steps.slice(0, 4).forEach((s, i) => {
    const x = start + i * (w + gap);
    slide.addShape("rect", {
      x,
      y: 2.2,
      w,
      h: 1.2,
      fill: { color: t.surfaceColor.replace("#", "") },
      line: { color: t.accentColor.replace("#", ""), width: 2 },
    });
    slide.addText(s, {
      x,
      y: 2.2,
      w,
      h: 1.2,
      fontSize: 13,
      align: "center",
      valign: "middle",
      color: t.primaryTextColor.replace("#", ""),
      wrap: true,
    });
    if (i < 3)
      slide.addText("→", {
        x: x + w + 0.15,
        y: 2.6,
        w: 0.2,
        h: 0.4,
        fontSize: 24,
        color: t.accentColor.replace("#", ""),
      });
  });
}
export const meta = { id: "content_process_flow", name: "Process Flow" };
