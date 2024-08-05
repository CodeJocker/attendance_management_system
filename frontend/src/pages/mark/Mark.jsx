import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const Mark = ({ data }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    try {
      const attendanceData = data.map((member) => {
        let status = 'ABSENT';
        if (formData[member.id]?.present) {
          status = formData[member.id]?.late ? 'LATE' : 'PRESENT';
        }
        return {
          user: member.id,
          status: status,
          date: selectedDate.toISOString().split('T')[0], // Changed to 'date'
        };
      });

      console.log("Submitting attendance data:", attendanceData);

      const res = await api.post("/api/attendance/create/", attendanceData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200) {
        toast.success("Attendance marked successfully");
        navigate("/view");
      } else {
        toast.error("Error marking attendance");
      }
      reset();
    } catch (error) {
      console.error("Error submitting attendance:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
      }
      toast.error("Failed to mark attendance");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Mark Attendance</h2>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
          Select Date
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white shadow-md rounded my-6">
          <table className="min-w-max w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-center">Present</th>
                <th className="py-3 px-6 text-center">Late</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {data.map((member) => (
                <tr key={member.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="mr-2">
                        <img className="w-6 h-6 rounded-full" src={member.image} alt={member.username} />
                      </div>
                      <span className="font-medium">
                        {member.FirstName} {member.LastName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <input
                      type="checkbox"
                      {...register(`${member.id}.present`)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                  </td>
                  <td className="py-3 px-6 text-center">
                    <input
                      type="checkbox"
                      {...register(`${member.id}.late`)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Mark Attendance
          </button>
        </div>
      </form>
    </div>
  );
};

export default Mark;
