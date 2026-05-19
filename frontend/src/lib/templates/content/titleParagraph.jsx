const DEFAULT_THEME = {
  backgroundColor: "#0F172A",
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
        padding: "56px 62px",
      }}
    >
      <h1
        style={{
          color: t.primaryTextColor,
          fontSize: "38px",
          lineHeight: 1.12,
          fontWeight: 700,
          margin: 0,
          maxWidth: "88%",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {data.title || "Untitled Slide"}
      </h1>

      <div
        style={{
          width: "72px",
          height: "4px",
          borderRadius: "999px",
          backgroundColor: t.accentColor,
          marginTop: "24px",
          marginBottom: "34px",
        }}
      />

      <p
        style={{
          color: t.secondaryTextColor,
          fontSize: "22px",
          lineHeight: 1.65,
          margin: 0,
          maxWidth: "82%",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {data.content || ""}
      </p>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const t = getTheme(data.theme);

  slide.background = {
    color: cleanColor(t.backgroundColor),
  };

  slide.addText(data.title || "Untitled Slide", {
    x: 0.62,
    y: 0.54,
    w: 9,
    h: 0.72,

    fontFace: t.fontFamily,
    fontSize: 29,
    bold: true,

    color: cleanColor(t.primaryTextColor),

    margin: 0,
    fit: "shrink",
    breakLine: false,
    valign: "mid",
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0.64,
    y: 1.5,
    w: 0.74,
    h: 0.04,

    line: {
      transparency: 100,
    },

    fill: {
      color: cleanColor(t.accentColor),
    },
  });

  slide.addText(data.content || "", {
    x: 0.64,
    y: 1.82,
    w: 8.2,
    h: 2.9,

    fontFace: t.fontFamily,
    fontSize: 20,

    color: cleanColor(t.secondaryTextColor),

    margin: 0,
    valign: "top",
    fit: "shrink",
    breakLine: false,
  });
}

export const meta = {
  id: "content_title_paragraph",

  name: "Title + Paragraph",

  description: "Minimal clean slide with heading and long paragraph content.",

  category: "content",

  supports: ["title", "content"],
};
