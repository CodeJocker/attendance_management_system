import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../api";
import {
  FaCalendarAlt,
  FaDownload,
  FaUserCheck,
  FaUserTimes,
  FaUserClock,
} from "react-icons/fa";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Font,
} from "@react-pdf/renderer";

// Register custom fonts
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700,
    },
  ],
});

  const ViewAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchDate, setSearchDate] = useState(new Date());

  const fetchAttendanceData = useCallback(async () => {
    setIsLoading(true);
    try {
      const formattedDate = format(searchDate, "yyyy-MM-dd");
      const response = await api.get("/api/attendance/retrieve/by-date/", {
        params: { date: formattedDate },
      });
      setAttendanceData(response.data || []);
    } catch (err) {
      console.error("Error fetching attendance data:", err);
      setError(`Failed to fetch attendance data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [searchDate]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  const handleDateChange = (date) => {
    setSearchDate(date);
  };

  const generatePDF = async () => {
    if (attendanceData.length > 0) {
      const blob = await pdf(
        <AttendanceReportPDF reportData={attendanceData} date={searchDate} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `attendance_report_${format(
        searchDate,
        "yyyy-MM-dd"
      )}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

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

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-indigo-800 text-center">
          Member Attendance
        </h1>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
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
                          {format(
                            new Date(attendance.DateAttended),
                            "MMMM d, yyyy"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="flex items-center">
                            {getStatusIcon(attendance.status)}
                            <span className="ml-2">
                              {attendance.status === "PRESENT"
                                ? "Stock In"
                                : attendance.status === "ABSENT"
                                ? "Stock Out"
                                : attendance.status}
                            </span>
                          </span>
                        </td>

                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="flex items-center">
                            {getStatusIcon(attendance.status)}
                            <span className="ml-2">{attendance.status}</span>
                          </span>
                        </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No Product records found for the selected date
                        {/* No attendance records found for the selected date */}
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
                  <div
                    key={attendance.id}
                    className="bg-white shadow rounded-lg p-4"
                  >
                    <div className="font-medium text-lg mb-2">
                      {attendance.user.FirstName} {attendance.user.LastName}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {format(
                        new Date(attendance.DateAttended),
                        "MMMM d, yyyy"
                      )}
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(attendance.status)}
                      <span className="ml-2">{attendance.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No Product records found for the selected date
                  {/* No attendance records found for the selected date */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AttendanceReportPDF = ({ reportData, date }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.organizationName}>XYZ SHOP</Text>
        {/* <Text style={styles.organizationName}>Cellule Yasipi</Text> */}
        <View>
          <Text style={styles.title}>Product Report</Text>
          {/* <Text style={styles.title}>Attendance Report</Text> */}
          <Text style={styles.date}>{format(date, "MMMM d, yyyy")}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.nameCell]}>Name</Text>
          <Text style={[styles.tableCell, styles.dateCell]}>Date</Text>
          <Text style={[styles.tableCell, styles.statusCell]}>Status</Text>
        </View>
        {reportData.map((attendance) => (
          <View style={styles.tableRow} key={attendance.id}>
            <Text
              style={[styles.tableCell, styles.nameCell]}
            >{`${attendance.user.FirstName} ${attendance.user.LastName}`}</Text>
            <Text style={[styles.tableCell, styles.dateCell]}>
              {format(new Date(attendance.DateAttended), "MMMM d, yyyy")}
            </Text>
            <Text style={[styles.tableCell, styles.statusCell]}>
              {attendance.status}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        Generated on {format(new Date(), "MMMM d, yyyy 'at' h:mm a")} | Page 1
        of 1
      </Text>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Roboto",
    fontSize: 12,
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },
  organizationName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    marginBottom: 20,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableCell: {
    margin: "auto",
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  nameCell: {
    width: "40%",
  },
  dateCell: {
    width: "35%",
  },
  statusCell: {
    width: "25%",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "grey",
  },
});

export default ViewAttendance;
