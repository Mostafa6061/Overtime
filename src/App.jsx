import "./App.css";

import CoolButton from "./Button.jsx";

import React, { useState, useEffect } from "react";

import FirstChart from "./FirstChart.jsx";
import { hamburgHolidays } from "./holidays.js";

const apiKey = import.meta.env.VITE_SERVER_HOST;
const apiKey2 = import.meta.env.VITE_SERVER_HOST2;

function App() {
  const [chartData, setChartData] = useState([]);
  const [holidayData, setHolidayData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHolidayData = async () => {
    try {
      const response = await fetch(apiKey2);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const holidayData = data.results.reduce((acc, entry) => {
        const person = entry.properties.Person.people[0];
        if (!person) {
          return acc;
        }

        const startDate = new Date(entry.properties.Date.date.start);
        const endDate = new Date(entry.properties.Date.date.end);

        // Function to check if a date is a weekend
        const isWeekend = (date) => {
          const day = date.getDay();
          return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
        };

        // Calculate working days (excluding weekends)
        let workingDays = 0;
        let officialHolidayCount = 0;
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          const dateString = currentDate.toISOString().split("T")[0];
          if (!isWeekend(currentDate)) {
            workingDays++;
            // Check if the day is an official holiday
            if (hamburgHolidays.includes(dateString)) {
              officialHolidayCount++;
            }
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }

        // Calculate total days including weekends
        const diffTime = Math.abs(endDate - startDate); //.abs sorgt dafür dass der Wert positiv ist
        const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; //.ceil sorgt dafür dass der Wert aufgerundet wird

        const holidayEntry = {
          start_date: entry.properties.Date.date.start,
          end_date: entry.properties.Date.date.end,
          total_days: totalDays,
          working_days: workingDays,
          official_holidays: officialHolidayCount,
          actual_vacation_days: workingDays - officialHolidayCount,
        };

        if (!acc[person.name]) {
          acc[person.name] = [holidayEntry];
        } else {
          acc[person.name].push(holidayEntry);
        }

        return acc;
      }, {});

      console.log("Formatted holiday data:", holidayData);
      setHolidayData(holidayData);
    } catch (error) {
      console.error("Error fetching holiday data:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiKey);

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
    fetchHolidayData();
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
          holidayData={holidayData["Mostafa Bahadori"]}
          chartData={chartData["11418541"]}
          monthlyWorkingHours={32}
          chartName={"Mostafa"}
          chartColor={"#2563eb"}
        />
      </div>
      <CoolButton onClick={fetchData} />
      <div className="flex flex-row justify-center space-x-5 items-center ">
        <FirstChart
          holidayData={holidayData["Konstantin Münster"]}
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
