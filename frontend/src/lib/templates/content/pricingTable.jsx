export function Preview({ data }) {
  const t = data.theme;
  const plans = data.plans || [];
  return (
    <div
      className="w-full h-full p-10 flex flex-col"
      style={{ backgroundColor: t.backgroundColor }}
    >
      <h1
        className="text-2xl font-bold mb-8 text-center"
        style={{ color: t.primaryTextColor }}
      >
        {data.title}
      </h1>
      <div className="grid grid-cols-3 gap-4 flex-1">
        {plans.slice(0, 3).map((p, i) => (
          <div
            key={i}
            className="rounded-xl p-6 flex flex-col"
            style={{
              backgroundColor: t.surfaceColor,
              border: i === 1 ? `2px solid ${t.accentColor}` : "none",
            }}
          >
            <h3
              className="font-bold text-lg mb-2"
              style={{ color: t.primaryTextColor }}
            >
              {p.name}
            </h3>
            <div
              className="text-3xl font-bold mb-4"
              style={{ color: t.accentColor }}
            >
              {p.price}
            </div>
            <div className="space-y-2 flex-1">
              {(p.features || []).map((f, j) => (
                <p
                  key={j}
                  className="text-sm"
                  style={{ color: t.secondaryTextColor }}
                >
                  • {f}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export async function toPptx(slide, pptx, data) {
  const t = data.theme;
  const plans = data.plans || [];
  slide.background = { color: t.backgroundColor.replace("#", "") };
  slide.addText(data.title, {
    x: 0.5,
    y: 0.4,
    w: 9,
    h: 0.6,
    fontSize: 24,
    bold: true,
    align: "center",
    color: t.primaryTextColor.replace("#", ""),
  });
  const w = 2.85,
    start = 0.5,
    gap = 0.225;
  plans.slice(0, 3).forEach((p, i) => {
    const x = start + i * (w + gap);
    slide.addShape("rect", {
      x,
      y: 1.2,
      w,
      h: 3.8,
      fill: { color: t.surfaceColor.replace("#", "") },
      line:
        i === 1
          ? { color: t.accentColor.replace("#", ""), width: 2 }
          : { type: "none" },
    });
    slide.addText(p.name, {
      x,
      y: 1.4,
      w,
      h: 0.4,
      fontSize: 16,
      bold: true,
      align: "center",
      color: t.primaryTextColor.replace("#", ""),
    });
    slide.addText(p.price, {
      x,
      y: 1.9,
      w,
      h: 0.6,
      fontSize: 28,
      bold: true,
      align: "center",
      color: t.accentColor.replace("#", ""),
    });
    (p.features || []).slice(0, 4).forEach((f, j) => {
      slide.addText("• " + f, {
        x: x + 0.2,
        y: 2.7 + j * 0.4,
        w: w - 0.4,
        h: 0.3,
        fontSize: 11,
        color: t.secondaryTextColor.replace("#", ""),
      });
    });
  });
}
export const meta = { id: "content_pricing_table", name: "Pricing Table" };
