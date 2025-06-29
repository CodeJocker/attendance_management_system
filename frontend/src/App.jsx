import React, { useEffect, useState } from "react";
import NotFound from "./pages/NotFound";
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./components/index/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/protectedUrl"; // Corrected import path
import Navbar from "./components/navbar/Navbar";
import AddMember from "./pages/ADD/AddMember";
import View from "./pages/View/View";
import Mark from "./pages/mark/Mark";
import Test from "./tests/test";
import api from "./api";
import ViewAttendance from "./pages/View/ViewAttendance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserDetails from "./components/details/Details";
import Theme from "./components/details/theme";
import AttendanceReport from "./pages/report/Report";
import Footer from "./components/footer/Footer";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  const [userData, setUserData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    getUserData();
    fetchAttendanceData();
  }, []);
  const fetchAttendanceData = () => {
    api
      .get("/api/attendance/list/")
      .then((res) => res.data)
      .then((data) => {
        setAttendanceData(data);
        console.log(data);
        setIsLoading(false);
        // toast.success("attendance listed successfully");
      })
      .catch((error) => {
        toast.error("Failed to fetch attendance data", error);
        setIsLoading(false);
      });
  };
  const getUserData = () => {
    api
      .get("/api/list/user/")
      .then((res) => res.data)
      .then((data) => {
        setUserData(data);
        console.log(data);
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="bg-white">
      <section id="nav" className="nav">
        <Navbar />
      </section>
      <Routes>
        <Route
          path="/index"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <AttendanceReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register-member"
          element={
            <ProtectedRoute>
              <AddMember />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view"
          element={
            <ProtectedRoute>
              <View data={userData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mark"
          element={
            <ProtectedRoute>
              <Mark data={userData} attendance={attendanceData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-attendance"
          element={
            <ProtectedRoute>
              <ViewAttendance />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Theme />} />
        <Route path="/details/:id" element={<UserDetails />} />
        <Route path="/test" element={<Test />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
