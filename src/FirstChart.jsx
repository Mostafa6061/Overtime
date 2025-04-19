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
import { hamburgHolidays } from "./holidays.js";
import TotalDifference from "./TotalDifference.jsx";

function FirstChart({
  chartData,
  monthlyWorkingHours,
  chartName,
  chartColor,
  holidayData,
}) {
  console.log(holidayData);
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

      let vacationDaysInMonth = 0;
      if (holidayData && Array.isArray(holidayData)) {
        holidayData.forEach((vacation) => {
          const vacationStart = new Date(vacation.start_date);
          const vacationEnd = new Date(vacation.end_date);

          // Check if vacation overlaps with current month
          if (
            (vacationStart.getFullYear() === entryYear &&
              vacationStart.getMonth() === entryMonth) ||
            (vacationEnd.getFullYear() === entryYear &&
              vacationEnd.getMonth() === entryMonth)
          ) {
            // Calculate the portion of vacation in this month
            let monthVacationDays = 0;
            const currentDate = new Date(vacationStart);

            while (currentDate <= vacationEnd) {
              const dateString = currentDate.toISOString().split("T")[0];
              if (
                currentDate.getFullYear() === entryYear &&
                currentDate.getMonth() === entryMonth &&
                !hamburgHolidays.includes(dateString) &&
                currentDate.getDay() !== 0 &&
                currentDate.getDay() !== 6
              ) {
                monthVacationDays++;
              }
              currentDate.setDate(currentDate.getDate() + 1);
            }

            vacationDaysInMonth += monthVacationDays;
          }
        });
      }

      const isFullMonthCompleted =
        entryYear < currentYear ||
        (entryYear === currentYear &&
          (entryMonth < currentMonth ||
            (entryMonth === currentMonth && currentDay === daysInMonth)));

      const adjustedDaysInMonth = daysInMonth - vacationDaysInMonth;
      const expectedHours = isFullMonthCompleted
        ? (monthlyWorkingHours / daysInMonth) * adjustedDaysInMonth
        : (monthlyWorkingHours / daysInMonth) *
          Math.min(currentDay, adjustedDaysInMonth);

      if (!acc[month]) {
        acc[month] = {
          month,
          difference: diffHours - expectedHours,
          vacationDays: vacationDaysInMonth,
        };
      } else {
        acc[month].difference += diffHours;
        acc[month].vacationDays = vacationDaysInMonth;
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
  // console.log(processedData);

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
