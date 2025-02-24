import "./App.css";
import React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "./components/ui/components/ui/chart.jsx";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

function App() {
  const chartData = [
    { month: "January", overtime: 186 },
    { month: "February", overtime: 200 },
    { month: "March", overtime: 150 },
    { month: "April", overtime: 180 },
    { month: "May", overtime: 210 },
    { month: "June", overtime: 220 },
    { month: "July", overtime: 230 },
    { month: "August", overtime: 240 },
    { month: "September", overtime: 250 },
    { month: "October", overtime: 260 },
    { month: "November", overtime: 270 },
    { month: "December", overtime: 280 },
  ];

  const chartConfig = {
    overtime: {
      label: "Overtime",
      color: "#2563eb",
    },
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <ChartContainer config={chartConfig} className="min-h-[200px] h-60 w-3xl">
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
