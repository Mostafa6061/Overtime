import "./App.css";
import React, { useState, useEffect } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "./components/ui/components/ui/chart.jsx";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import TotalDifference from "./TotalDifference.jsx";
function FirstChart({ chartData, monthlyWorkingHours, chartName, chartColor }) {
  const processChartData = () => {
    if (!Array.isArray(chartData)) return [];

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();

    const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    const monthlyData = chartData.reduce((acc, entry) => {
      const startDate = new Date(entry.start);
      const stopDate = new Date(entry.stop);
      const entryYear = startDate.getFullYear();
      const entryMonth = startDate.getMonth();
      const month = startDate.toLocaleString("en-US", { month: "short" });

      const diffHours = (stopDate - startDate) / (1000 * 60 * 60);
      const daysInMonth = daysInMonths[entryMonth];

      const isFullMonthCompleted =
        entryYear < currentYear ||
        (entryYear === currentYear &&
          (entryMonth < currentMonth ||
            (entryMonth === currentMonth && currentDay === daysInMonth)));

      const expectedHours = isFullMonthCompleted
        ? monthlyWorkingHours
        : (monthlyWorkingHours / daysInMonth) * currentDay;

      if (!acc[month]) {
        acc[month] = {
          month,
          difference: diffHours - expectedHours,
        };
      } else {
        acc[month].difference += diffHours;
      }

      return acc;
    }, {});

    return Object.values(monthlyData).sort((a, b) => {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });
  };

  const processedData = processChartData();
  console.log(processedData);

  const chartConfig = {
    difference: {
      label: "overtime",
      color: chartColor,
    },
  };

  return (
    <>
      <TotalDifference difference={processedData} chartName={chartName} />
      <ChartContainer config={chartConfig} className="min-h-[200px] h-50 w-1xl">
        <BarChart data={processedData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis />

          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="difference" fill={chartColor} radius={6} />
        </BarChart>
      </ChartContainer>
      <ChartContainer
        config={chartConfig}
        className="min-h-[200px] h-50 w-1xl mt-8"
      >
        <LineChart data={processedData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />

          <Line type="monotone" dataKey="difference" stroke={chartColor} />
        </LineChart>
      </ChartContainer>
    </>
  );
}

export default FirstChart;
