import React from "react";
import FirstChart from "./FirstChart";
const TotalDifference = ({ difference, chartName }) => {
  const totalDifference = difference.reduce((acc, { difference }) => {
    return acc + difference;
  }, 0);
  //   console.log(totalDifference);

  return (
    <div className="mb-4">
      <strong>{chartName}'s total overtime: </strong>
      {totalDifference.toFixed(1)} hours
    </div>
  );
};

export default TotalDifference;
