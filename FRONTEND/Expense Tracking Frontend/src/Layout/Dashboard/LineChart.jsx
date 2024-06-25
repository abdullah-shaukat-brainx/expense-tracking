import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import moment from "moment";

const LineChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const labels = data.map((entry) => moment(entry.date).format("D MMMM YYYY"));
      const cumulativeAmounts = data.map((entry) => entry.cumulativeAmount);

      const myChart = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Cumulative Amount",
              data: cumulativeAmounts,
              fill: false,
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.4)",
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: "Days",
              },
            },
            y: {
              title: {
                display: true,
                text: "Cumulative Amount",
              },
              beginAtZero: true,
            },
          },
        },
      });

      return () => {
        myChart.destroy();
      };
    }
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default LineChart;
