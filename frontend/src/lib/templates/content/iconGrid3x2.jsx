import { getIconBase64 } from "../../../utils/iconHelper.js";
import * as LucideIcons from "lucide-react";

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
      className="w-full h-full overflow-hidden"
      style={{
        backgroundColor: t.backgroundColor,
        fontFamily: t.fontFamily,
        padding: "40px",
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
          marginBottom: "24px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          flexShrink: 0,
          maxWidth: "92%",
        }}
      >
        {data.title || "Icon Grid"}
      </h1>

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gridTemplateRows: "repeat(2, minmax(0, 1fr))",
          gap: "18px",
          minHeight: 0,
        }}
      >
        {items.map((item, i) => {
          const Icon = LucideIcons[item.icon] || LucideIcons.Star;

          return (
            <div
              key={i}
              style={{
                backgroundColor: t.surfaceColor,
                borderRadius: "22px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                overflow: "hidden",
                minWidth: 0,
                minHeight: 0,
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "999px",
                  backgroundColor: t.accentColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                  flexShrink: 0,
                }}
              >
                <Icon size={26} color="#FFFFFF" strokeWidth={2.2} />
              </div>

              <h3
                style={{
                  color: t.primaryTextColor,
                  fontSize: "18px",
                  lineHeight: 1.3,
                  fontWeight: 700,
                  margin: 0,
                  marginBottom: "10px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  width: "100%",
                  flexShrink: 0,
                }}
              >
                {item.title || ""}
              </h3>

              <p
                style={{
                  color: t.secondaryTextColor,
                  fontSize: "14px",
                  lineHeight: 1.55,
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  overflow: "hidden",
                  width: "100%",
                  display: "-webkit-box",
                  WebkitLineClamp: 5,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {item.text || ""}
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

  const items = Array.isArray(data.items) ? data.items.slice(0, 6) : [];

  slide.background = {
    color: cleanColor(t.backgroundColor),
  };

  slide.addText(data.title || "Icon Grid", {
    x: 0.5,
    y: 0.38,
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

  const cardW = 2.72;
  const cardH = 1.78;

  const positions = [
    [0.5, 1.08],
    [3.64, 1.08],
    [6.78, 1.08],

    [0.5, 3.02],
    [3.64, 3.02],
    [6.78, 3.02],
  ];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    const [x, y] = positions[i];

    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: cardW,
      h: cardH,

      rectRadius: 0.06,

      line: {
        transparency: 100,
      },

      fill: {
        color: cleanColor(t.surfaceColor),
      },
    });

    slide.addShape(pptx.ShapeType.ellipse, {
      x: x + 1.07,
      y: y + 0.18,
      w: 0.58,
      h: 0.58,

      line: {
        transparency: 100,
      },

      fill: {
        color: cleanColor(t.accentColor),
      },
    });

    if (item.icon) {
      try {
        const iconData = await getIconBase64(item.icon, "#FFFFFF", 34);

        slide.addImage({
          data: iconData,

          x: x + 1.2,
          y: y + 0.31,

          w: 0.32,
          h: 0.32,
        });
      } catch (e) {}
    }

    slide.addText(item.title || "", {
      x: x + 0.2,
      y: y + 0.9,
      w: 2.3,
      h: 0.24,

      fontFace: t.fontFamily,
      fontSize: 14,
      bold: true,

      color: cleanColor(t.primaryTextColor),

      align: "center",

      margin: 0,

      fit: "shrink",

      breakLine: false,
    });

    slide.addText(item.text || "", {
      x: x + 0.18,
      y: y + 1.18,
      w: 2.35,
      h: 0.42,

      fontFace: t.fontFamily,
      fontSize: 10.5,

      color: cleanColor(t.secondaryTextColor),

      align: "center",

      valign: "top",

      margin: 0,

      fit: "shrink",

      breakLine: false,
    });
  }
}

export const meta = {
  id: "content_icon_grid_3x2",

  name: "Icon Grid 3x2",

  description:
    "Six card icon grid layout for features, services and capabilities.",

  category: "content",

  supports: ["title", "items"],
};
