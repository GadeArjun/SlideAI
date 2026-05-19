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
  const theme = getTheme(data.theme);
  const bullets = Array.isArray(data.bullets) ? data.bullets : [];

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily,
        padding: "54px 62px",
      }}
    >
      <div>
        <h1
          style={{
            color: theme.primaryTextColor,
            fontSize: "38px",
            lineHeight: 1.12,
            fontWeight: 700,
            margin: 0,
            maxWidth: "90%",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {data.title || "Untitled Slide"}
        </h1>

        {data.subtitle && (
          <p
            style={{
              color: theme.secondaryTextColor,
              fontSize: "18px",
              lineHeight: 1.45,
              marginTop: "14px",
              marginBottom: 0,
              maxWidth: "78%",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {data.subtitle}
          </p>
        )}

        <div
          style={{
            width: "72px",
            height: "4px",
            borderRadius: "999px",
            backgroundColor: theme.accentColor,
            marginTop: "22px",
          }}
        />
      </div>

      <div
        style={{
          marginTop: "42px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          flex: 1,
        }}
      >
        {bullets.map((bullet, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "999px",
                marginTop: "12px",
                flexShrink: 0,
                backgroundColor: theme.accentColor,
              }}
            />

            <p
              style={{
                color: theme.primaryTextColor,
                fontSize: "24px",
                lineHeight: 1.48,
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                flex: 1,
              }}
            >
              {bullet}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const theme = getTheme(data.theme);
  const bullets = Array.isArray(data.bullets) ? data.bullets : [];

  slide.background = {
    color: cleanColor(theme.backgroundColor),
  };

  slide.addText(data.title || "Untitled Slide", {
    x: 0.62,
    y: 0.52,
    w: 10.9,
    h: 0.72,

    fontFace: theme.fontFamily,
    fontSize: 29,
    bold: true,

    color: cleanColor(theme.primaryTextColor),

    margin: 0,
    valign: "mid",
    fit: "shrink",
    breakLine: false,
  });

  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 0.64,
      y: 1.22,
      w: 8.8,
      h: 0.38,

      fontFace: theme.fontFamily,
      fontSize: 14,

      color: cleanColor(theme.secondaryTextColor),

      margin: 0,
      fit: "shrink",
      breakLine: false,
    });
  }

  slide.addShape(pptx.ShapeType.rect, {
    x: 0.64,
    y: 1.72,
    w: 0.74,
    h: 0.04,

    line: {
      transparency: 100,
    },

    fill: {
      color: cleanColor(theme.accentColor),
    },
  });

  let currentY = 2.18;

  bullets.forEach((bullet) => {
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 0.72,
      y: currentY + 0.16,
      w: 0.08,
      h: 0.08,

      line: {
        transparency: 100,
      },

      fill: {
        color: cleanColor(theme.accentColor),
      },
    });

    slide.addText(bullet, {
      x: 0.92,
      y: currentY,
      w: 9.9,
      h: 0.5,

      fontFace: theme.fontFamily,
      fontSize: 20,

      color: cleanColor(theme.primaryTextColor),

      margin: 0,
      breakLine: false,
      fit: "shrink",
      valign: "top",
    });

    currentY += 0.58;
  });
}

export const meta = {
  id: "content_title_bullets",

  name: "Title + Bullets",

  description:
    "Professional minimal slide with title, subtitle and bullet content.",

  category: "content",

  supports: ["title", "subtitle", "bullets"],
};
