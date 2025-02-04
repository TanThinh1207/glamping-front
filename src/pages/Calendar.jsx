import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr); 
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth",
          }}
          height="100%"
        />
      </div>
      {selectedDate && (
        <div className="w-1/4 bg-gray-100 p-4 shadow-lg border-l">
          <h2 className="text-lg font-semibold">{selectedDate}</h2>
          <p className="mt-2 text-xl font-bold">₫254,000</p>
          <p className="text-gray-600">Guest total: ₫289,859</p>

          <button className="mt-4 p-2 w-full bg-black text-white rounded-md">
            Open
          </button>
          <button className="mt-2 p-2 w-full bg-gray-200 rounded-md">
            Block night
          </button>

          <div className="mt-4 space-y-2">
            <button className="w-full p-2 border rounded-md">
              View similar listings
            </button>
            <button className="w-full p-2 border rounded-md">
              Add custom trip length
            </button>
            <button className="w-full p-2 border rounded-md">
              Add a private note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
