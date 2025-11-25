import React, { useMemo, useState, useEffect } from "react";
import ForecastVisualizations from "../components/ForecastVisualizations";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend as ReLegend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpCircle, ArrowDownCircle, Cpu, HardDrive, Network } from "lucide-react";
import ForecastForm from "../components/ForecastForm"; // Path as per your structure

export default function Forecasts() {
  const [filters, setFilters] = useState({
    region: '',
    service: '',
    timeHorizon: '',
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeOpt, setActiveOpt] = useState(null);

  const metrics = useMemo(() => {
    const randPercent = (min, max) => Math.round(Math.random() * (max - min) + min);

    const cpuCurrent = randPercent(55, 80);
    const cpuForecast = Array.from({ length: 7 }, (_, i) =>
      Math.round(cpuCurrent + i * randPercent(1, 3))
    );

    const storageCurrent = Number((Math.random() * 0.9 + 2.0).toFixed(2));
    const storageNext = Number((storageCurrent + Math.random() * 0.6 + 0.1).toFixed(2));
    const storageForecast = Array.from({ length: 7 }, (_, i) =>
      Number((storageCurrent + i * ((storageNext - storageCurrent) / 6)).toFixed(2))
    );

    const netCurrent = randPercent(600, 900);
    const netForecast = Array.from({ length: 7 }, (_, i) =>
      Math.round(netCurrent + i * randPercent(10, 30))
    );

    // Light mode: Light blue/silver, dark mode: magenta-orange
    return [
      {
        id: "cpu",
        icon: <Cpu className="w-6 h-6 text-[#282828] dark:text-white" />,
        title: "CPU Demand",
        unit: "%",
        current: cpuCurrent,
        forecast: cpuForecast,
        pie: [
          { name: "Used", value: cpuCurrent },
          { name: "Remaining", value: 100 - cpuCurrent },
        ],
      },
      {
        id: "storage",
        icon: <HardDrive className="w-6 h-6 text-[#282828] dark:text-white" />,
        title: "Storage Usage",
        unit: "TB",
        current: storageCurrent,
        forecast: storageForecast,
        pie: (() => {
          const usedPercent = Math.round((storageCurrent / storageNext) * 100);
          return [
            { name: "Used", value: usedPercent },
            { name: "Remaining", value: Math.max(0, 100 - usedPercent) },
          ];
        })(),
      },
      {
        id: "network",
        icon: <Network className="w-6 h-6 text-[#282828] dark:text-white" />,
        title: "Network Bandwidth",
        unit: "Mbps",
        current: netCurrent,
        forecast: netForecast,
        pie: (() => {
          const next = netForecast[netForecast.length - 1] || netCurrent;
          const usedPercent = Math.round((netCurrent / Math.max(1, next)) * 100);
          return [
            { name: "Used", value: Math.min(100, usedPercent) },
            { name: "Remaining", value: Math.max(0, 100 - usedPercent) },
          ];
        })(),
      },
    ];
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrentSlide((p) => (p + 1) % metrics.length), 9000);
    return () => clearInterval(t);
  }, [metrics.length]);

  const optimizations = [
    {
      id: "opt-cpu",
      title: "Auto-scale CPU",
      description:
        "Enable auto-scaling for east-region CPU clusters during predicted peak weeks. Configure conservative cooldown and step scaling policies.",
      impact: "High",
      metric: "cpu",
      date: "2025-11-01",
    },
    {
      id: "opt-storage",
      title: "Storage Rightsizing",
      description:
        "Reclaim unused storage, identify cold data and migrate to cheaper tiers (Archive/Blob Cool). Run lifecycle policies weekly.",
      impact: "Medium",
      metric: "storage",
      date: "2025-10-18",
    },
    {
      id: "opt-network",
      title: "Network QoS Tuning",
      description:
        "Adjust QoS(Quality of Service) rules to prioritize critical traffic, apply burst controls on non-critical flows and reduce latency spikes.",
      impact: "Low",
      metric: "network",
      date: "2025-10-10",
    },
  ];

  const COLORS = ["#99bde7", "#ebedf0"]; // Light blue/silver pie (light), can keep as is for dark
  const makeLineData = (forecast) =>
    forecast.map((v, i) => ({ name: `Week ${i + 1}`, value: v }));

  const slideVariants = {
    hidden: { opacity: 0, x: 80, scale: 0.98 },
    enter: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: -80,
      scale: 0.98,
      transition: { duration: 0.6, ease: "easeIn" },
    },
  };

  const timelineItemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.12 * i, duration: 0.45 },
    }),
  };

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % metrics.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + metrics.length) % metrics.length);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 min-h-screen bg-[#fffff0] dark:bg-gray-900 transition-colors duration-500">
      <ForecastForm onSubmit={handleApplyFilters} />
      <div className="my-8 border-t border-[#b7d2f7]/30"></div>
      <motion.h1
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-[#282828] dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-fuchsia-600 dark:to-orange-400"
      >
        Azure Demand Forecasting
      </motion.h1>
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={metrics[currentSlide].id}
              variants={slideVariants}
              initial="hidden"
              animate="enter"
              exit="exit"
              className="w-full"
            >
              <ForecastCard
                metric={metrics[currentSlide]}
                COLORS={COLORS}
                makeLineData={makeLineData}
              />
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={prevSlide}
              className="px-4 py-2 rounded-lg bg-[#e0f3fa] dark:bg-fuchsia-800 hover:bg-[#afd8fa] dark:hover:bg-fuchsia-700 text-[#225577] dark:text-orange-200 shadow-sm transition"
            >
              ← Previous
            </button>
            <div className="text-sm text-[#557399] dark:text-orange-300 font-medium">
              {currentSlide + 1} / {metrics.length}
            </div>
            <button
              onClick={nextSlide}
              className="px-4 py-2 rounded-lg bg-[#b7d2f7] text-[#2d2a1f] dark:bg-fuchsia-600 dark:text-white hover:bg-[#99bde7] shadow-md transition"
            >
              Next →
            </button>
          </div>
        </div>
        <div className="mt-12 max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold mb-6 text-[#2d2a1f] dark:text-orange-300">Optimization Insights</h3>
          <div className="relative pl-8">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-[#b7d2f7] dark:bg-fuchsia-700 rounded" />
            <ul className="space-y-8">
              {optimizations.map((opt, i) => {
                const active = opt.metric === metrics[currentSlide].id;
                const expanded = activeOpt === opt.id;
                return (
                  <motion.li
                    key={opt.id}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={timelineItemVariants}
                    className="relative"
                  >
                    <div
                      className={`absolute -left-4 top-1 w-3 h-3 rounded-full border-2 ${
                        active
                          ? "bg-[#b7d2f7] border-[#afd8fa]"
                          : "bg-white dark:bg-[#dbeafe] border-[#b7d2f7] dark:border-fuchsia-600"
                      }`}
                    />
                    <div
                      className={`pl-6 py-4 pr-4 rounded-xl shadow-sm transition-all cursor-pointer ${
                        active
                          ? "bg-white dark:bg-orange-900 ring-1 ring-[#b7d2f7]/50"
                          : "bg-[#f7f7f5]/80 dark:bg-fuchsia-900/60"
                      }`}
                      onClick={() => setActiveOpt(expanded ? null : opt.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-semibold text-[#225577] dark:text-orange-200">{opt.title}</h4>
                          <div className="text-xs text-[#557399] mt-1">{opt.date}</div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              opt.impact === "High"
                                ? "bg-blue-100 text-blue-700 dark:bg-red-900/30 dark:text-red-300"
                                : opt.impact === "Medium"
                                ? "bg-slate-100 text-slate-900 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            }`}
                          >
                            {opt.impact}
                          </span>
                        </div>
                      </div>
                    </div>
                    {expanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`pl-6 pr-4 pt-3 pb-4 mt-0.5 mb-0 rounded-xl bg-[#fafdff] dark:bg-fuchsia-900/50 border border-[#d2e0ed] dark:border-fuchsia-800 text-sm text-[#2d2a1f] dark:text-orange-200`}
                      >
                        <div>
                          <span className="font-semibold">Description:</span> {opt.description}
                        </div>
                        <div className="mt-2">
                          <span className="font-semibold">Impact:</span> {opt.impact}
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <button
                            onClick={() => setCurrentSlide(metrics.findIndex((m) => m.id === opt.metric))}
                            className="text-sm px-3 py-1 rounded-md font-medium bg-[#e0f3fa] text-[#225577] border border-[#b7d2f7]"
                          >
                            View related metric
                          </button>
                          <a
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            className="text-sm text-[#557399] hover:text-[#225577] dark:hover:text-orange-300"
                          >
                            Learn more →
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
        <ForecastVisualizations />{/*milestone3 visualizations*/}
      </div>
    </div>
  );
}

/* ----- ForecastCard with light theme (blue/silver) and dark (magenta-orange) ----- */
function ForecastCard({ metric: m, COLORS, makeLineData }) {
  return (
    <div
      className={`
        rounded-3xl px-10 py-9 shadow-2xl border-4 border-[#b7d2f7] 
        bg-gradient-to-br from-[#f3f5f7] to-[#ececec]
        dark:bg-gradient-to-br dark:from-fuchsia-600 dark:to-orange-400 dark:border-none
        backdrop-blur-md 
        flex flex-col justify-center items-center
        transition-all
      `}
      style={{
        minHeight: 420,
        maxWidth: '700px',
        margin: 'auto'
      }}
    >
      <div className="flex flex-col items-center mb-2">
        <div className="w-16 h-16 rounded-xl bg-[#e0f3fa] dark:bg-fuchsia-600 flex items-center justify-center mb-2">
          {m.icon}
        </div>
        <h2 className="text-3xl font-bold mb-1 text-[#222] dark:text-white">{m.title}</h2>
        <div className="text-base font-light text-[#557399] dark:text-orange-50 mb-3">Forecast Overview</div>
      </div>
      <div className="flex flex-col md:flex-row items-center md:items-start w-full gap-8 justify-between">
        {/* Pie/Donut Chart & Current */}
        <div className="flex flex-col items-center">
          <PieChart width={120} height={120} style={{ marginBottom: 10 }}>
            <Pie
              data={m.pie}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={55}
              paddingAngle={6}
              dataKey="value"
              labelLine={false}
              label={({ percent }) => percent > 0.15 ? `${Math.round(percent * 100)}%` : ''}
            >
              {m.pie.map((entry, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#fff" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
          <div className="flex items-center gap-2 mt-3 mb-2">
            {m.forecast[m.forecast.length - 1] >= m.current
              ? <ArrowUpCircle className="w-5 h-5 text-[#b7d2f7] dark:text-orange-200" />
              : <ArrowDownCircle className="w-5 h-5 text-[#aca899] dark:text-fuchsia-200" />}
            <span className="text-sm font-medium text-[#282828] dark:text-white">Current</span>
          </div>
          <div className="text-2xl font-extrabold text-[#282828] dark:text-white">{m.current} <span className="text-lg">{m.unit}</span></div>
        </div>
        {/* Line Chart with Glass effect */}
        <div className="flex-1 bg-white/70 dark:bg-white/10 rounded-xl p-6 backdrop-blur-sm shadow-lg mt-6 md:mt-0">
          <div className="h-44 md:h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={makeLineData(m.forecast)}>
                <defs>
                  <linearGradient id={`grad-${m.id}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#b7d2f7" stopOpacity={0.8} />
                    <stop offset="80%" stopColor="#bfcfdc" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ef" />
                <XAxis dataKey="name" tick={{ fill: "#557399", fontWeight: 600 }} />
                <YAxis tick={{ fill: "#557399", fontWeight: 600 }} />
                <ReTooltip contentStyle={{ background: "#eef3f8", borderRadius: 8, color: "#222" }} />
                <ReLegend verticalAlign="bottom" height={16} wrapperStyle={{ color: "#b7d2f7" }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={`url(#grad-${m.id})`}
                  strokeWidth={4}
                  dot={{ r: 4, stroke: "#e0f3fa", fill: "#b7d2f7" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-[#557399]/90 dark:text-orange-50/90">7-Week projection</div>
            <div className="font-bold text-lg text-[#2d2a1f] dark:text-white drop-shadow">
              {Array.isArray(m.forecast) ? m.forecast[m.forecast.length - 1] : "-"} {m.unit}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
