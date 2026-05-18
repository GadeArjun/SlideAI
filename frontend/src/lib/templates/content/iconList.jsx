export function Preview({ data }) {
  const t = data.theme;
  const items = data.items || [];
  return (
    <div
      className="w-full h-full p-14 flex flex-col"
      style={{ backgroundColor: t.backgroundColor }}
    >
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: t.primaryTextColor }}
      >
        {data.title}
      </h1>
      <div className="space-y-5">
        {items.slice(0, 5).map((it, i) => (
          <div key={i} className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: t.accentColor }}
            >
              <span className="text-white font-bold">{i + 1}</span>
            </div>
            <p
              className="text-lg pt-1.5"
              style={{ color: t.secondaryTextColor }}
            >
              {it.text || it}
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
    x: 0.6,
    y: 0.6,
    w: 8.8,
    h: 0.8,
    fontSize: 28,
    bold: true,
    color: t.primaryTextColor.replace("#", ""),
  });

  items.slice(0, 5).forEach((it, i) => {
    const y = 1.7 + i * 0.75;
    slide.addShape("rect", {
      x: 0.6,
      y,
      w: 0.5,
      h: 0.5,
      fill: { color: t.accentColor.replace("#", "") },
    });
    slide.addText(String(i + 1), {
      x: 0.6,
      y,
      w: 0.5,
      h: 0.5,
      fontSize: 14,
      bold: true,
      align: "center",
      valign: "middle",
      color: "FFFFFF",
    });
    slide.addText(it.text || it, {
      x: 1.3,
      y,
      w: 8.1,
      h: 0.5,
      fontSize: 16,
      color: t.secondaryTextColor.replace("#", ""),
      valign: "middle",
    });
  });
}
export const meta = {
  id: "content_icon_list",
  name: "Icon List",
  category: "content",
};
