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
      className="w-full h-full overflow-hidden"
      style={{
        backgroundColor: t.backgroundColor,
        fontFamily: t.fontFamily,
        display: "flex",
      }}
    >
      <div
        style={{
          width: "58%",
          padding: "58px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <h1
          style={{
            color: t.primaryTextColor,
            fontSize: "38px",
            lineHeight: 1.12,
            fontWeight: 700,
            margin: 0,
            marginBottom: "22px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            maxWidth: "92%",
            flexShrink: 0,
          }}
        >
          {data.title || "Image Right"}
        </h1>

        <p
          style={{
            color: t.secondaryTextColor,
            fontSize: "20px",
            lineHeight: 1.65,
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            maxWidth: "94%",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 10,
            WebkitBoxOrient: "vertical",
          }}
        >
          {data.content || ""}
        </p>
      </div>

      <div
        style={{
          width: "42%",
          backgroundColor: t.surfaceColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            aspectRatio: "4/3",
            borderRadius: "22px",
            backgroundColor: `${t.accentColor}30`,
            border: `2px solid ${t.accentColor}40`,
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "18px",
              borderRadius: "16px",
              border: `1px dashed ${t.accentColor}70`,
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
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
                backgroundColor: t.accentColor,
                opacity: 0.9,
              }}
            />
          </div>
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

  slide.addShape(pptx.ShapeType.rect, {
    x: 5.82,
    y: 0,
    w: 4.18,
    h: 5.625,

    line: {
      transparency: 100,
    },

    fill: {
      color: cleanColor(t.surfaceColor),
    },
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.24,
    y: 1.18,
    w: 3.08,
    h: 2.3,

    rectRadius: 0.08,

    line: {
      color: cleanColor(t.accentColor),
      transparency: 68,
      width: 1.5,
    },

    fill: {
      color: cleanColor(t.accentColor),
      transparency: 82,
    },
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.42,
    y: 1.36,
    w: 2.72,
    h: 1.94,

    rectRadius: 0.06,

    line: {
      color: cleanColor(t.accentColor),
      transparency: 35,
      dash: "dash",
      width: 1,
    },

    fill: {
      transparency: 100,
    },
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 7.15,
    y: 1.92,
    w: 0.82,
    h: 0.82,

    rectRadius: 0.06,

    line: {
      transparency: 100,
    },

    fill: {
      color: cleanColor(t.accentColor),
    },
  });

  slide.addText(data.title || "Image Right", {
    x: 0.58,
    y: 1.38,
    w: 4.9,
    h: 0.68,

    fontFace: t.fontFamily,
    fontSize: 28,
    bold: true,

    color: cleanColor(t.primaryTextColor),

    margin: 0,

    fit: "shrink",

    breakLine: false,

    valign: "mid",
  });

  slide.addText(data.content || "", {
    x: 0.6,
    y: 2.18,
    w: 4.72,
    h: 2.18,

    fontFace: t.fontFamily,
    fontSize: 18,

    color: cleanColor(t.secondaryTextColor),

    margin: 0,

    valign: "top",

    fit: "shrink",

    breakLine: false,
  });
}

export const meta = {
  id: "content_image_right",

  name: "Image Right",

  description:
    "Modern split layout with content on left and visual placeholder on right.",

  category: "content",

  supports: ["title", "content", "image"],
};
