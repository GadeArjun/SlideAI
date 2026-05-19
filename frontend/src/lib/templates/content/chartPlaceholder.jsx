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

function getChartData(data) {
  return (
    data.chartData || {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      values: [45, 72, 58, 95],
    }
  );
}

function getChartColors(t) {
  return [t.accentColor, "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#06B6D4"];
}

export function Preview({ data }) {
  const t = getTheme(data.theme);

  const type = (data.chartType || "bar").toLowerCase();

  const chartData = getChartData(data);

  const colors = getChartColors(t);

  const max = Math.max(...chartData.values) * 1.15;

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{
        backgroundColor: t.backgroundColor,
        fontFamily: t.fontFamily,
        padding: "34px",
      }}
    >
      <h1
        style={{
          color: t.primaryTextColor,
          fontSize: "30px",
          lineHeight: 1.15,
          fontWeight: 700,
          margin: 0,
          marginBottom: "22px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {data.title || "Chart"}
      </h1>

      <div
        style={{
          flex: 1,
          backgroundColor: t.surfaceColor,
          borderRadius: "22px",
          padding: "22px",
          overflow: "hidden",
        }}
      >
        {type.includes("bar") && (
          <svg
            viewBox="0 0 560 280"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="50"
                y1={30 + i * 45}
                x2="530"
                y2={30 + i * 45}
                stroke={t.secondaryTextColor}
                strokeOpacity="0.14"
                strokeWidth="1"
              />
            ))}

            {[0, 1, 2, 3, 4].map((i) => {
              const val = Math.round(max - (max / 4) * i);

              return (
                <text
                  key={i}
                  x="40"
                  y={35 + i * 45}
                  textAnchor="end"
                  fontSize="10"
                  fill={t.secondaryTextColor}
                >
                  {val}
                </text>
              );
            })}

            {chartData.values.map((v, i) => {
              const count = chartData.values.length;

              const chartW = 480;

              const gap = 16;

              let barW = (chartW - gap * (count + 1)) / count;

              barW = Math.max(18, Math.min(60, barW));

              const totalW = barW * count + gap * (count + 1);

              const startX = 50 + (chartW - totalW) / 2;

              const x = startX + gap + i * (barW + gap);

              const h = (v / max) * 180;

              const y = 210 - h;

              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={y}
                    width={barW}
                    height={h}
                    rx="7"
                    fill={colors[0]}
                  />

                  <text
                    x={x + barW / 2}
                    y={y - 8}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill={t.primaryTextColor}
                  >
                    {v}
                  </text>

                  <text
                    x={x + barW / 2}
                    y={232}
                    textAnchor="middle"
                    fontSize="10"
                    fill={t.secondaryTextColor}
                  >
                    {chartData.labels[i]}
                  </text>
                </g>
              );
            })}
          </svg>
        )}

        {type.includes("line") && (
          <svg
            viewBox="0 0 560 280"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="50"
                y1={30 + i * 45}
                x2="530"
                y2={30 + i * 45}
                stroke={t.secondaryTextColor}
                strokeOpacity="0.14"
              />
            ))}

            <polygon
              fill={colors[0]}
              fillOpacity="0.12"
              points={`50,210 ${chartData.values
                .map((v, i) => {
                  const count = chartData.values.length;

                  const x = count > 1 ? 50 + i * (480 / (count - 1)) : 290;

                  const y = 210 - (v / max) * 180;

                  return `${x},${y}`;
                })
                .join(" ")} ${chartData.values.length > 1 ? 530 : 290},210`}
            />

            <polyline
              fill="none"
              stroke={colors[0]}
              strokeWidth="3"
              strokeLinecap="round"
              points={chartData.values
                .map((v, i) => {
                  const count = chartData.values.length;

                  const x = count > 1 ? 50 + i * (480 / (count - 1)) : 290;

                  const y = 210 - (v / max) * 180;

                  return `${x},${y}`;
                })
                .join(" ")}
            />

            {chartData.values.map((v, i) => {
              const count = chartData.values.length;

              const x = count > 1 ? 50 + i * (480 / (count - 1)) : 290;

              const y = 210 - (v / max) * 180;

              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill={colors[0]}
                    stroke={t.surfaceColor}
                    strokeWidth="3"
                  />

                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill={t.primaryTextColor}
                  >
                    {v}
                  </text>

                  <text
                    x={x}
                    y={232}
                    textAnchor="middle"
                    fontSize="10"
                    fill={t.secondaryTextColor}
                  >
                    {chartData.labels[i]}
                  </text>
                </g>
              );
            })}
          </svg>
        )}

        {type.includes("pie") && (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              gap: "28px",
            }}
          >
            <div
              style={{
                height: "100%",
                aspectRatio: "1/1",
                flexShrink: 0,
              }}
            >
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                {(() => {
                  const total = chartData.values.reduce((a, b) => a + b, 0);

                  let start = -90;

                  return chartData.values.map((v, i) => {
                    const angle = (v / total) * 360;

                    const end = start + angle;

                    const large = angle > 180 ? 1 : 0;

                    const x1 = 100 + 84 * Math.cos((Math.PI * start) / 180);

                    const y1 = 100 + 84 * Math.sin((Math.PI * start) / 180);

                    const x2 = 100 + 84 * Math.cos((Math.PI * end) / 180);

                    const y2 = 100 + 84 * Math.sin((Math.PI * end) / 180);

                    const path = `
                      M100,100
                      L${x1},${y1}
                      A84,84 0 ${large},1 ${x2},${y2}
                      Z
                    `;

                    start = end;

                    return (
                      <path
                        key={i}
                        d={path}
                        fill={colors[i % colors.length]}
                        stroke={t.surfaceColor}
                        strokeWidth="2"
                      />
                    );
                  });
                })()}
              </svg>
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {chartData.labels.map((label, i) => {
                const total = chartData.values.reduce((a, b) => a + b, 0);

                const pct = Math.round((chartData.values[i] / total) * 100);

                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "999px",
                        backgroundColor: colors[i % colors.length],
                        flexShrink: 0,
                      }}
                    />

                    <span
                      style={{
                        color: t.primaryTextColor,
                        fontSize: "15px",
                        flex: 1,
                      }}
                    >
                      {label}
                    </span>

                    <span
                      style={{
                        color: t.secondaryTextColor,
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export async function toPptx(slide, pptx, data) {
  const t = getTheme(data.theme);

  const type = (data.chartType || "bar").toLowerCase();

  const chartData = getChartData(data);

  const colors = getChartColors(t).map(cleanColor);

  slide.background = {
    color: cleanColor(t.backgroundColor),
  };

  slide.addText(data.title || "Chart", {
    x: 0.52,
    y: 0.42,
    w: 8.8,
    h: 0.52,

    fontFace: t.fontFamily,
    fontSize: 25,
    bold: true,

    color: cleanColor(t.primaryTextColor),

    margin: 0,
    fit: "shrink",
    breakLine: false,
  });

  const chartBase = {
    x: 0.68,
    y: 1.2,
    w: 8.5,
    h: 3.95,

    showTitle: false,

    chartArea: {
      fill: {
        color: cleanColor(t.surfaceColor),
      },

      line: {
        color: cleanColor(t.surfaceColor),
      },
    },

    plotArea: {
      fill: {
        color: cleanColor(t.surfaceColor),
      },

      line: {
        color: cleanColor(t.surfaceColor),
      },
    },
  };

  if (type.includes("pie")) {
    slide.addChart(
      pptx.ChartType.pie,
      [
        {
          name: data.seriesName || "Series",
          labels: chartData.labels,
          values: chartData.values,
        },
      ],
      {
        ...chartBase,

        showLegend: true,

        legendPos: "r",

        legendFontSize: 11,

        legendColor: cleanColor(t.secondaryTextColor),

        showPercent: true,

        dataLabelPosition: "bestFit",

        dataLabelColor: cleanColor(t.primaryTextColor),

        dataLabelFontSize: 11,

        chartColors: colors,
      }
    );

    return;
  }

  if (type.includes("line")) {
    slide.addChart(
      pptx.ChartType.line,
      [
        {
          name: data.seriesName || "Series",
          labels: chartData.labels,
          values: chartData.values,
        },
      ],
      {
        ...chartBase,

        showLegend: false,

        catAxisLabelColor: cleanColor(t.secondaryTextColor),

        catAxisLabelFontSize: 11,

        valAxisLabelColor: cleanColor(t.secondaryTextColor),

        valAxisLabelFontSize: 11,

        valGridLine: {
          color: cleanColor(t.secondaryTextColor),

          transparency: 84,

          size: 0.5,
        },

        showValue: true,

        dataLabelPosition: "t",

        dataLabelColor: cleanColor(t.primaryTextColor),

        dataLabelFontSize: 11,

        lineSize: 3,

        lineSmooth: true,

        lineDataSymbol: "circle",

        lineDataSymbolSize: 8,

        lineDataSymbolLineColor: cleanColor(t.surfaceColor),

        chartColors: [colors[0]],
      }
    );

    return;
  }

  slide.addChart(
    pptx.ChartType.bar,
    [
      {
        name: data.seriesName || "Series",
        labels: chartData.labels,
        values: chartData.values,
      },
    ],
    {
      ...chartBase,

      barDir: "col",

      barGrouping: "clustered",

      showLegend: false,

      catAxisLabelColor: cleanColor(t.secondaryTextColor),

      catAxisLabelFontSize: 11,

      catAxisLineShow: false,

      valAxisLabelColor: cleanColor(t.secondaryTextColor),

      valAxisLabelFontSize: 11,

      valAxisLineShow: false,

      valGridLine: {
        color: cleanColor(t.secondaryTextColor),

        transparency: 84,

        size: 0.6,
      },

      showValue: true,

      dataLabelPosition: "outEnd",

      dataLabelColor: cleanColor(t.primaryTextColor),

      dataLabelFontSize: 11,

      chartColors: [colors[0]],

      gapWidthPct: 55,
    }
  );
}

export const meta = {
  id: "content_chart_placeholder",

  name: "Chart",

  description:
    "Modern chart slide supporting bar, line and pie visualizations.",

  category: "content",

  supports: ["title", "chartType", "chartData", "seriesName"],
};
