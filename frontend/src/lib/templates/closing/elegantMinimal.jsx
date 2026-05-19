export function Preview({ data }) {
  const t = data.theme;
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center"
      style={{ backgroundColor: "#000" }}
    >
      <div
        className="w-24 h-0.5 mb-8"
        style={{ backgroundColor: t.accentColor }}
      />
      <h1
        className="text-7xl font-light tracking-wider"
        style={{ color: "#fff", fontFamily: "serif" }}
      >
        thank you
      </h1>
      <div
        className="w-24 h-0.5 mt-8"
        style={{ backgroundColor: t.accentColor }}
      />
    </div>
  );
}
export async function toPptx(slide, pptx, data) {
  const t = data.theme;
  slide.background = { color: "000000" };
  slide.addShape("rect", {
    x: 4.1,
    y: 2.4,
    w: 1.8,
    h: 0.02,
    fill: { color: t.accentColor.replace("#", "") },
  });
  slide.addText("thank you", {
    x: 2,
    y: 2.5,
    w: 6,
    h: 1,
    fontSize: 54,
    align: "center",
    color: "FFFFFF",
    fontFace: "Times",
  });
  slide.addShape("rect", {
    x: 4.1,
    y: 3.6,
    w: 1.8,
    h: 0.02,
    fill: { color: t.accentColor.replace("#", "") },
  });
}
