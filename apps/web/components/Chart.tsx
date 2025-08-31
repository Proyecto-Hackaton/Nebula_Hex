"use client";

import { useEffect, useRef } from "react";
import { createChart, IChartApi, UTCTimestamp } from "lightweight-charts";

export default function Chart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    const el = containerRef.current!;
    const chart = createChart(el, {
      width: el.clientWidth,
      height: el.clientHeight,
      layout: { background: { color: "transparent" }, textColor: "#ddd" },
      grid: { vertLines: { color: "rgba(255,255,255,0.06)" }, horzLines: { color: "rgba(255,255,255,0.06)" } },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.12)" },
      timeScale: { borderColor: "rgba(255,255,255,0.12)" },
    });
    chartRef.current = chart;

    const series = chart.addLineSeries();
    series.setData([
      { time: 1700000000 as UTCTimestamp, value: 2960 },
      { time: 1700003600 as UTCTimestamp, value: 2985 },
      { time: 1700007200 as UTCTimestamp, value: 2950 },
      { time: 1700010800 as UTCTimestamp, value: 3020 },
      { time: 1700014400 as UTCTimestamp, value: 2965 },
    ]);

    const ro = new ResizeObserver(() => {
      chart.applyOptions({ width: el.clientWidth, height: el.clientHeight });
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}