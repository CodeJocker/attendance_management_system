import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaCheck, FaClock } from "react-icons/fa";

const Mark = ({ data }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    try {
      const attendanceData = data.map((member) => ({
        user: member.id,
        status: formData[member.id]?.present
          ? formData[member.id]?.late
            ? "LATE"
            : "PRESENT"
          : "ABSENT",
        date: selectedDate.toISOString().split("T")[0],
      }));

      const res = await api.post("/api/attendance/create/", attendanceData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200) {
        toast.success("Attendance marked successfully");
        navigate("/view-attendance");
      } else {
        toast.error("Error marking attendance");
      }
      reset();
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast.error("Failed to mark attendance");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Mark Attendance</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
            Select Date
          </label>
          <div className="relative">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pl-10 p-2 bg-white border"
              placeholderText="Select a date"
              dateFormat="MMMM d, yyyy"
            />
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((member) => (
              <div key={member.id} className="bg-gray-100 border border-slate-500 p-4 rounded-lg shadow">
                <div className="flex items-center mb-2">
                  <img
                    className="w-10 h-10 rounded-full mr-2"
                    src={member.image}
                    alt={member.username}
                  />
                  <span className="font-medium text-sm">
                    {member.FirstName} {member.LastName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register(`${member.id}.present`)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-sm">Present</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register(`${member.id}.late`)}
                      className="form-checkbox h-5 w-5 text-yellow-600"
                    />
                    <span className="ml-2 text-sm">Late</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Mark Attendance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Mark;