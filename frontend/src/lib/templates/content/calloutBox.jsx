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

function getCalloutColor(type, accentColor) {
  return (
    {
      info: accentColor,
      warning: "#F59E0B",
      success: "#10B981",
      error: "#EF4444",
    }[type] || accentColor
  );
}

export function Preview({ data }) {
  const t = getTheme(data.theme);

  const calloutColor = getCalloutColor(data.type, t.accentColor);

  return (
    <div
      className="w-full h-full flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: t.backgroundColor,
        fontFamily: t.fontFamily,
        padding: "48px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "980px",
          backgroundColor: t.surfaceColor,
          borderLeft: `10px solid ${calloutColor}`,
          borderRadius: "22px",
          padding: "38px 42px",
        }}
      >
        <h2
          style={{
            color: calloutColor,
            fontSize: "28px",
            lineHeight: 1.15,
            fontWeight: 700,
            margin: 0,
            marginBottom: "18px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {data.title || "Callout"}
        </h2>

        <p
          style={{
            color: t.primaryTextColor,
            fontSize: "22px",
            lineHeight: 1.6,
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {data.message || ""}
        </p>
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const t = getTheme(data.theme);

  const calloutColor = getCalloutColor(data.type, t.accentColor);

  slide.background = {
    color: cleanColor(t.backgroundColor),
  };

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 1,
    y: 1.5,
    w: 8,
    h: 2.45,

    rectRadius: 0.06,

    line: {
      transparency: 100,
    },

    fill: {
      color: cleanColor(t.surfaceColor),
    },
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 1,
    y: 1.5,
    w: 0.09,
    h: 2.45,

    line: {
      transparency: 100,
    },

    fill: {
      color: cleanColor(calloutColor),
    },
  });

  slide.addText(data.title || "Callout", {
    x: 1.35,
    y: 1.82,
    w: 6.9,
    h: 0.45,

    fontFace: t.fontFamily,
    fontSize: 22,
    bold: true,

    color: cleanColor(calloutColor),

    margin: 0,
    fit: "shrink",
    breakLine: false,
    valign: "mid",
  });

  slide.addText(data.message || "", {
    x: 1.35,
    y: 2.35,
    w: 6.9,
    h: 0.95,

    fontFace: t.fontFamily,
    fontSize: 18,

    color: cleanColor(t.primaryTextColor),

    margin: 0,
    valign: "top",
    fit: "shrink",
    breakLine: false,
  });
}

export const meta = {
  id: "content_callout_box",

  name: "Callout",

  description:
    "Highlighted callout box for warnings, notes, alerts and key messages.",

  category: "content",

  supports: ["title", "message", "type"],
};
