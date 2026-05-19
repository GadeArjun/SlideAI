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

  const images = Array.isArray(data.images) ? data.images.slice(0, 4) : [];

  return (
    <div
      className="w-full h-full overflow-hidden"
      style={{
        backgroundColor: t.backgroundColor,
        fontFamily: t.fontFamily,
        padding: "34px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          color: t.primaryTextColor,
          fontSize: "30px",
          lineHeight: 1.12,
          fontWeight: 700,
          margin: 0,
          marginBottom: "20px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          flexShrink: 0,
          maxWidth: "92%",
        }}
      >
        {data.title || "Image Gallery"}
      </h1>

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "16px",
          minHeight: 0,
        }}
      >
        {images.map((image, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              borderRadius: "22px",
              overflow: "hidden",
              backgroundColor: t.surfaceColor,
              border: `1px solid ${t.accentColor}22`,
              minWidth: 0,
              minHeight: 0,
            }}
          >
            {image.url ? (
              <img
                src={image.url}
                alt={image.caption || ""}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: t.surfaceColor,
                }}
              />
            )}

            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: `${t.backgroundColor}D9`,
                backdropFilter: "blur(8px)",
                padding: "10px 14px",
              }}
            >
              <p
                style={{
                  color: t.primaryTextColor,
                  fontSize: "13px",
                  lineHeight: 1.4,
                  fontWeight: 600,
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {image.caption || ""}
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

  const images = Array.isArray(data.images) ? data.images.slice(0, 4) : [];

  slide.background = {
    color: cleanColor(t.backgroundColor),
  };

  slide.addText(data.title || "Image Gallery", {
    x: 0.5,
    y: 0.32,
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

  const positions = [
    [0.5, 1.0],
    [5.0, 1.0],

    [0.5, 3.0],
    [5.0, 3.0],
  ];

  images.forEach((image, i) => {
    const [x, y] = positions[i];

    if (image.url) {
      try {
        slide.addImage({
          path: image.url,

          x,
          y,

          w: 4.3,
          h: 1.82,
        });
      } catch (e) {
        slide.addShape(pptx.ShapeType.roundRect, {
          x,
          y,

          w: 4.3,
          h: 1.82,

          rectRadius: 0.06,

          line: {
            color: cleanColor(t.accentColor),
            width: 1,
          },

          fill: {
            color: cleanColor(t.surfaceColor),
          },
        });
      }
    } else {
      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y,

        w: 4.3,
        h: 1.82,

        rectRadius: 0.06,

        line: {
          color: cleanColor(t.accentColor),
          width: 1,
        },

        fill: {
          color: cleanColor(t.surfaceColor),
        },
      });
    }

    slide.addShape(pptx.ShapeType.rect, {
      x,
      y: y + 1.48,

      w: 4.3,
      h: 0.34,

      line: {
        transparency: 100,
      },

      fill: {
        color: cleanColor(t.backgroundColor),
        transparency: 12,
      },
    });

    slide.addText(image.caption || "", {
      x: x + 0.12,
      y: y + 1.54,

      w: 4.02,
      h: 0.14,

      fontFace: t.fontFamily,
      fontSize: 10.5,
      bold: true,

      color: cleanColor(t.primaryTextColor),

      valign: "mid",

      margin: 0,

      fit: "shrink",

      breakLine: false,
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,

      w: 4.3,
      h: 1.82,

      rectRadius: 0.06,

      line: {
        color: cleanColor(t.accentColor),
        transparency: 72,
        width: 1,
      },

      fill: {
        transparency: 100,
      },
    });
  });
}

export const meta = {
  id: "content_image_gallery",

  name: "Image Gallery",

  description:
    "Modern responsive image gallery with captions and visual highlights.",

  category: "content",

  supports: ["title", "images"],
};
