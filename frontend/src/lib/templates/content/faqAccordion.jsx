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

  const faqs = Array.isArray(data.faqs) ? data.faqs.slice(0, 4) : [];

  return (
    <div
      className="w-full h-full overflow-hidden"
      style={{
        backgroundColor: t.backgroundColor,
        fontFamily: t.fontFamily,
        padding: "40px",
      }}
    >
      <h1
        style={{
          color: t.primaryTextColor,
          fontSize: "30px",
          lineHeight: 1.15,
          fontWeight: 700,
          margin: 0,
          marginBottom: "20px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {data.title || "FAQ"}
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {faqs.map((faq, i) => (
          <div
            key={i}
            style={{
              backgroundColor: t.surfaceColor,
              borderRadius: "18px",
              padding: "16px",
              border: `1px solid ${t.accentColor}18`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "999px",
                  backgroundColor: `${t.accentColor}22`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    color: t.accentColor,
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  Q
                </span>
              </div>

              <p
                style={{
                  color: t.primaryTextColor,
                  fontSize: "19px",
                  lineHeight: 1.45,
                  fontWeight: 700,
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {faq.q}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    color: t.secondaryTextColor,
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  A
                </span>
              </div>

              <p
                style={{
                  color: t.secondaryTextColor,
                  fontSize: "16px",
                  lineHeight: 1.65,
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const t = getTheme(data.theme);

  const faqs = Array.isArray(data.faqs) ? data.faqs.slice(0, 4) : [];

  slide.background = {
    color: cleanColor(t.backgroundColor),
  };

  slide.addText(data.title || "FAQ", {
    x: 0.5,
    y: 0.42,
    w: 8.8,
    h: 0.45,

    fontFace: t.fontFamily,
    fontSize: 25,
    bold: true,

    color: cleanColor(t.primaryTextColor),

    margin: 0,
    fit: "shrink",
    breakLine: false,
  });

  faqs.forEach((faq, i) => {
    const y = 1.12 + i * 0.96;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5,
      y,
      w: 8.7,
      h: 0.82,

      rectRadius: 0.04,

      line: {
        color: cleanColor(t.accentColor),
        transparency: 88,
        width: 1,
      },

      fill: {
        color: cleanColor(t.surfaceColor),
      },
    });

    slide.addShape(pptx.ShapeType.ellipse, {
      x: 0.72,
      y: y + 0.12,
      w: 0.22,
      h: 0.22,

      line: {
        transparency: 100,
      },

      fill: {
        color: cleanColor(t.accentColor),
        transparency: 78,
      },
    });

    slide.addText("Q", {
      x: 0.72,
      y: y + 0.105,
      w: 0.22,
      h: 0.22,

      fontFace: t.fontFamily,
      fontSize: 10,
      bold: true,

      color: cleanColor(t.accentColor),

      align: "center",
      valign: "mid",

      margin: 0,
    });

    slide.addText(faq.q || "", {
      x: 1.05,
      y: y + 0.08,
      w: 7.6,
      h: 0.2,

      fontFace: t.fontFamily,
      fontSize: 15,
      bold: true,

      color: cleanColor(t.primaryTextColor),

      margin: 0,
      fit: "shrink",
      breakLine: false,
    });

    slide.addText(faq.a || "", {
      x: 1.05,
      y: y + 0.38,
      w: 7.5,
      h: 0.26,

      fontFace: t.fontFamily,
      fontSize: 12,

      color: cleanColor(t.secondaryTextColor),

      margin: 0,
      valign: "top",
      fit: "shrink",
      breakLine: false,
    });
  });
}

export const meta = {
  id: "content_faq_accordion",

  name: "FAQ",

  description:
    "FAQ accordion style slide with highlighted questions and answers.",

  category: "content",

  supports: ["title", "faqs"],
};
