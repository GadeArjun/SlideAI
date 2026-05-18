export function Preview({ data }) {
  const theme = data.theme;
  const bullets = data.bullets || [];

  return (
    <div
      className="w-full h-full p-16 flex flex-col"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Title */}
      <div className="mb-8">
        <h1
          className="text-4xl font-bold leading-tight"
          style={{
            color: theme.primaryTextColor,
            fontFamily: theme.fontFamily || "Inter, system-ui",
          }}
        >
          {data.title}
        </h1>
        {data.subtitle && (
          <p
            className="text-lg mt-2"
            style={{ color: theme.secondaryTextColor }}
          >
            {data.subtitle}
          </p>
        )}
        <div
          className="w-16 h-1 mt-4"
          style={{ backgroundColor: theme.accentColor }}
        />
      </div>

      {/* Bullets */}
      <div className="flex-1 space-y-4">
        {bullets.map((bullet, i) => (
          <div key={i} className="flex items-start gap-4">
            <div
              className="w-2 h-2 rounded-full mt-2.5 shrink-0"
              style={{ backgroundColor: theme.accentColor }}
            />
            <p
              className="text-xl leading-relaxed"
              style={{ color: theme.primaryTextColor }}
            >
              {bullet}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const theme = data.theme;
  const bullets = data.bullets || [];

  slide.background = { color: theme.backgroundColor.replace("#", "") };

  // Title
  slide.addText(data.title || "", {
    x: 0.6,
    y: 0.5,
    w: 8.8,
    h: 0.8,
    fontSize: 28,
    bold: true,
    color: theme.primaryTextColor.replace("#", ""),
    fontFace: theme.fontFamily || "Calibri",
  });

  // Subtitle
  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 0.6,
      y: 1.2,
      w: 8.8,
      h: 0.4,
      fontSize: 14,
      color: theme.secondaryTextColor.replace("#", ""),
    });
  }

  // Accent bar
  slide.addShape("rect", {
    x: 0.6,
    y: 1.65,
    w: 0.8,
    h: 0.05,
    fill: { color: theme.accentColor.replace("#", "") },
    line: { type: "none" },
  });

  // Bullets
  const bulletTexts = bullets.map((b) => ({
    text: b,
    options: { bullet: true },
  }));

  slide.addText(bulletTexts, {
    x: 0.7,
    y: 2.0,
    w: 8.6,
    h: 3.2,
    fontSize: 18,
    color: theme.primaryTextColor.replace("#", ""),
    bullet: { type: "bullet" },
    valign: "top",
  });
}

export const meta = {
  id: "content_title_bullets",
  name: "Title + Bullets",
  category: "content",
};
