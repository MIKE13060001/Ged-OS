"use client";

import { useRef, useCallback } from "react";
import { Download } from "lucide-react";
import { toPng } from "html-to-image";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

export interface ChartData {
  type: "bar" | "pie" | "line" | "area";
  title: string;
  data: Record<string, unknown>[];
  xKey?: string;
  yKeys?: string[];
  unit?: string;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

function fmt(v: number, unit?: string): string {
  const s = v >= 10000 ? `${(v / 1000).toFixed(0)}k` : v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
  if (unit === "€" || unit === "EUR") return `${s} €`;
  if (unit === "%") return `${v}%`;
  return s;
}

function fmtFull(v: number, unit?: string): string {
  const s = v.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (unit === "€" || unit === "EUR") return `${s} €`;
  if (unit === "%") return `${v}%`;
  return v.toLocaleString("fr-FR");
}

/* ── Tooltip ── */
function ChartTooltip({ active, payload, label, unit }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string; unit?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3.5 py-2.5 text-[12px]"
      style={{
        background: "rgba(10,10,20,0.96)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      {label && <p className="font-medium mb-1.5 text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2.5 py-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: entry.color }} />
          <span style={{ color: "rgba(255,255,255,0.55)" }}>{entry.name}</span>
          <span className="font-semibold ml-auto pl-4" style={{ color: "rgba(255,255,255,0.92)" }}>
            {fmtFull(entry.value, unit)}
          </span>
        </div>
      ))}
    </div>
  );
}

function PieTooltipContent({ active, payload, unit }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { fill: string } }>; unit?: string }) {
  if (!active || !payload?.length) return null;
  const e = payload[0];
  return (
    <div
      className="rounded-lg px-3.5 py-2.5 text-[12px]"
      style={{ background: "rgba(10,10,20,0.96)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
    >
      <div className="flex items-center gap-2.5">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: e.payload.fill }} />
        <span style={{ color: "rgba(255,255,255,0.55)" }}>{e.name}</span>
        <span className="font-semibold ml-3" style={{ color: "rgba(255,255,255,0.92)" }}>{fmtFull(e.value, unit)}</span>
      </div>
    </div>
  );
}

