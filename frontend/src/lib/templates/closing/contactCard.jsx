import { getIconBase64 } from "../../../utils/iconHelper.js";
export function Preview({ data }) {
  const t = data.theme;
  return (
    <div
      className="w-full h-full p-16 flex flex-col justify-center"
      style={{ backgroundColor: t.backgroundColor }}
    >
      <h1
        className="text-5xl font-bold mb-12"
        style={{ color: t.primaryTextColor }}
      >
        Thank You
      </h1>
      <div className="space-y-4">
        {data.contacts.map((c, i) => (
          <div key={i} className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: t.accentColor + "20" }}
            >
              <span style={{ color: t.accentColor }}>{c.icon}</span>
            </div>
            <span style={{ color: t.secondaryTextColor }}>{c.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
export async function toPptx(slide, pptx, data) {
  const t = data.theme;
  slide.background = { color: t.backgroundColor.replace("#", "") };
  slide.addText("Thank You", {
    x: 0.8,
    y: 1.5,
    w: 4,
    h: 1,
    fontSize: 44,
    bold: true,
    color: t.primaryTextColor.replace("#", ""),
  });
  for (let i = 0; i < data.contacts.length; i++) {
    const c = data.contacts[i];
    const y = 2.8 + i * 0.6;
    const icon = await getIconBase64(c.icon, t.accentColor, 24);
    slide.addImage({ data: icon, x: 0.8, y, w: 0.3, h: 0.3 });
    slide.addText(c.text, {
      x: 1.2,
      y,
      w: 4,
      h: 0.4,
      fontSize: 14,
      color: t.secondaryTextColor.replace("#", ""),
    });
  }
}
