// src/components/ForecastVisualizations.jsx

import React, { useState } from "react";
import Plot from "react-plotly.js";

export default function ForecastVisualizations() {
  // ------------------ NEW STATES (Enhancements) ------------------
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [model, setModel] = useState("arima");

  // ------------------ STATIC DEMO DATA ------------------
  const dates = ["2024-01", "2024-02", "2024-03", "2024-04", "2024-05"];
  const actual = [120, 130, 140, 135, 150];
  const forecast = [155, 160, 165, 170, 175];
  const lower95 = [148, 152, 158, 164, 167];
  const upper95 = [162, 168, 172, 178, 183];

  // ------------------ CSV DOWNLOAD FUNCTION ------------------
  const downloadCSV = () => {
    let csv = "date,actual,forecast,lower95,upper95\n";
    dates.forEach((d, i) => {
      csv += `${d},${actual[i]},${forecast[i]},${lower95[i]},${upper95[i]}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `forecast_${model}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Forecast Visualizations
      </h2>

      {/* ================= USER INTERACTION ENHANCEMENTS ================= */}
      <div className="flex flex-wrap gap-4 mb-10 items-center">

        {/* Date Range - Start */}
        <div>
          <label className="mr-2">Start:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>

        {/* Date Range - End */}
        <div>
          <label className="mr-2">End:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>

        {/* Model Switch Buttons */}
        <div className="flex gap-2">
          {["arima", "xgboost", "lstm"].map((m) => (
            <button
              key={m}
              onClick={() => setModel(m)}
              className={`px-3 py-1 rounded capitalize ${
                model === m ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Download Button */}
        <button
          onClick={downloadCSV}
          className="px-4 py-1 bg-green-600 text-white rounded"
        >
          Download CSV
        </button>
      </div>

      {/* ===================== CHARTS SECTION ===================== */}
      <div className="space-y-12">

        {/* ------------ 1. Historical + Forecast Trend ------------ */}
        <Plot
          data={[
            { x: dates, y: actual, mode: "lines+markers", name: "Historical" },
            {
              x: dates,
              y: forecast,
              mode: "lines",
              name: "Forecast",
              line: { dash: "dash" },
            },
          ]}
          layout={{
            title: "Historical + Forecast Trend",
            height: 380,
            hovermode: "x unified",
          }}
          style={{ width: "100%" }}
        />

        {/* ------------ 2. Forecast with 95% Confidence Interval ------------ */}
        <Plot
          data={[
            {
              x: [...dates, ...dates.slice().reverse()],
              y: [...upper95, ...lower95.slice().reverse()],
              fill: "toself",
              fillcolor: "rgba(0,150,200,0.15)",
              line: { color: "transparent" },
              hoverinfo: "skip",
              name: "95% CI",
            },
            { x: dates, y: forecast, mode: "lines", name: "Forecast" },
          ]}
          layout={{
            title: "Forecast with 95% Confidence Interval",
            height: 380,
            hovermode: "x unified",
          }}
          style={{ width: "100%" }}
        />

        {/* ------------ 3. Actual vs Predicted ------------ */}
        <Plot
          data={[
            { x: dates, y: actual, mode: "lines+markers", name: "Actual" },
            {
              x: dates,
              y: forecast,
              mode: "lines+markers",
              name: "Predicted",
            },
          ]}
          layout={{
            title: "Actual vs Predicted",
            height: 360,
            hovermode: "x unified",
          }}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}
