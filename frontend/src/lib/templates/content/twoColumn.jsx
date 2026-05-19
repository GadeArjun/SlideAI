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
  const theme = getTheme(data.theme);

  return (
    <div
      className="w-full h-full flex overflow-hidden"
      style={{
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily,
      }}
    >
      <div
        style={{
          width: "60%",
          padding: "58px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            color: theme.primaryTextColor,
            fontSize: "38px",
            lineHeight: 1.12,
            fontWeight: 700,
            margin: 0,
            marginBottom: "20px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxWidth: "95%",
          }}
        >
          {data.title || "Untitled Slide"}
        </h1>

        <p
          style={{
            color: theme.secondaryTextColor,
            fontSize: "20px",
            lineHeight: 1.6,
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxWidth: "92%",
          }}
        >
          {data.content || ""}
        </p>
      </div>

      <div
        style={{
          width: "40%",
          backgroundColor: theme.surfaceColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "140px",
            height: "140px",
            borderRadius: "28px",
            backgroundColor: `${theme.accentColor}25`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              backgroundColor: theme.accentColor,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const theme = getTheme(data.theme);

  slide.background = {
    color: cleanColor(theme.backgroundColor),
  };

  slide.addShape(pptx.ShapeType.rect, {
    x: 6,
    y: 0,
    w: 4,
    h: 5.625,

    line: {
      transparency: 100,
    },

    fill: {
      color: cleanColor(theme.surfaceColor),
    },
  });

  slide.addText(data.title || "Untitled Slide", {
    x: 0.62,
    y: 1.48,
    w: 4.9,
    h: 0.8,

    fontFace: theme.fontFamily,
    fontSize: 29,
    bold: true,

    color: cleanColor(theme.primaryTextColor),

    margin: 0,
    breakLine: false,
    fit: "shrink",
    valign: "mid",
  });

  slide.addText(data.content || "", {
    x: 0.64,
    y: 2.28,
    w: 4.75,
    h: 1.9,

    fontFace: theme.fontFamily,
    fontSize: 19,

    color: cleanColor(theme.secondaryTextColor),

    margin: 0,
    breakLine: false,
    fit: "shrink",
    valign: "top",
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 7.08,
    y: 2.02,
    w: 1.82,
    h: 1.82,

    rectRadius: 0.12,

    line: {
      transparency: 100,
    },

    fill: {
      color: cleanColor(theme.accentColor),
      transparency: 82,
    },
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 7.48,
    y: 2.42,
    w: 1.02,
    h: 1.02,

    rectRadius: 0.08,

    line: {
      transparency: 100,
    },

    fill: {
      color: cleanColor(theme.accentColor),
    },
  });
}

export const meta = {
  id: "content_two_column",

  name: "Two Column",

  description:
    "Modern split layout with content on left and visual panel on right.",

  category: "content",

  supports: ["title", "content"],
};
