import { getIconBase64 } from "../../../utils/iconHelper.js";

/* =========================================================
   PREVIEW
========================================================= */

export function Preview({ data }) {
  console.log({ data });

  const t = data.theme || {};

  const contacts = [
    {
      icon: "User",
      text: data.name,
    },
    {
      icon: "Mail",
      text: data.email,
    },
    {
      icon: "Phone",
      text: data.phone,
    },
  ].filter((item) => item.text);

  return (
    <div
      className="
        w-full
        h-full
        relative
        overflow-hidden
        flex
        flex-col
        justify-between
        px-16
        py-14
      "
      style={{
        backgroundColor: t.backgroundColor,
        fontFamily: t.fontFamily,
      }}
    >
      {/* BACKGROUND GLOW */}
      <div
        className="absolute top-0 right-0 w-[320px] h-[320px] rounded-full blur-3xl opacity-20"
        style={{
          backgroundColor: t.accentColor,
          transform: "translate(30%, -30%)",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        {/* TITLE */}
        <div className="max-w-4xl">
          <div
            className="w-20 h-1.5 rounded-full mb-8"
            style={{
              backgroundColor: t.accentColor,
            }}
          />

          <h1
            className="
              text-[56px]
              font-bold
              leading-[1.05]
              tracking-tight
              mb-6
            "
            style={{
              color: t.primaryTextColor,
            }}
          >
            {data.title || "Thank You"}
          </h1>

          <p
            className="
              text-xl
              leading-relaxed
              max-w-2xl
            "
            style={{
              color: t.secondaryTextColor,
            }}
          >
            Thank you for your time and attention. We look forward to
            collaborating and building the future together.
          </p>
        </div>

        {/* CONTACTS */}
        <div className="mt-14 flex flex-col gap-4">
          {contacts.map((c, i) => (
            <div
              key={i}
              className="
                flex
                items-center
                gap-4
              "
            >
              {/* ICON */}
              <div
                className="
                  w-11
                  h-11
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  border
                "
                style={{
                  backgroundColor: `${t.accentColor}15`,
                  borderColor: `${t.accentColor}25`,
                  color: t.accentColor,
                }}
              >
                <span className="text-sm font-semibold">{c.icon}</span>
              </div>

              {/* TEXT */}
              <div
                className="
                  text-[17px]
                  font-medium
                "
                style={{
                  color: t.secondaryTextColor,
                }}
              >
                {c.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div
        className="
          relative
          z-10
          pt-10
          mt-10
          border-t
          flex
          items-center
          justify-between
        "
        style={{
          borderColor: `${t.secondaryTextColor}20`,
        }}
      >
        <div>
          <p
            className="
              text-sm
              font-semibold
            "
            style={{
              color: t.primaryTextColor,
            }}
          >
            {data.name}
          </p>

          <p
            className="text-xs mt-1"
            style={{
              color: t.secondaryTextColor,
            }}
          >
            AI Recruit • Future Workforce Platform
          </p>
        </div>

        <div
          className="
            text-xs
            tracking-[0.2em]
            uppercase
          "
          style={{
            color: t.secondaryTextColor,
          }}
        >
          Final Slide
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   EXPORT PPTX
========================================================= */

export async function toPptx(slide, pptx, data) {
  const t = data.theme || {};

  /* =========================================================
     BACKGROUND
  ========================================================= */

  slide.background = {
    color: t.backgroundColor.replace("#", ""),
  };

  /* =========================================================
     ACCENT BAR
  ========================================================= */

  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 1.0,
    w: 1.2,
    h: 0.08,
    line: {
      color: t.accentColor.replace("#", ""),
      transparency: 100,
    },
    fill: {
      color: t.accentColor.replace("#", ""),
    },
    radius: 0.04,
  });

  /* =========================================================
     TITLE
  ========================================================= */

  slide.addText(data.title || "Thank You", {
    x: 0.8,
    y: 1.3,
    w: 7.2,
    h: 0.8,

    fontFace: t.fontFamily || "Calibri",

    fontSize: 30,

    bold: true,

    color: t.primaryTextColor.replace("#", ""),

    margin: 0,
  });

  /* =========================================================
     SUBTITLE
  ========================================================= */

  slide.addText(
    "Thank you for your time and attention. We look forward to collaborating and building the future together.",
    {
      x: 0.8,
      y: 2.5,
      w: 7.5,
      h: 0.7,

      fontFace: t.fontFamily || "Calibri",

      fontSize: 13,

      color: t.secondaryTextColor.replace("#", ""),

      margin: 0,

      breakLine: false,
    }
  );

  /* =========================================================
     CONTACTS
  ========================================================= */

  const contacts = [
    {
      icon: "User",
      text: data.name,
    },
    {
      icon: "Mail",
      text: data.email,
    },
    {
      icon: "Phone",
      text: data.phone,
    },
  ].filter((item) => item.text);

  for (let i = 0; i < contacts.length; i++) {
    const c = contacts[i];

    const y = 3.2 + i * 0.6;

    /* ICON BG */

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.82,
      y: y - 0.02,
      w: 0.32,
      h: 0.32,

      rectRadius: 0.04,

      line: {
        color: t.accentColor.replace("#", ""),

        transparency: 75,
      },

      fill: {
        color: t.accentColor.replace("#", ""),

        transparency: 85,
      },
    });

    /* ICON */

    const icon = await getIconBase64(c.icon, t.accentColor, 20);

    slide.addImage({
      data: icon,

      x: 0.89,
      y: y + 0.03,

      w: 0.16,
      h: 0.16,
    });

    /* TEXT */

    slide.addText(c.text, {
      x: 1.35,
      y: y - 0.02,

      w: 5,
      h: 0.3,

      fontFace: t.fontFamily || "Calibri",

      fontSize: 12.5,

      color: t.secondaryTextColor.replace("#", ""),

      margin: 0,

      breakLine: false,
    });
  }

  /* =========================================================
     FOOTER LINE
  ========================================================= */

  slide.addShape(pptx.ShapeType.line, {
    x: 0.8,
    y: 6.7,
    w: 11.5,
    h: 0,

    line: {
      color: t.secondaryTextColor.replace("#", ""),

      transparency: 80,

      width: 1,
    },
  });

  /* =========================================================
     FOOTER NAME
  ========================================================= */

  slide.addText(data.name || "", {
    x: 0.8,
    y: 6.82,

    w: 3,
    h: 0.25,

    fontFace: t.fontFamily || "Calibri",

    fontSize: 10,

    bold: true,

    color: t.primaryTextColor.replace("#", ""),

    margin: 0,
  });

  /* =========================================================
     FOOTER META
  ========================================================= */

  slide.addText("AI Recruit • Future Workforce Platform", {
    x: 0.8,
    y: 7.02,

    w: 4,
    h: 0.2,

    fontFace: t.fontFamily || "Calibri",

    fontSize: 8,

    color: t.secondaryTextColor.replace("#", ""),

    margin: 0,
  });

  /* =========================================================
     FINAL LABEL
  ========================================================= */

  slide.addText("FINAL SLIDE", {
    x: 10.2,
    y: 6.9,

    w: 2,
    h: 0.2,

    align: "right",

    fontFace: t.fontFamily || "Calibri",

    fontSize: 8,

    bold: false,

    color: t.secondaryTextColor.replace("#", ""),

    charSpace: 2,

    margin: 0,
  });
}
