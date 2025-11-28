import ModelComparisionTable from "../components/ModelComparisionTable";
import ModelMetricsBarChart from "../components/charts/ModelMetricsBarChart";
import ModelRadarChart from "../components/charts/ModelRadarChart";

export default function ModelDashboard() {
  const modelResults = [
    { name: "LSTM", mae: 8.2, rmse: 11.9, mape: 5.4, trainingTime: 21.4, inferenceSpeed: 1.2 },
    { name: "Random Forest", mae: 10.1, rmse: 14.7, mape: 7.1, trainingTime: 3.8, inferenceSpeed: 0.9 },
    { name: "ARIMA", mae: 12.5, rmse: 18.3, mape: 9.8, trainingTime: 4.2, inferenceSpeed: 0.5 },
  ];

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Model Comparison Dashboard
      </h2>

      <ModelMetricsBarChart models={modelResults} />
      <ModelRadarChart models={modelResults} />
      <ModelComparisonTable models={modelResults} />
    </div>
  );
}
