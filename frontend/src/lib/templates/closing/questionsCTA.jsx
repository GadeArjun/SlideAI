export function Preview({ data }) {
  const t = data.theme;
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center text-center p-12"
      style={{ backgroundColor: t.surfaceColor }}
    >
      <div className="text-7xl mb-6">💬</div>
      <h1
        className="text-5xl font-bold mb-4"
        style={{ color: t.primaryTextColor }}
      >
        Questions?
      </h1>
      <p className="text-xl mb-8" style={{ color: t.secondaryTextColor }}>
        Let's build something amazing together
      </p>
      <div
        className="px-8 py-3 rounded-full font-semibold"
        style={{ backgroundColor: t.accentColor, color: "#fff" }}
      >
        Get Started
      </div>
    </div>
  );
}
export async function toPptx(slide, pptx, data) {
  const t = data.theme;
  slide.background = { color: t.surfaceColor.replace("#", "") };
  slide.addText("💬", {
    x: 4.5,
    y: 1.2,
    w: 1,
    h: 1,
    fontSize: 60,
    align: "center",
  });
  slide.addText("Questions?", {
    x: 2,
    y: 2.2,
    w: 6,
    h: 0.8,
    fontSize: 40,
    bold: true,
    align: "center",
    color: t.primaryTextColor.replace("#", ""),
  });
  slide.addText("Let's build something amazing together", {
    x: 2,
    y: 3.0,
    w: 6,
    h: 0.5,
    fontSize: 16,
    align: "center",
    color: t.secondaryTextColor.replace("#", ""),
  });
}
