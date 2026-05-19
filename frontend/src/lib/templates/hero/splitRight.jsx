import { getIconBase64 } from "../../../utils/iconHelper.js";

export function Preview({ data }) {
  const theme = data.theme;
  return (
    <div
      className="w-full h-full flex"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="w-[55%] flex flex-col justify-center px-14">
        <h1
          className="text-5xl font-bold mb-4"
          style={{ color: theme.primaryTextColor }}
        >
          {data.title}
        </h1>
        <p style={{ color: theme.secondaryTextColor }}>{data.subtitle}</p>
      </div>
      <div
        className="w-[45%] flex items-center justify-center"
        style={{ backgroundColor: theme.surfaceColor }}
      >
        {/* Icon here */}
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const theme = data.theme;
  const SLIDE_W = 10,
    SLIDE_H = 5.625,
    RIGHT_W = 4.2,
    LEFT_W = 5.3;

  slide.background = { color: theme.backgroundColor.replace("#", "") };

  // Right panel
  slide.addShape(pptx.ShapeType.rect, {
    x: SLIDE_W - RIGHT_W,
    y: 0,
    w: RIGHT_W,
    h: SLIDE_H,
    fill: { color: theme.surfaceColor.replace("#", "") },
    line: { type: "none" },
  });

  if (data.icon) {
    const icon = await getIconBase64(data.icon, theme.accentColor, 1.2);
    slide.addImage({
      data: icon,
      x: SLIDE_W - RIGHT_W + (RIGHT_W - 1.2) / 2,
      y: (SLIDE_H - 1.2) / 2,
      w: 1.2,
      h: 1.2,
    });
  }

  slide.addText(data.title, {
    x: 0.6,
    y: 2.0,
    w: LEFT_W,
    h: 1.1,
    fontSize: 30,
    bold: true,
    color: theme.primaryTextColor.replace("#", ""),
    fit: "shrink",
  });

  slide.addText(data.subtitle || "", {
    x: 0.6,
    y: 3.2,
    w: LEFT_W,
    h: 0.8,
    fontSize: 14,
    color: theme.secondaryTextColor.replace("#", ""),
    fit: "shrink",
  });
}

// hero_split_right.js
export const meta = {
  id: "hero_split_right",
  name: "Split Right",
  description: "Text left, accent panel right - mirror of split left",
  category: "hero",
  supports: ["title", "subtitle", "icon"],
};
