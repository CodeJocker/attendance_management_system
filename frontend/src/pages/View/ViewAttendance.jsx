import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../api";
import { FaCalendarAlt, FaDownload, FaUserCheck, FaUserTimes, FaUserClock } from "react-icons/fa";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

const ViewAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchDate, setSearchDate] = useState(new Date());

  useEffect(() => {
    fetchAttendanceData();
  }, [searchDate]);

  const fetchAttendanceData = async () => {
    setIsLoading(true);
    try {
      const formattedDate = format(searchDate, "yyyy-MM-dd");
      const response = await api.get("/api/attendance/retrieve/by-date/", {
        params: { date: formattedDate },
      });
      setAttendanceData(response.data || []);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching attendance data:", err);
      setError(`Failed to fetch attendance data: ${err.message}`);
      setIsLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSearchDate(date);
  };

  const generatePDF = async () => {
    if (attendanceData.length > 0) {
      const blob = await pdf(<AttendanceReportPDF reportData={attendanceData} date={searchDate} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `attendance_report_${format(searchDate, "yyyy-MM-dd")}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600 bg-red-100 rounded-lg m-4">
        <p className="font-bold">Error:</p>
        <p>{error}</p>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "PRESENT":
        return <FaUserCheck className="text-green-500" />;
      case "LATE":
        return <FaUserClock className="text-yellow-500" />;
      case "ABSENT":
        return <FaUserTimes className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-indigo-800 text-center">Member Attendance</h1>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
              <div className="relative w-full sm:w-auto mb-4 sm:mb-0">
                <DatePicker
                  selected={searchDate}
                  onChange={handleDateChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pl-10 p-2"
                  placeholderText="Select a date"
                  dateFormat="MMMM d, yyyy"
                />
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button
                onClick={generatePDF}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center w-full sm:w-auto justify-center"
                disabled={attendanceData.length === 0}
              >
                <FaDownload className="mr-2" />
                Download PDF Report
              </button>
            </div>

            {/* Table for large screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceData.length > 0 ? (
                    attendanceData.map((attendance) => (
                      <tr key={attendance.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {attendance.user.FirstName} {attendance.user.LastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(attendance.DateAttended), "MMMM d, yyyy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="flex items-center">
                            {getStatusIcon(attendance.status)}
                            <span className="ml-2">{attendance.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                        No attendance records found for the selected date
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Cards for mobile screens */}
            <div className="md:hidden space-y-4">
              {attendanceData.length > 0 ? (
                attendanceData.map((attendance) => (
                  <div key={attendance.id} className="bg-white shadow rounded-lg p-4">
                    <div className="font-medium text-lg mb-2">
                      {attendance.user.FirstName} {attendance.user.LastName}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {format(new Date(attendance.DateAttended), "MMMM d, yyyy")}
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(attendance.status)}
                      <span className="ml-2">{attendance.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No attendance records found for the selected date
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAttendance;