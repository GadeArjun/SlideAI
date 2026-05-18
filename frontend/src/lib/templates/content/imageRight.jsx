export function Preview({ data }) {
  const t = data.theme;
  return (
    <div
      className="w-full h-full flex"
      style={{ backgroundColor: t.backgroundColor }}
    >
      <div className="w-[58%] p-16 flex flex-col justify-center">
        <h1
          className="text-3xl font-bold mb-4"
          style={{ color: t.primaryTextColor }}
        >
          {data.title}
        </h1>
        <p
          className="text-lg leading-relaxed"
          style={{ color: t.secondaryTextColor }}
        >
          {data.content}
        </p>
      </div>
      <div
        className="w-[42%] h-full flex items-center justify-center p-12"
        style={{ backgroundColor: t.surfaceColor }}
      >
        <div
          className="w-full aspect-[4/3] rounded-xl"
          style={{
            backgroundColor: t.accentColor + "30",
            border: `2px solid ${t.accentColor}40`,
          }}
        />
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const t = data.theme;
  slide.background = { color: t.backgroundColor.replace("#", "") };
  slide.addShape("rect", {
    x: 5.8,
    y: 0,
    w: 4.2,
    h: 5.625,
    fill: { color: t.surfaceColor.replace("#", "") },
  });
  slide.addShape("rect", {
    x: 6.3,
    y: 1.2,
    w: 3.2,
    h: 2.4,
    fill: { color: t.accentColor.replace("#", ""), transparency: 85 },
    line: { color: t.accentColor.replace("#", ""), width: 1 },
  });
  slide.addText(data.title, {
    x: 0.6,
    y: 1.5,
    w: 5,
    h: 0.8,
    fontSize: 24,
    bold: true,
    color: t.primaryTextColor.replace("#", ""),
  });
  slide.addText(data.content, {
    x: 0.6,
    y: 2.4,
    w: 5,
    h: 2.5,
    fontSize: 15,
    color: t.secondaryTextColor.replace("#", ""),
    wrap: true,
  });
}

export const meta = {
  id: "content_image_right",
  name: "Image Right",
  category: "content",
  supports: ["title", "content", "image"],
};
