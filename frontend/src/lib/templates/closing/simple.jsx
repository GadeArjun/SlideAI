import { getIconBase64 } from "../../../utils/iconHelper.js";
import * as LucideIcons from "lucide-react";

export function Preview({ data }) {
  const t = data.theme;
  const Icon = LucideIcons.Heart;
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center"
      style={{ backgroundColor: t.backgroundColor }}
    >
      <Icon
        size={64}
        color={t.accentColor}
        strokeWidth={1.5}
        className="mb-6"
      />
      <h1
        className="text-6xl font-bold mb-4"
        style={{ color: t.primaryTextColor }}
      >
        {data.title || "Thank You"}
      </h1>
      <p className="text-xl" style={{ color: t.secondaryTextColor }}>
        {data.subtitle}
      </p>
    </div>
  );
}
export async function toPptx(slide, pptx, data) {
  const t = data.theme;
  slide.background = { color: t.backgroundColor.replace("#", "") };
  const icon = await getIconBase64("heart", t.accentColor, 64);
  slide.addImage({ data: icon, x: 4.6, y: 1.5, w: 0.8, h: 0.8 });
  slide.addText(data.title || "Thank You", {
    x: 1,
    y: 2.5,
    w: 8,
    h: 1,
    fontSize: 48,
    bold: true,
    align: "center",
    color: t.primaryTextColor.replace("#", ""),
  });
  slide.addText(data.subtitle || "", {
    x: 1,
    y: 3.5,
    w: 8,
    h: 0.5,
    fontSize: 18,
    align: "center",
    color: t.secondaryTextColor.replace("#", ""),
  });
}
export const meta = { id: "content_closing_simple", name: "Closing - Simple" };
