export function Preview({ data }) {
  const t = data.theme;
  const imageUrl =
    data.image ||
    data.imageUrl ||
    `https://picsum.photos/seed/${encodeURIComponent(
      data.title || "ai"
    )}/800/600`;

  return (
    <div
      className="w-full h-full flex"
      style={{ backgroundColor: t.backgroundColor }}
    >
      <div
        className="w-[42%] h-full flex items-center justify-center p-8"
        style={{ backgroundColor: t.surfaceColor }}
      >
        <div className="w-full h-full max-h- rounded-xl overflow-hidden shadow-xl">
          <img
            src={imageUrl}
            alt={data.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `https://picsum.photos/800/600?random=${Math.floor(
                Math.random() * 100
              )}`;
            }}
          />
        </div>
      </div>
      <div className="w-[58%] p-14 flex flex-col justify-center">
        <h1
          className="text-3xl font-bold mb-4"
          style={{ color: t.primaryTextColor, fontFamily: t.fontFamily }}
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
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const t = data.theme;
  const imageUrl =
    data.image ||
    data.imageUrl ||
    `https://picsum.photos/seed/${encodeURIComponent(
      data.title || "ai"
    )}/800/600`;

  slide.background = { color: t.backgroundColor.replace("#", "") };

  // Left panel background
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 4.2,
    h: 5.625,
    fill: { color: t.surfaceColor.replace("#", "") },
  });

  // Try to add image, fallback to colored box
  try {
    slide.addImage({
      path: imageUrl,
      x: 0.5,
      y: 1.0,
      w: 3.2,
      h: 2.4,
      sizing: { type: "cover", w: 3.2, h: 2.4 },
    });
  } catch (e) {
    // Fallback box
    slide.addShape("rect", {
      x: 0.5,
      y: 1.0,
      w: 3.2,
      h: 2.4,
      fill: { color: t.accentColor.replace("#", ""), transparency: 85 },
      line: { color: t.accentColor.replace("#", ""), width: 1 },
    });
  }

  // Image border
  slide.addShape("rect", {
    x: 0.5,
    y: 1.0,
    w: 3.2,
    h: 2.4,
    fill: { transparency: 100 },
    line: { color: t.accentColor.replace("#", ""), width: 1.5 },
  });

  slide.addText(data.title || "", {
    x: 4.6,
    y: 1.5,
    w: 5,
    h: 0.8,
    fontSize: 26,
    bold: true,
    color: t.primaryTextColor.replace("#", ""),
    fontFace: t.fontFamily || "Calibri",
  });

  slide.addText(data.content || "", {
    x: 4.6,
    y: 2.4,
    w: 5,
    h: 2.5,
    fontSize: 16,
    color: t.secondaryTextColor.replace("#", ""),
    wrap: true,
    valign: "top",
    fontFace: t.fontFamily || "Calibri",
    lineSpacing: 20,
  });
}

export const meta = {
  id: "content_image_left",
  name: "Image Left",
  category: "content",
  supports: ["title", "content", "image"],
};
