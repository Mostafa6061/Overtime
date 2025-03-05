import "./App.css";
import React, { useState, useEffect } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "./components/ui/components/ui/chart.jsx";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import API_DATA from "./components/ui/components/ui/dummy.json";

function App() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/toggle");

        const data = await response.json();

        const overtimeData = data.reduce((acc, entry) => {
          entry.time_entries.forEach(({ start, stop }) => {
            if (!start || !stop) return;

            const startDate = new Date(start);
            const stopDate = new Date(stop);
            const month = startDate.toLocaleString("en-US", { month: "long" });
            const overtime = (stopDate - startDate) / 3600000;

            acc[month] = (acc[month] || 0) + overtime;
          });
          return acc;
        }, {});

        const formattedData = Object.keys(overtimeData).map((month) => ({
          month,
          overtime: overtimeData[month],
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

  const chartConfig = {
    overtime: {
      label: "Overtime",
      color: "#2563eb",
    },
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <ChartContainer config={chartConfig} className="min-h-[200px] h-50 w-1xl">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="overtime" fill="var(--color-overtime)" radius={6} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

export default App;
