import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(
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
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(lastDayOfMonth);
  const [frequency, setFrequency] = useState("daily");
  const [data, setData] = useState({ profitList: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_REVENUE}/system`, {
          params: {
            startDate,
            endDate,
            interval: frequency,
          },
      });
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [startDate, endDate, frequency]);

  const filteredData = data.profitList;
  const labels = filteredData.map((entry) => entry.date);
  const revenueData = filteredData.map((entry) => entry.totalRevenue);
  const profitData = filteredData.map((entry) => entry.totalProfit);

  const revenueChart = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: revenueData,
        borderColor: "#48AAAD",
        backgroundColor: "rgba(72, 170, 173, 0.2)",
        borderWidth: 2,
        pointBackgroundColor: "#48AAAD",
        tension: 0.3,
      },
    ],
  };

  const profitChart = {
    labels,
    datasets: [
      {
        label: "Profit",
        data: profitData,
        backgroundColor: "#4CAF50",
      },
    ],
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white shadow-md p-5">
          <h2 className="text-xl font-semibold mb-4">Revenue Over Time</h2>
          <div className="h-80">
            <Line data={revenueChart} options={{ responsive: true }} />
          </div>
        </div>
        <div className="bg-white shadow-md p-5">
          <h2 className="text-xl font-semibold mb-4">Profit Overview</h2>
          <div className="h-80">
            <Bar data={profitChart} options={{ responsive: true }} />
          </div>
        </div>
      </div>
      <div className="mt-6 p-5 bg-white shadow-md">
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <p>Total Revenue: {revenueData.reduce((a, b) => a + b, 0).toLocaleString()} VND</p>
        <p>Total Profit: {profitData.reduce((a, b) => a + b, 0).toLocaleString()} VND</p>
      </div>
    </div>
  );
};

export default Dashboard;
