export function Preview({ data }) {
  const t = data.theme;
  const members = (data.members || []).slice(0, 4);
  return (
    <div
      className="w-full h-full p-10"
      style={{ backgroundColor: t.backgroundColor }}
    >
      <h1
        className="text-2xl font-bold mb-6 text-center"
        style={{ color: t.primaryTextColor }}
      >
        {data.title}
      </h1>
      <div className="grid grid-cols-2 gap-6 h-[80%]">
        {members.map((m, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-5 rounded-xl"
            style={{ backgroundColor: t.surfaceColor }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
              style={{ backgroundColor: t.accentColor, color: "#fff" }}
            >
              {m.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <p className="font-bold" style={{ color: t.primaryTextColor }}>
                {m.name}
              </p>
              <p className="text-sm" style={{ color: t.secondaryTextColor }}>
                {m.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export async function toPptx(slide, pptx, data) {
  const t = data.theme;
  const m = (data.members || []).slice(0, 4);
  slide.background = { color: t.backgroundColor.replace("#", "") };
  slide.addText(data.title, {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.6,
    fontSize: 24,
    bold: true,
    align: "center",
    color: t.primaryTextColor.replace("#", ""),
  });
  m.forEach((mem, i) => {
    const x = 0.8 + (i % 2) * 4.7,
      y = 1.5 + Math.floor(i / 2) * 1.8;
    slide.addShape("ellipse", {
      x,
      y,
      w: 0.9,
      h: 0.9,
      fill: { color: t.accentColor.replace("#", "") },
    });
    slide.addText(
      mem.name
        ?.split(" ")
        .map((n) => n[0])
        .join(""),
      {
        x,
        y,
        w: 0.9,
        h: 0.9,
        fontSize: 18,
        bold: true,
        align: "center",
        valign: "middle",
        color: "FFFFFF",
      }
    );
    slide.addText(mem.name, {
      x: x + 1.1,
      y: y + 0.15,
      w: 3,
      w: 3.2,
      h: 0.35,
      fontSize: 15,
      bold: true,
      color: t.primaryTextColor.replace("#", ""),
    });
    slide.addText(mem.role, {
      x: x + 1.1,
      y: y + 0.5,
      w: 3.2,
      h: 0.3,
      fontSize: 12,
      color: t.secondaryTextColor.replace("#", ""),
    });
  });
}
export const meta = { id: "content_team_grid", name: "Team Grid" };
