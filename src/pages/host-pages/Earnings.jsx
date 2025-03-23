import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { format, parseISO } from "date-fns";

// Convert number to VND format
const formatVND = (amount) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

const Earnings = () => {
  const [view, setView] = useState("daily");

  // Get the first and last day of the current month
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(lastDayOfMonth);
  const { user } = useUser();
  const [filteredData, setFilteredData] = useState([]);

  // Call API for earnings data
  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        console.log('Fetching earnings data for user:', user.id);
        console.log('Start Date:', startDate.toISOString().split('T')[0]);
        console.log('End Date:', endDate.toISOString().split('T')[0]);

        const response = await axios.get(`${import.meta.env.VITE_API_REVENUE}/${user.id}`, {
          params: {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            interval: view,
          }
        });

        const profitList = response.data.data.profitList || [];
        const formattedData = profitList.map((item) => ({
          date: item.date,
          earnings: item.totalRevenue,
        }));

        setFilteredData(formattedData);
      } catch (error) {
        console.error('Error fetching earnings data:', error);
      }
    };

    fetchEarningsData();
  }, [startDate, endDate, user, view]);

  return (
    <div className="p-11">
      {/* Earnings Title */}
      <h1 className="text-3xl font-bold">You've made</h1>
      <h2 className="text-4xl font-bold text-gray-500">
        {formatVND(filteredData.reduce((sum, item) => sum + item.earnings, 0))}
      </h2>

      {/* Date Range Picker */}
      <div className="flex space-x-4 items-center mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="p-2 border rounded"
          />
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          className={`px-4 py-1 rounded-full text-sm font-medium transition ${view === "daily" ? "bg-black text-white" : "bg-gray-100 text-black"}`}
          onClick={() => setView("daily")}
        >
          Daily
        </button>
        <button
          className={`px-4 py-1 rounded-full text-sm font-medium transition ${view === "monthly" ? "bg-black text-white" : "bg-gray-100 text-black"}`}
          onClick={() => setView("monthly")}
        >
          Monthly
        </button>
      </div>

      {/* Earnings Chart */}
      <div className="mt-10 h-96 w-full px-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <XAxis
              height={90}
              dataKey="date"
              tick={{ angle: -25, textAnchor: "end" }}
              tickFormatter={(date) => {
                if (view === "monthly") {
                  return format(parseISO(date), "MMMM"); // Full month name
                }
                return format(parseISO(date), "MM-dd"); // Example: "03-15" for daily view
              }}
            />
            <YAxis width={100} tickFormatter={(value) => formatVND(value)} />
            <Tooltip formatter={(value) => formatVND(value)} />
            <Line type="monotone" dataKey="earnings" stroke="black" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Earnings;
