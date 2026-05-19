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

  const imageUrl =
    data.image ||
    data.imageUrl ||
    `https://picsum.photos/seed/${encodeURIComponent(
      data.title || "ai"
    )}/800/600`;

  return (
    <div
      className="w-full h-full flex overflow-hidden"
      style={{
        backgroundColor: t.backgroundColor,
        fontFamily: t.fontFamily,
      }}
    >
      <div
        style={{
          width: "42%",
          height: "100%",
          backgroundColor: t.surfaceColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "34px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "22px",
            overflow: "hidden",
            border: `2px solid ${t.accentColor}`,
            backgroundColor: `${t.accentColor}20`,
          }}
        >
          <img
            src={imageUrl}
            alt={data.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `https://picsum.photos/800/600?random=${Math.floor(
                Math.random() * 100
              )}`;
            }}
          />
        </div>
      </div>

      <div
        style={{
          width: "58%",
          padding: "56px 54px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            color: t.primaryTextColor,
            fontSize: "36px",
            lineHeight: 1.12,
            fontWeight: 700,
            margin: 0,
            marginBottom: "22px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxWidth: "92%",
          }}
        >
          {data.title || "Untitled Slide"}
        </h1>

        <p
          style={{
            color: t.secondaryTextColor,
            fontSize: "20px",
            lineHeight: 1.6,
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxWidth: "96%",
          }}
        >
          {data.content || ""}
        </p>
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const t = getTheme(data.theme);

  const imageUrl =
    data.image ||
    data.imageUrl ||
    `https://picsum.photos/seed/${encodeURIComponent(
      data.title || "ai"
    )}/800/600`;

  slide.background = {
    color: cleanColor(t.backgroundColor),
  };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 4.2,
    h: 5.625,

    line: {
      transparency: 100,
    },

    fill: {
      color: cleanColor(t.surfaceColor),
    },
  });

  try {
    slide.addImage({
      path: imageUrl,
      x: 0.38,
      y: 0.62,
      w: 3.42,
      h: 4.36,
    });
  } catch (e) {
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.38,
      y: 0.62,
      w: 3.42,
      h: 4.36,

      line: {
        transparency: 100,
      },

      fill: {
        color: cleanColor(t.accentColor),
        transparency: 82,
      },
    });
  }

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.38,
    y: 0.62,
    w: 3.42,
    h: 4.36,

    rectRadius: 0.08,

    line: {
      color: cleanColor(t.accentColor),
      width: 1.5,
    },

    fill: {
      transparency: 100,
    },
  });

  slide.addText(data.title || "Untitled Slide", {
    x: 4.62,
    y: 1.42,
    w: 4.8,
    h: 0.78,

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
    x: 4.64,
    y: 2.22,
    w: 4.6,
    h: 2.2,

    fontFace: t.fontFamily,
    fontSize: 19,

    color: cleanColor(t.secondaryTextColor),

    margin: 0,
    valign: "top",
    fit: "shrink",
    breakLine: false,
  });
}

export const meta = {
  id: "content_image_left",

  name: "Image Left",

  description:
    "Modern split layout with image panel on left and content on right.",

  category: "content",

  supports: ["title", "content", "image"],
};
