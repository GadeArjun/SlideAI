export function Preview({ data }) {
  const theme = data.theme;

  return (
    <div
      className="w-full h-full flex"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Left - 60% */}
      <div className="w-[60%] p-16 flex flex-col justify-center">
        <h1
          className="text-4xl font-bold mb-4 leading-tight"
          style={{ color: theme.primaryTextColor }}
        >
          {data.title}
        </h1>
        <p
          className="text-lg leading-relaxed"
          style={{ color: theme.secondaryTextColor }}
        >
          {data.content}
        </p>
      </div>

      {/* Right - 40% */}
      <div
        className="w-[40%] flex items-center justify-center"
        style={{ backgroundColor: theme.surfaceColor }}
      >
        <div
          className="w-32 h-32 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: theme.accentColor + "20" }}
        >
          <div
            className="w-16 h-16 rounded-xl"
            style={{ backgroundColor: theme.accentColor }}
          />
        </div>
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const theme = data.theme;

  slide.background = { color: theme.backgroundColor.replace("#", "") };

  // Right panel
  slide.addShape("rect", {
    x: 6,
    y: 0,
    w: 4,
    h: 5.625,
    fill: { color: theme.surfaceColor.replace("#", "") },
    line: { type: "none" },
  });

  // Left content
  slide.addText(data.title || "", {
    x: 0.6,
    y: 1.5,
    w: 5,
    h: 1,
    fontSize: 28,
    bold: true,
    color: theme.primaryTextColor.replace("#", ""),
    fontFace: theme.fontFamily || "Calibri",
  });

  slide.addText(data.content || "", {
    x: 0.6,
    y: 2.6,
    w: 5,
    h: 2,
    fontSize: 16,
    color: theme.secondaryTextColor.replace("#", ""),
    valign: "top",
  });

  // Right accent box
  slide.addShape("roundRect", {
    x: 7.2,
    y: 2.1,
    w: 1.6,
    h: 1.6,
    fill: { color: theme.accentColor.replace("#", ""), transparency: 85 },
    line: { type: "none" },
  });
}

export const meta = {
  id: "content_two_column",
  name: "Two Column",
  category: "content",
};
