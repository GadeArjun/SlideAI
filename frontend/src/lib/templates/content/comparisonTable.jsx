export function Preview({ data }) {
  const t = data.theme;
  const rows = data.rows || [];
  return (
    <div
      className="w-full h-full p-12"
      style={{ backgroundColor: t.backgroundColor }}
    >
      <h1
        className="text-2xl font-bold mb-6"
        style={{ color: t.primaryTextColor }}
      >
        {data.title}
      </h1>
      <div
        className="border rounded-xl overflow-hidden"
        style={{ borderColor: t.surfaceColor }}
      >
        <div
          className="grid grid-cols-3"
          style={{ backgroundColor: t.surfaceColor }}
        >
          {data.headers?.map((h, i) => (
            <div
              key={i}
              className="p-3 font-bold text-sm"
              style={{ color: t.primaryTextColor }}
            >
              {h}
            </div>
          ))}
        </div>
        {rows.map((r, i) => (
          <div
            key={i}
            className="grid grid-cols-3 border-t"
            style={{ borderColor: t.surfaceColor }}
          >
            {r.map((cell, j) => (
              <div
                key={j}
                className="p-3 text-sm"
                style={{ color: t.secondaryTextColor }}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const t = data.theme;
  slide.background = { color: t.backgroundColor.replace("#", "") };
  slide.addText(data.title, {
    x: 0.5,
    y: 0.4,
    w: 9,
    h: 0.6,
    fontSize: 24,
    bold: true,
    color: t.primaryTextColor.replace("#", ""),
  });

  const tableData = [data.headers || [], ...(data.rows || [])];
  slide.addTable(tableData, {
    x: 0.5,
    y: 1.2,
    w: 9,
    h: 3.8,
    colW: [3, 3, 3],
    border: { type: "solid", color: t.surfaceColor.replace("#", ""), pt: 1 },
    fill: { color: t.surfaceColor.replace("#", "") },
    fontSize: 12,
    color: t.secondaryTextColor.replace("#", ""),
  });
}
export const meta = {
  id: "content_comparison_table",
  name: "Comparison Table",
};
