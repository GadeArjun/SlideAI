import { useState, useEffect, useRef } from "react";
import PptxGenJS from "pptxgenjs";

const PPT_WIDTH_PX = 960;
const PPT_HEIGHT_PX = 540;

export default function SlideTester({
  templates = {},
  slides = {},
  title = "Design Tester",
  initialKey,
}) {
  const keys = Object.keys(slides || {});
  const [selected, setSelected] = useState(initialKey || keys[0] || "");
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  const data = slides[selected] || {};
  const Template = templates[data.subtype];

  useEffect(() => {
    const fit = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth - 48;
      setScale(Math.min(1, Math.max(0.5, w / PPT_WIDTH_PX)));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [selected]);

  const handleDownload = async () => {
    if (!Template?.toPptx) return;
    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_16x9";
    const slide = pptx.addSlide();
    await Template.toPptx(slide, pptx, data);
    await pptx.writeFile({
      fileName: `${(data.title || selected).replace(/[^a-z0-9]/gi, "_")}.pptx`,
    });
  };

  if (!keys.length)
    return (
      <div className="min-h-screen bg-[#050507] grid place-items-center text-white">
        No slides
      </div>
    );
  if (!Template)
    return (
      <div className="min-h-screen bg-[#050507] grid place-items-center text-white">
        Template not found: {data.subtype}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/70 border-b border-zinc-800">
        <div className="max-w- mx-auto px-4 sm:px-6 lg:px-8 h- flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <span className="text-black font-bold text-sm">AI</span>
            </div>
            <div>
              <h1 className="font-semibold leading-none">{title}</h1>
              <p className="text- text-zinc-500 leading-none mt-0.5">
                1:1 PPT Preview • 960×540
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500 mr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleDownload}
              className="h-9 px-4 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Export
            </button>
          </div>
        </div>
      </header>

      <main className="max-w- mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Template Picker */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {keys.map((key) => {
            const s = slides[key];
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className={`shrink-0 flex items-center gap-2.5 px-3.5 h-10 rounded-xl border transition-all ${
                  selected === key
                    ? "bg-white text-black border-white"
                    : "bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:bg-zinc-800"
                }`}
              >
                <div className="flex -space-x-1">
                  <div
                    className="w-4 h-4 rounded-full ring-2 ring-black"
                    style={{ backgroundColor: s.theme.accentColor }}
                  />
                  <div
                    className="w-4 h-4 rounded-full ring-2 ring-black"
                    style={{ backgroundColor: s.theme.backgroundColor }}
                  />
                </div>
                <span className="text-sm font-medium whitespace-nowrap">
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid xl:grid-cols-[1fr_320px] gap-6 items-start">
          {/* === PREVIEW - EXACT PPT SIZE === */}
          <div className="min-w-0">
            <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden">
              {/* Scrollable container - NEVER shrinks the slide */}
              <div
                ref={containerRef}
                className="overflow-auto bg-[#0a0a0a]"
                style={{ maxHeight: "calc(100vh - 18px)" }}
              >
                <div className="flex justify-center">
                  {/* EXACT SIZE WRAPPER - This is the key */}
                  <div
                    className="relative shrink-0 shadow-2xl ring-1 ring-white/10"
                    style={{
                      width: `${PPT_WIDTH_PX}px`,
                      height: `${PPT_HEIGHT_PX}px`,
                      transform: `scale(${scale})`,
                      transformOrigin: "top center",
                      marginBottom:
                        scale < 1 ? `${-(PPT_HEIGHT_PX * (1 - scale))}px` : 0,
                    }}
                  >
                    {/* PASS ONLY DATA */}
                    <Template.Preview data={data} />
                  </div>
                </div>
              </div>

              {/* Scale controls */}
              <div className="flex items-center justify-center gap-3 px-4 h-10 border-t border-zinc-800 bg-zinc-950/30">
                <button
                  onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
                  className="text-zinc-500 hover:text-white p-1"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                  </svg>
                </button>
                <span className="text- text-zinc-500 font-mono w-10 text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={() => setScale((s) => Math.min(1, s + 0.1))}
                  className="text-zinc-500 hover:text-white p-1"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
