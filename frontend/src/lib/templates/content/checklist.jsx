export function Preview({ data }) {
  const t = data.theme;
  const items = data.items || [];
  return (
    <div
      className="w-full h-full p-14 flex"
      style={{ backgroundColor: t.backgroundColor }}
    >
      <div className="w-1/2 pr-10">
        <h1
          className="text-3xl font-bold mb-6"
          style={{ color: t.primaryTextColor }}
        >
          {data.title}
        </h1>
        <p style={{ color: t.secondaryTextColor }}>{data.subtitle}</p>
      </div>
      <div className="w-1/2 space-y-4">
        {items.slice(0, 6).map((it, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ backgroundColor: t.accentColor }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <span style={{ color: t.primaryTextColor }}>{it}</span>
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
    x: 0.6,
    y: 1.2,
    w: 4,
    h: 0.8,
    fontSize: 28,
    bold: true,
    color: t.primaryTextColor.replace("#", ""),
  });
  slide.addText(data.subtitle || "", {
    x: 0.6,
    y: 2.1,
    w: 4,
    h: 1,
    fontSize: 14,
    color: t.secondaryTextColor.replace("#", ""),
  });

  items.slice(0, 6).forEach((it, i) => {
    const y = 1.2 + i * 0.65;
    slide.addShape("rect", {
      x: 5.2,
      y,
      w: 0.4,
      h: 0.4,
      fill: { color: t.accentColor.replace("#", "") },
    });
    slide.addText("✓", {
      x: 5.2,
      y,
      w: 0.4,
      h: 0.4,
      fontSize: 14,
      bold: true,
      align: "center",
      valign: "middle",
      color: "FFFFFF",
    });
    slide.addText(it, {
      x: 5.8,
      y,
      w: 3.8,
      h: 0.4,
      fontSize: 15,
      color: t.primaryTextColor.replace("#", ""),
      valign: "middle",
    });
  });
}

export const meta = {
  id: "content_checklist",
  name: "Checklist",
  category: "content",
};
