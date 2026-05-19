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

  const items = Array.isArray(data.items) ? data.items.slice(0, 5) : [];

  return (
    <div
      className="w-full h-full overflow-hidden"
      style={{
        backgroundColor: t.backgroundColor,
        fontFamily: t.fontFamily,
        padding: "52px 58px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          color: t.primaryTextColor,
          fontSize: "38px",
          lineHeight: 1.12,
          fontWeight: 700,
          margin: 0,
          marginBottom: "34px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          flexShrink: 0,
          maxWidth: "92%",
        }}
      >
        {data.title || "Icon List"}
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "22px",
          overflow: "hidden",
          flex: 1,
        }}
      >
        {items.map((item, i) => {
          const text = typeof item === "string" ? item : item.text || "";

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "18px",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  backgroundColor: t.accentColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                <span
                  style={{
                    color: "#FFFFFF",
                    fontSize: "18px",
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {i + 1}
                </span>
              </div>

              <p
                style={{
                  color: t.secondaryTextColor,
                  fontSize: "20px",
                  lineHeight: 1.6,
                  margin: 0,
                  paddingTop: "4px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  overflow: "hidden",
                  flex: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const t = getTheme(data.theme);

  const items = Array.isArray(data.items) ? data.items.slice(0, 5) : [];

  slide.background = {
    color: cleanColor(t.backgroundColor),
  };

  slide.addText(data.title || "Icon List", {
    x: 0.58,
    y: 0.5,
    w: 8.7,
    h: 0.55,

    fontFace: t.fontFamily,
    fontSize: 29,
    bold: true,

    color: cleanColor(t.primaryTextColor),

    margin: 0,

    fit: "shrink",

    breakLine: false,
  });

  items.forEach((item, i) => {
    const y = 1.48 + i * 0.78;

    const text = typeof item === "string" ? item : item.text || "";

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.6,
      y,
      w: 0.42,
      h: 0.42,

      rectRadius: 0.05,

      line: {
        transparency: 100,
      },

      fill: {
        color: cleanColor(t.accentColor),
      },
    });

    slide.addText(String(i + 1), {
      x: 0.6,
      y: y + 0.005,
      w: 0.42,
      h: 0.42,

      fontFace: t.fontFamily,
      fontSize: 13,
      bold: true,

      color: "FFFFFF",

      align: "center",
      valign: "mid",

      margin: 0,
    });

    slide.addText(text, {
      x: 1.22,
      y: y - 0.01,
      w: 7.75,
      h: 0.42,

      fontFace: t.fontFamily,
      fontSize: 16,

      color: cleanColor(t.secondaryTextColor),

      margin: 0,

      valign: "mid",

      fit: "shrink",

      breakLine: false,
    });
  });
}

export const meta = {
  id: "content_icon_list",

  name: "Icon List",

  description:
    "Numbered icon list layout for steps, highlights and sequential information.",

  category: "content",

  supports: ["title", "items"],
};
