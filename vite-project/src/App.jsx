import "./App.css";

import CoolButton from "./Button.jsx";

import React, { useState, useEffect } from "react";

import FirstChart from "./FirstChart.jsx";

function App() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/api/toggle");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const overtimeData = data.reduce((acc, entry) => {
        const timeEntries = entry.time_entries;

        const existingEntries = acc[entry.user_id];

        if (!existingEntries) {
          acc[entry.user_id] = [...timeEntries];
        } else {
          acc[entry.user_id] = [...existingEntries, ...timeEntries];
        }

        return acc;
      }, {});

      setChartData(overtimeData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col space-y-40 justify-center items-center">
      <div className="flex flex-row justify-center space-x-5 items-center ">
        <FirstChart
          chartData={chartData["11418541"]}
          monthlyWorkingHours={32}
          chartName={"Mostafa"}
          chartColor={"#2563eb"}
        />
      </div>
      <CoolButton onClick={fetchData} />
      <div className="flex flex-row justify-center space-x-5 items-center ">
        <FirstChart
          chartData={chartData["11841329"]}
          monthlyWorkingHours={8}
          chartName={"Sönke"}
          chartColor={"#95AD61"}
        />
      </div>
    </div>
  );
}

export default App;
