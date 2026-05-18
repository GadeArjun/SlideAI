export function Preview({ data }) {
  const t = data.theme;
  return (
    <div
      className="w-full h-full p-12 flex gap-6"
      style={{ backgroundColor: t.backgroundColor }}
    >
      {/* Pros Column */}
      <div className="flex-1">
        <h2
          className="text-xl font-bold mb-4 flex items-center gap-2"
          style={{ color: "#10B981" }}
        >
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
            ✓
          </div>
          Pros
        </h2>
        <div className="space-y-2">
          {(data.pros || []).map((p, i) => (
            <div
              key={i}
              className="p-3 rounded-lg"
              style={{
                backgroundColor: t.surfaceColor,
                color: t.secondaryTextColor,
              }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* Cons Column */}
      <div className="flex-1">
        <h2
          className="text-xl font-bold mb-4 flex items-center gap-2"
          style={{ color: "#EF4444" }}
        >
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
            ✕
          </div>
          Cons
        </h2>
        <div className="space-y-2">
          {(data.cons || []).map((c, i) => (
            <div
              key={i}
              className="p-3 rounded-lg"
              style={{
                backgroundColor: t.surfaceColor,
                color: t.secondaryTextColor,
              }}
            >
              {c}
            </div>
          ))}
        </div>
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
    align: "center",
    color: t.primaryTextColor.replace("#", ""),
  });

  // Pros
  slide.addText("PROS", {
    x: 0.6,
    y: 1.2,
    w: 4,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: "10B981",
  });
  (data.pros || []).slice(0, 4).forEach((p, i) => {
    slide.addText("• " + p, {
      x: 0.6,
      y: 1.7 + i * 0.6,
      w: 4,
      h: 0.5,
      fontSize: 14,
      color: t.secondaryTextColor.replace("#", ""),
    });
  });

  // Cons
  slide.addText("CONS", {
    x: 5.4,
    y: 1.2,
    w: 4,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: "EF4444",
  });
  (data.cons || []).slice(0, 4).forEach((c, i) => {
    slide.addText("• " + c, {
      x: 5.4,
      y: 1.7 + i * 0.6,
      w: 4,
      h: 0.5,
      fontSize: 14,
      color: t.secondaryTextColor.replace("#", ""),
    });
  });
}
export const meta = { id: "content_pros_cons", name: "Pros & Cons" };
