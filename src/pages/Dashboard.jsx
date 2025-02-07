import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Line, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const pieData = {
    labels: ["5 ★", "4 ★", "3 ★", "2 ★", "1 ★"],
    datasets: [
      {
        data: [1259, 374, 159, 55, 29],
        backgroundColor: [
          "#4CAF50",
          "#2196F3",
          "#FFC107",
          "#FF5722",
          "#9C27B0",
        ],
      },
    ],
  };

  const lineData = {
    labels: Array.from({ length: 12 }, (_, i) => i + 1),
    datasets: [
      {
        label: "Bookings",
        data: [
          5000, 7000, 6080, 7800, 7590, 7500, 8200, 6500, 6780, 7000, 8000,
          8590,
        ],
        borderColor: "#FF5733",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const revenueData = {
    labels: [
      "01/01/2024",
      "01/02/2024",
      "01/03/2024",
      "01/04/2024",
      "01/05/2024",
      "01/06/2024",
      "01/07/2024",
      "01/08/2024",
      "01/09/2024",
      "01/10/2024",
      "01/11/2024",
      "01/12/2024",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [
          6500, 7200, 6400, 8200, 7600, 8400, 7900, 8700, 9100, 8600, 9500,
          10220,
        ],
        borderColor: "#48AAAD",
        backgroundColor: "#48AAAD",
        borderWidth: 2,
        pointBackgroundColor: "#48AAAD",
        pointBorderColor: "#fff",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="flex p-5">
      <div className="w-11/12">
        <h1 className="text-2xl font-semibold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mb-10">
          <div className="bg-white shadow-md p-5">
            <h2 className="text-xl font-semibold mb-4">Customers' review</h2>
            <div className="h-80">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white shadow-md p-5">
            <h2 className="text-xl font-semibold mb-4">Number of booking</h2>
            <div className="h-80">
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md p-5 mb-10">
          <h2 className="text-xl font-semibold mb-4">Revenue</h2>
          <div className="h-80">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
