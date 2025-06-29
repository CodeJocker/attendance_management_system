import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  FaPhone,
  FaBirthdayCake,
  FaCalendarCheck,
  FaUser,
  FaChartPie,
  FaListAlt,
  FaMoneyBill,
} from "react-icons/fa";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { motion } from "framer-motion";
import { Tab } from "@headlessui/react";
import api from "../../api";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await api.get(`/api/retrieve/user/${id}/`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("Failed to fetch user details");
    }
  }, [id]);

  const fetchUserAttendance = useCallback(async () => {
    try {
      const response = await api.get(`/api/attendance/retrieve/stats/${id}/`);
      setAttendanceData(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching user attendance statistics:", error);
      setError("Failed to fetch attendance statistics");
    }
  }, [id]);

  const fetchAttendanceHistory = useCallback(async () => {
    try {
      const response = await api.get(`/api/attendance/retrieve/${id}/`);
      if (Array.isArray(response.data)) {
        setAttendanceHistory(response.data);
      } else {
        console.error('Attendance history data is not an array:', response.data);
        setAttendanceHistory([]);
      }
    } catch (error) {
      console.error("Error fetching attendance history:", error);
      setError("Failed to fetch attendance history");
      setAttendanceHistory([]);
    }
  }, [id]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([fetchUserDetails(), fetchUserAttendance(), fetchAttendanceHistory()]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load user data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserDetails, fetchUserAttendance, fetchAttendanceHistory]);

  useEffect(() => {
    console.log("UserDetails component mounted");
    fetchData();
    return () => {
      console.log("UserDetails component unmounted");
    };
  }, [fetchData]);

  const pieChartData = useMemo(() => {
    if (!attendanceData) {
      return { labels: [], datasets: [{ data: [] }] };
    }
    return {
      labels: ["Present", "Late", "Absent"],
      datasets: [
        {
          data: [attendanceData.presentCount, attendanceData.lateCount, attendanceData.absentCount],
          backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
          hoverBackgroundColor: ["#45a049", "#e6ac00", "#da190b"],
        },
      ],
    };
  }, [attendanceData]);

  const barChartData = useMemo(() => {
    if (!Array.isArray(attendanceHistory)) {
      console.error('attendanceHistory is not an array:', attendanceHistory);
      return { labels: [], datasets: [{ data: [] }] };
    }
    return {
      labels: attendanceHistory.map(entry => format(new Date(entry.date), "MMM d")),
      datasets: [
        {
          label: "Attendance",
          data: attendanceHistory.map(entry => entry.status === "PRESENT" ? 1 : entry.status === "LATE" ? 0.5 : 0),
          backgroundColor: attendanceHistory.map(entry => 
            entry.status === "PRESENT" ? "#4CAF50" : entry.status === "LATE" ? "#FFC107" : "#F44336"
          ),
        },
      ],
    };
  }, [attendanceHistory]);

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          callback: function(value) {
            if (value === 0) return "Absent";
            if (value === 0.5) return "Late";
            if (value === 1) return "Present";
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Recent Attendance History",
      },
    },
  };

  console.log("Rendering UserDetails", { user, attendanceData, attendanceHistory });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-2">Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!user || !attendanceData) {
    return <div className="text-center text-red-500">No user data available. Please try again.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              className="h-auto w-full object-cover md:w-48"
              src={user.image}
              alt={`${user.FirstName} ${user.LastName}`}
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              Product Details
              {/* User Profile */}
            </div>
            <h2 className="mt-1 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {user.FirstName} {user.LastName}
            </h2>
            <p className="mt-2 text-gray-500">
              <FaUser className="inline mr-2" aria-label="Username" />
              {user.username}
            </p>
            <p className="mt-2 text-gray-500">
              <FaPhone className="inline mr-2" aria-label="Phone number" />
              {user.Tel}
            </p>
            <p className="mt-2 text-gray-500">
              <FaMoneyBill className="inline mr-2" aria-label="Phone number" />
              5000
            </p>
            <p className="mt-2 text-gray-500">
              <FaBirthdayCake className="inline mr-2" aria-label="Date of birth" />
              {format(new Date(user.DateOfBirth), "dd/MM/yyyy")}
            </p>
            <p className="mt-2 text-gray-500">
              <FaCalendarCheck className="inline mr-2" aria-label="Date of church entry" />
              Product Register Date: {format(new Date(user.DateOfChurchEntry), "dd/MM/yyyy")}
              {/* Joined church: {format(new Date(user.DateOfChurchEntry), "dd/MM/yyyy")} */}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Tab.Group>
          <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
            <Tab
              className={({ selected }) =>
                `w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg
                 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60
                 ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
              }
            >
              <FaChartPie className="inline mr-2" aria-label="Statistics" />
              Statistics
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg
                 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60
                 ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
              }
            >
              <FaListAlt className="inline mr-2" aria-label="History" />
              History
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel className="bg-white rounded-xl p-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-64">
                  <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
                <div>
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Total Attendance</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {attendanceData.totalAttendance}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Present</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {attendanceData.presentCount}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Late</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {attendanceData.lateCount}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Absent</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {attendanceData.absentCount}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Attendance Rate</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {(((attendanceData.presentCount + attendanceData.lateCount) / attendanceData.totalAttendance) * 100).toFixed(2)}%
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel className="bg-white rounded-xl p-3">
              <div className="h-64">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </motion.div>
  );
};

export default UserDetails;