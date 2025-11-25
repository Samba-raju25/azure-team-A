// src/components/ForecastVisualizations.jsx
import React from "react";
import Plot from "react-plotly.js";

export default function ForecastVisualizations() {
  const dates = ["2024-01","2024-02","2024-03","2024-04","2024-05"];
  const actual = [120,130,140,135,150];
  const forecast = [155,160,165,170,175];
  const lower95 = [148,152,158,164,167];
  const upper95 = [162,168,172,178,183];

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Forecast Visualizations
      </h2>

      <div className="space-y-12">
        {/* 1. Historical + Forecast */}
        <Plot
          data={[
            { x: dates, y: actual, mode: "lines+markers", name: "Historical" },
            { x: dates, y: forecast, mode: "lines", name: "Forecast", line: { dash: "dash" } }
          ]}
          layout={{ title: "Historical + Forecast Trend", height: 380 }}
          style={{ width: "100%" }}
        />

        {/* 2. Confidence Interval */}
        <Plot
          data={[
            {
              x: [...dates, ...dates.slice().reverse()],
              y: [...upper95, ...lower95.slice().reverse()],
              fill: "toself",
              fillcolor: "rgba(0,150,200,0.15)",
              line: { color: "transparent" },
              hoverinfo: "skip",
              name: "95% CI"
            },
            { x: dates, y: forecast, mode: "lines", name: "Forecast" }
          ]}
          layout={{ title: "Forecast with 95% Confidence Interval", height: 380 }}
          style={{ width: "100%" }}
        />

        {/* 3. Actual vs Predicted */}
        <Plot
          data={[
            { x: dates, y: actual, mode: "lines+markers", name: "Actual" },
            { x: dates, y: forecast, mode: "lines+markers", name: "Predicted" }
          ]}
          layout={{ title: "Actual vs Predicted", height: 360 }}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}
