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

  const headers = Array.isArray(data.headers) ? data.headers : [];

  const rows = Array.isArray(data.rows) ? data.rows : [];

  const columnCount = headers.length || rows?.[0]?.length || 3;

  return (
    <div
      className="w-full h-full overflow-hidden"
      style={{
        backgroundColor: t.backgroundColor,
        fontFamily: t.fontFamily,
        padding: "42px",
      }}
    >
      <h1
        style={{
          color: t.primaryTextColor,
          fontSize: "30px",
          lineHeight: 1.15,
          fontWeight: 700,
          margin: 0,
          marginBottom: "24px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {data.title || "Comparison Table"}
      </h1>

      <div
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          border: `1px solid ${t.surfaceColor}`,
          backgroundColor: t.surfaceColor,
        }}
      >
        {!!headers.length && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
              backgroundColor: `${t.accentColor}20`,
              borderBottom: `1px solid ${t.surfaceColor}`,
            }}
          >
            {headers.map((header, i) => (
              <div
                key={i}
                style={{
                  padding: "18px 20px",
                  color: t.primaryTextColor,
                  fontSize: "15px",
                  fontWeight: 700,
                  lineHeight: 1.4,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {header}
              </div>
            ))}
          </div>
        )}

        <div>
          {rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                borderBottom:
                  i !== rows.length - 1
                    ? `1px solid ${t.surfaceColor}`
                    : "none",
                backgroundColor:
                  i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
              }}
            >
              {row.map((cell, j) => (
                <div
                  key={j}
                  style={{
                    padding: "18px 20px",
                    color: t.secondaryTextColor,
                    fontSize: "15px",
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const t = getTheme(data.theme);

  const headers = Array.isArray(data.headers) ? data.headers : [];

  const rows = Array.isArray(data.rows) ? data.rows : [];

  const tableData = [headers, ...rows];

  const columnCount = headers.length || rows?.[0]?.length || 3;

  const colWidth = 8.8 / columnCount;

  slide.background = {
    color: cleanColor(t.backgroundColor),
  };

  slide.addText(data.title || "Comparison Table", {
    x: 0.5,
    y: 0.4,
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

  slide.addTable(tableData, {
    x: 0.5,
    y: 1.15,
    w: 8.8,
    h: 3.9,

    colW: Array(columnCount).fill(colWidth),

    fontFace: t.fontFamily,

    fontSize: 12,

    color: cleanColor(t.secondaryTextColor),

    border: {
      type: "solid",
      pt: 1,
      color: cleanColor(t.surfaceColor),
    },

    fill: {
      color: cleanColor(t.surfaceColor),
    },

    margin: 0.08,

    valign: "mid",

    autoFit: false,

    rowH: 0.45,

    bold: false,

    cellProps: tableData.map((row, rowIndex) =>
      row.map(() => ({
        fill:
          rowIndex === 0
            ? {
                color: cleanColor(t.accentColor),
                transparency: 82,
              }
            : {
                color:
                  rowIndex % 2 === 0 ? cleanColor(t.surfaceColor) : "1A2234",
              },

        color:
          rowIndex === 0
            ? cleanColor(t.primaryTextColor)
            : cleanColor(t.secondaryTextColor),

        bold: rowIndex === 0,

        fontFace: t.fontFamily,

        fontSize: rowIndex === 0 ? 13 : 12,

        margin: 0.08,

        valign: "mid",

        border: {
          type: "solid",
          pt: 1,
          color: cleanColor(t.surfaceColor),
        },
      }))
    ),
  });
}

export const meta = {
  id: "content_comparison_table",

  name: "Comparison Table",

  description:
    "Modern responsive comparison table for structured data and feature comparisons.",

  category: "content",

  supports: ["title", "headers", "rows"],
};
