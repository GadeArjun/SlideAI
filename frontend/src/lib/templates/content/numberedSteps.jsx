const DEFAULT_THEME = {
  backgroundColor: "#0F172A",
  surfaceColor: "#111827",
  primaryTextColor: "#F8FAFC",
  secondaryTextColor: "#CBD5E1",
  accentColor: "#3B82F6",
  fontFamily: "Inter",
};

function getTheme(theme = {}) {
  return {
    ...DEFAULT_THEME,
    ...theme,
  };
}

function cleanColor(color = "#000000") {
  return color.replace("#", "");
}

export function Preview({ data }) {
  const t = getTheme(data.theme);

  const steps = Array.isArray(data.steps) ? data.steps.slice(0, 4) : [];

  return (
    <div
      className="w-full h-full overflow-hidden"
      style={{
        backgroundColor: t.backgroundColor,
        fontFamily: t.fontFamily,
        padding: "44px 48px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          color: t.primaryTextColor,
          fontSize: "36px",
          lineHeight: 1.12,
          fontWeight: 700,
          margin: 0,
          marginBottom: "44px",
          textAlign: "center",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          flexShrink: 0,
        }}
      >
        {data.title || "Numbered Steps"}
      </h1>

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "18px",
          minHeight: 0,
          alignItems: "start",
        }}
      >
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "68px",
                height: "68px",
                borderRadius: "999px",
                backgroundColor: t.accentColor,
                color: t.backgroundColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: 700,
                marginBottom: "18px",
                flexShrink: 0,
                boxShadow: `0 0 0 8px ${t.accentColor}20`,
              }}
            >
              {i + 1}
            </div>

            <h3
              style={{
                color: t.primaryTextColor,
                fontSize: "20px",
                lineHeight: 1.3,
                fontWeight: 700,
                margin: 0,
                marginBottom: "12px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                width: "100%",
                flexShrink: 0,
              }}
            >
              {step.title || ""}
            </h3>

            <p
              style={{
                color: t.secondaryTextColor,
                fontSize: "15px",
                lineHeight: 1.65,
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                width: "100%",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 6,
                WebkitBoxOrient: "vertical",
              }}
            >
              {step.desc || ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const t = getTheme(data.theme);

  const steps = Array.isArray(data.steps) ? data.steps.slice(0, 4) : [];

  slide.background = {
    color: cleanColor(t.backgroundColor),
  };

  slide.addText(data.title || "Numbered Steps", {
    x: 0.5,
    y: 0.48,
    w: 8.9,
    h: 0.55,

    fontFace: t.fontFamily,
    fontSize: 28,
    bold: true,

    color: cleanColor(t.primaryTextColor),

    align: "center",

    margin: 0,

    fit: "shrink",

    breakLine: false,
  });

  const cardW = 2.02;

  const positions = [0.55, 2.75, 4.95, 7.15];

  steps.forEach((step, i) => {
    const x = positions[i];

    slide.addShape(pptx.ShapeType.ellipse, {
      x: x + 0.63,
      y: 1.55,
      w: 0.76,
      h: 0.76,

      line: {
        transparency: 100,
      },

      fill: {
        color: cleanColor(t.accentColor),
      },

      shadow: {
        type: "outer",
        color: cleanColor(t.accentColor),
        blur: 1,
        angle: 45,
        distance: 1,
        opacity: 0.18,
      },
    });

    slide.addText(String(i + 1), {
      x: x + 0.63,
      y: 1.56,
      w: 0.76,
      h: 0.76,

      fontFace: t.fontFamily,
      fontSize: 20,
      bold: true,

      color: cleanColor(t.backgroundColor),

      align: "center",
      valign: "mid",

      margin: 0,
    });

    slide.addText(step.title || "", {
      x,
      y: 2.52,
      w: cardW,
      h: 0.34,

      fontFace: t.fontFamily,
      fontSize: 15,
      bold: true,

      color: cleanColor(t.primaryTextColor),

      align: "center",

      margin: 0,

      fit: "shrink",

      breakLine: false,
    });

    slide.addText(step.desc || "", {
      x: x + 0.02,
      y: 2.96,
      w: cardW - 0.04,
      h: 0.95,

      fontFace: t.fontFamily,
      fontSize: 11.5,

      color: cleanColor(t.secondaryTextColor),

      align: "center",

      valign: "top",

      margin: 0,

      fit: "shrink",

      breakLine: false,
    });
  });
}

export const meta = {
  id: "content_numbered_steps",

  name: "Numbered Steps",

  description:
    "Horizontal numbered process layout for workflows, timelines and step-by-step explanations.",

  category: "content",

  supports: ["title", "steps"],
};
