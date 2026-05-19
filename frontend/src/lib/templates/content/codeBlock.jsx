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

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{
        backgroundColor: t.backgroundColor,
        fontFamily: t.fontFamily,
        padding: "40px",
      }}
    >
      <h1
        style={{
          color: t.primaryTextColor,
          fontSize: "28px",
          lineHeight: 1.15,
          fontWeight: 700,
          margin: 0,
          marginBottom: "20px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {data.title || "Code Block"}
      </h1>

      <div
        style={{
          flex: 1,
          backgroundColor: "#0B1220",
          borderRadius: "22px",
          overflow: "hidden",
          border: `1px solid ${t.accentColor}25`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: "52px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 22px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "999px",
                backgroundColor: "#EF4444",
              }}
            />

            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "999px",
                backgroundColor: "#F59E0B",
              }}
            />

            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "999px",
                backgroundColor: "#10B981",
              }}
            />
          </div>

          <div
            style={{
              color: t.secondaryTextColor,
              fontSize: "13px",
              fontFamily: "monospace",
              opacity: 0.9,
            }}
          >
            {data.language || "code"}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflow: "hidden",
            padding: "24px",
          }}
        >
          <pre
            style={{
              margin: 0,
              color: "#E2E8F0",
              fontSize: "16px",
              lineHeight: 1.6,
              fontFamily:
                "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {data.code || ""}
          </pre>
        </div>
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const t = getTheme(data.theme);

  slide.background = {
    color: cleanColor(t.backgroundColor),
  };

  slide.addText(data.title || "Code Block", {
    x: 0.5,
    y: 0.42,
    w: 8.8,
    h: 0.45,

    fontFace: t.fontFamily,
    fontSize: 22,
    bold: true,

    color: cleanColor(t.primaryTextColor),

    margin: 0,
    fit: "shrink",
    breakLine: false,
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 1.02,
    w: 8.9,
    h: 3.95,

    rectRadius: 0.06,

    line: {
      color: cleanColor(t.accentColor),
      transparency: 82,
      width: 1,
    },

    fill: {
      color: "0B1220",
    },
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 1.02,
    w: 8.9,
    h: 0.45,

    line: {
      transparency: 100,
    },

    fill: {
      color: "111827",
    },
  });

  const dots = [
    { x: 0.72, color: "EF4444" },
    { x: 0.88, color: "F59E0B" },
    { x: 1.04, color: "10B981" },
  ];

  dots.forEach((dot) => {
    slide.addShape(pptx.ShapeType.ellipse, {
      x: dot.x,
      y: 1.16,
      w: 0.08,
      h: 0.08,

      line: {
        transparency: 100,
      },

      fill: {
        color: dot.color,
      },
    });
  });

  slide.addText(data.language || "code", {
    x: 7.7,
    y: 1.1,
    w: 1.1,
    h: 0.16,

    fontFace: "Courier New",
    fontSize: 10,

    color: cleanColor(t.secondaryTextColor),

    align: "right",

    margin: 0,
  });

  slide.addText(data.code || "", {
    x: 0.76,
    y: 1.62,
    w: 8.2,
    h: 2.95,

    fontFace: "Courier New",
    fontSize: 11,

    color: "E2E8F0",

    margin: 0,

    valign: "top",

    fit: "shrink",

    breakLine: false,
  });
}

export const meta = {
  id: "content_code_block",

  name: "Code Block",

  description:
    "Developer focused code presentation slide with terminal styling.",

  category: "content",

  supports: ["title", "code", "language"],
};
