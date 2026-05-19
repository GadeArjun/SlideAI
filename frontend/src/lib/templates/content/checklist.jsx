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

  const items = Array.isArray(data.items) ? data.items.slice(0, 6) : [];

  return (
    <div
      className="w-full h-full flex overflow-hidden"
      style={{
        backgroundColor: t.backgroundColor,
        fontFamily: t.fontFamily,
        padding: "54px 58px",
      }}
    >
      <div
        style={{
          width: "48%",
          paddingRight: "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            color: t.primaryTextColor,
            fontSize: "38px",
            lineHeight: 1.12,
            fontWeight: 700,
            margin: 0,
            marginBottom: "24px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxWidth: "92%",
          }}
        >
          {data.title || "Checklist"}
        </h1>

        <p
          style={{
            color: t.secondaryTextColor,
            fontSize: "19px",
            lineHeight: 1.65,
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxWidth: "92%",
          }}
        >
          {data.subtitle || ""}
        </p>
      </div>

      <div
        style={{
          width: "52%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "22px",
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                backgroundColor: t.accentColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: "2px",
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <p
              style={{
                color: t.primaryTextColor,
                fontSize: "21px",
                lineHeight: 1.5,
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const t = getTheme(data.theme);

  const items = Array.isArray(data.items) ? data.items.slice(0, 6) : [];

  slide.background = {
    color: cleanColor(t.backgroundColor),
  };

  slide.addText(data.title || "Checklist", {
    x: 0.62,
    y: 1.18,
    w: 4.1,
    h: 0.75,

    fontFace: t.fontFamily,
    fontSize: 29,
    bold: true,

    color: cleanColor(t.primaryTextColor),

    margin: 0,
    fit: "shrink",
    breakLine: false,
    valign: "mid",
  });

  slide.addText(data.subtitle || "", {
    x: 0.64,
    y: 2.05,
    w: 3.9,
    h: 1.2,

    fontFace: t.fontFamily,
    fontSize: 17,

    color: cleanColor(t.secondaryTextColor),

    margin: 0,
    valign: "top",
    fit: "shrink",
    breakLine: false,
  });

  items.forEach((item, i) => {
    const y = 1.18 + i * 0.72;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 5.08,
      y: y + 0.03,
      w: 0.34,
      h: 0.34,

      rectRadius: 0.04,

      line: {
        transparency: 100,
      },

      fill: {
        color: cleanColor(t.accentColor),
      },
    });

    slide.addText("✓", {
      x: 5.08,
      y: y + 0.01,
      w: 0.34,
      h: 0.34,

      fontFace: t.fontFamily,
      fontSize: 12,
      bold: true,

      color: "FFFFFF",

      align: "center",
      valign: "mid",

      margin: 0,
    });

    slide.addText(item, {
      x: 5.62,
      y,
      w: 3.45,
      h: 0.42,

      fontFace: t.fontFamily,
      fontSize: 18,

      color: cleanColor(t.primaryTextColor),

      margin: 0,
      valign: "mid",
      fit: "shrink",
      breakLine: false,
    });
  });
}

export const meta = {
  id: "content_checklist",

  name: "Checklist",

  description: "Two-column checklist layout with highlighted action items.",

  category: "content",

  supports: ["title", "subtitle", "items"],
};