/* ── Color Legend — single column, one entry per line ── */
function ColorLegend({ data, xKey, colors, unit }: { data: Record<string, unknown>[]; xKey: string; colors: string[]; unit?: string }) {
  return (
    <div
      className="pl-4 pr-6 pb-3.5 pt-2.5 flex flex-col gap-[3px]"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-2" style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
          <span className="w-[7px] h-[7px] rounded-[2px] shrink-0" style={{ background: colors[i % colors.length] }} />
          <span className="text-[9px] font-medium shrink-0" style={{ color: "rgba(255,255,255,0.50)" }}>
            {String(item[xKey] || "")}
          </span>
          <span className="flex-1 border-b border-dotted mx-1" style={{ borderColor: "rgba(255,255,255,0.06)", minWidth: 8 }} />
          <span className="text-[9px] font-semibold shrink-0 tabular-nums" style={{ color: "rgba(255,255,255,0.40)", whiteSpace: "nowrap" }}>
            {fmtFull(Number(item.value || 0), unit)}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Download as PNG — temporarily widens the real element for clean capture ── */
function useDownload(title: string, wrapperRef: React.RefObject<HTMLDivElement | null>) {
  return useCallback(async () => {
    const el = wrapperRef.current;
    if (!el) return;
    try {
      // Save original styles
      const origWidth = el.style.width;
      const origMinWidth = el.style.minWidth;
      const origMargin = el.style.marginTop;
      const origPosition = el.style.position;

      // Temporarily widen for export
      el.style.width = "820px";
      el.style.minWidth = "820px";
      el.style.marginTop = "0px";

      // Hide download button + tooltip
      const btn = el.querySelector("[data-export-hide]") as HTMLElement | null;
      if (btn) btn.style.display = "none";
      const tooltips = el.querySelectorAll(".recharts-tooltip-wrapper");
      tooltips.forEach(t => (t as HTMLElement).style.display = "none");

      // Wait for reflow
      await new Promise(r => setTimeout(r, 150));

      const dataUrl = await toPng(el, {
        pixelRatio: 3,
        backgroundColor: "#0c0c14",
        style: { borderRadius: "12px" },
      });

      // Restore original styles
      el.style.width = origWidth;
      el.style.minWidth = origMinWidth;
      el.style.marginTop = origMargin;
      el.style.position = origPosition;
      if (btn) btn.style.display = "";
      tooltips.forEach(t => (t as HTMLElement).style.display = "");

      const link = document.createElement("a");
      link.download = `${title.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("PNG export failed:", err);
    }
  }, [title, wrapperRef]);
}

/* ── Shared styles ── */
const TICK = { fontSize: 10, fill: "rgba(255,255,255,0.3)" };
const GRID_PROPS = { strokeDasharray: "3 3" as const, vertical: false as const, stroke: "rgba(255,255,255,0.05)" };

/* ── Main Component ── */
export function ChartRenderer({ data }: { data: ChartData }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const download = useDownload(data.title, wrapperRef);
  const xKey = data.xKey || "name";
  const yKeys = data.yKeys || ["value"];

  // For bar charts: use index-based coloring (each bar a different color)
  const useIndexColors = data.type === "bar" && yKeys.length === 1;

  return (
    <div
      ref={wrapperRef}
      className="mt-3 rounded-xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-1">
        <div>
          <p className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.82)" }}>{data.title}</p>
          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.28)" }}>
            {data.data.length} entrée{data.data.length !== 1 ? "s" : ""}
            {data.unit ? ` · ${data.unit}` : ""}
          </p>
        </div>
        <button
          data-export-hide="true"
          onClick={download}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.12)"; e.currentTarget.style.borderColor = "rgba(59,130,246,0.25)"; e.currentTarget.style.color = "#60a5fa"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
        >
          <Download size={10} /> Télécharger PNG
        </button>
      </div>

      {/* Chart area */}
      <div className="px-3" style={{ height: data.type === "pie" ? 300 : 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          {data.type === "bar" ? (
            <BarChart data={data.data} margin={{ top: 16, right: 16, left: 0, bottom: 4 }}>
              <defs>
                {(useIndexColors ? data.data : yKeys).map((_, i) => (
                  <linearGradient key={i} id={`bg-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.85} />
                    <stop offset="100%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.55} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey={xKey} tick={false} axisLine={false} tickLine={false} height={4} />
              <YAxis tick={TICK} axisLine={false} tickLine={false} tickFormatter={(v: number) => fmt(v, data.unit)} width={55} />
              <Tooltip content={<ChartTooltip unit={data.unit} />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              {useIndexColors ? (
                <Bar dataKey={yKeys[0]} radius={[5, 5, 0, 0]} maxBarSize={36} animationDuration={600}>
                  {data.data.map((_, i) => (
                    <Cell key={i} fill={`url(#bg-${i})`} />
                  ))}
                </Bar>
              ) : (
                yKeys.map((key, i) => (
                  <Bar key={key} dataKey={key} fill={`url(#bg-${i})`} radius={[5, 5, 0, 0]} maxBarSize={36} animationDuration={600} />
                ))
              )}
            </BarChart>
          ) : data.type === "pie" ? (
            <PieChart>
              <Pie
                data={data.data}
                cx="50%"
                cy="45%"
                outerRadius={90}
                innerRadius={42}
                dataKey="value"
                nameKey={xKey}
                paddingAngle={3}
                strokeWidth={0}
                label={false}
                animationDuration={600}
              >
                {data.data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltipContent unit={data.unit} />} />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 10, color: "rgba(255,255,255,0.45)", paddingTop: 8 }}
                formatter={(value: string) => <span style={{ color: "rgba(255,255,255,0.5)", marginLeft: 2, fontSize: 10 }}>{value.length > 18 ? value.slice(0, 16) + "…" : value}</span>}
              />
            </PieChart>
          ) : data.type === "line" ? (
            <LineChart data={data.data} margin={{ top: 16, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey={xKey} tick={TICK} axisLine={false} tickLine={false} dy={6} interval="preserveStartEnd" />
              <YAxis tick={TICK} axisLine={false} tickLine={false} tickFormatter={(v: number) => fmt(v, data.unit)} width={55} />
              <Tooltip content={<ChartTooltip unit={data.unit} />} cursor={{ stroke: COLORS[0], strokeWidth: 1, strokeDasharray: "5 5" }} />
              {yKeys.map((key, i) => (
                <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: COLORS[i % COLORS.length] }} animationDuration={600} />
              ))}
            </LineChart>
          ) : (
            <AreaChart data={data.data} margin={{ top: 16, right: 16, left: 0, bottom: 4 }}>
              <defs>
                {yKeys.map((_, i) => (
                  <linearGradient key={i} id={`ag-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey={xKey} tick={TICK} axisLine={false} tickLine={false} dy={6} interval="preserveStartEnd" />
              <YAxis tick={TICK} axisLine={false} tickLine={false} tickFormatter={(v: number) => fmt(v, data.unit)} width={55} />
              <Tooltip content={<ChartTooltip unit={data.unit} />} cursor={{ stroke: COLORS[0], strokeWidth: 1, strokeDasharray: "5 5" }} />
              {yKeys.map((key, i) => (
                <Area key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} strokeWidth={2} fillOpacity={1} fill={`url(#ag-${i})`} activeDot={{ r: 5, strokeWidth: 0, fill: COLORS[i % COLORS.length] }} animationDuration={600} />
              ))}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Color legend below chart (for bar charts — replaces X axis labels) */}
      {(data.type === "bar" && useIndexColors) && (
        <ColorLegend data={data.data} xKey={xKey} colors={COLORS} unit={data.unit} />
      )}

      {/* Multi-series legend for line/area with multiple yKeys */}
      {(data.type === "line" || data.type === "area") && yKeys.length > 1 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 px-5 pb-3">
          {yKeys.map((key, i) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>{key}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
