// /src/lib/templates/hero/diagonal.js

export function Preview({ data }) {
  const theme = data.theme;

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Left solid panel - 45% width */}
      <div
        className="absolute top-0 left-0 h-full"
        style={{
          width: "45%",
          backgroundColor: theme.surfaceColor,
        }}
      />

      {/* Diagonal wedge - 15% width, creates 105° angle */}
      <div
        className="absolute top-0 h-full"
        style={{
          left: "45%",
          width: "15%",
          backgroundColor: theme.surfaceColor,
          clipPath: "polygon(0 0, 0 100%, 100% 100%)",
        }}
      />

      {/* Content layer */}
      <div className="relative z-10 w-full h-full">
        {/* Title */}
        <div
          className="absolute"
          style={{
            left: "6.7%", // 0.67" / 10"
            top: "32.9%", // 1.85" / 5.625"
            width: "60%", // 6.0" / 10"
            height: "24.9%", // 1.4" / 5.625"
          }}
        >
          <h1
            className="w-full h-full font-bold leading-tight overflow-hidden"
            style={{
              color: theme.primaryTextColor,
              fontFamily: theme.fontFamily || "Inter, system-ui, sans-serif",
              fontSize: "54px", // Responsive 24-36px
              lineHeight: "1.1",
              display: "flex",
              alignItems: "center",
            }}
          >
            {data.title}
          </h1>
        </div>

        {/* Subtitle */}
        {data.subtitle && (
          <div
            className="absolute"
            style={{
              left: "6.7%", // 0.67"
              top: "59.6%", // 3.35" / 5.625"
              width: "53%", // 5.3" / 10"
              height: "13.3%", // 0.75" / 5.625"
            }}
          >
            <p
              className="w-full h-full overflow-hidden"
              style={{
                color: theme.secondaryTextColor,
                fontFamily: theme.fontFamily || "Inter, system-ui, sans-serif",
                fontSize: "28px", // 14-15px
                lineHeight: "1.4",
              }}
            >
              {data.subtitle}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const theme = data.theme;
  const SLIDE_W = 10;
  const SLIDE_H = 5.625;

  // 1. Background
  slide.background = {
    color: theme.backgroundColor.replace("#", ""),
  };

  // 2. Diagonal surface - matches Preview exactly
  // Left rectangle: 0-45%
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 4.5, // 45%
    h: SLIDE_H,
    fill: { color: theme.surfaceColor.replace("#", "") },
    line: { type: "none" },
  });

  // Right triangle: 45%-60% (creates 105° diagonal)
  slide.addShape("rtTriangle", {
    x: 4.5,
    y: 0,
    w: 1.5, // 15%
    h: SLIDE_H,
    fill: { color: theme.surfaceColor.replace("#", "") },
    line: { type: "none" },
    // No flip - default orientation matches clip-path
  });

  // 3. Title - pixel-perfect to Preview
  slide.addText(data.title || "", {
    x: 0.57, // 6.7%
    y: 1.85, // 32.9%
    w: 6.0, // 60%
    h: 1.4, // 24.9%
    fontSize: 32,
    bold: true,
    color: theme.primaryTextColor.replace("#", ""),
    fontFace: theme.fontFamily || "Calibri",
    align: "left",
    valign: "middle",
    fit: "shrink",
    wrap: true,
    lineSpacingMultiple: 1.1,
  });

  // 4. Subtitle
  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 0.67, // 6.7%
      y: 3.35, // 59.6%
      w: 5.3, // 53%
      h: 0.75, // 13.3%
      fontSize: 15,
      color: theme.secondaryTextColor.replace("#", ""),
      fontFace: theme.fontFamily || "Calibri",
      align: "left",
      valign: "top",
      fit: "shrink",
      wrap: true,
      lineSpacingMultiple: 1.4,
    });
  }
}

export const meta = {
  id: "hero_diagonal",
  name: "Diagonal",
  description: "Modern diagonal split layout - 105° angle",
  category: "hero",
  supports: ["title", "subtitle"],
};
