import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ACCESS_TOKEN } from "../../constants";

const Navbar = () => {
  const [isMember, setIsMember] = useState(false);

  const handleState = () => {
    const access_token = localStorage.getItem(ACCESS_TOKEN);
    const refresh_token = localStorage.getItem(ACCESS_TOKEN); // Ensure you are using the correct token key
    if (access_token && refresh_token) {
      setIsMember(true);
    } else {
      setIsMember(false);
    }
  };

  useEffect(() => {
    handleState();

    // Add event listener for storage changes
    const handleStorageChange = () => {
      handleState();
    };
    
    window.addEventListener('storage', handleStorageChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="navbar px-10 bg-blue-800 py-8">
      <div className="navbar-start">
        <h1 className="text-3xl font-bold flex font">
          <h1 className="text-slate-200">Cellule </h1>
          <span className="text-blue-300">CP</span>
        </h1>
      </div>
      <div className="navbar-center">
        <nav className="text-xl space-x-8 text-white flex font">
          <Link to="/index">
            <h1 className="hover:text-orange-400 duration-200">Home</h1>
          </Link>
          <Link to="/register-member">
            <h1 className="hover:text-orange-400 duration-200">
              ADD New Member
            </h1>
          </Link>
          <Link to="/view">
            <h1 className="hover:text-orange-400 duration-200">View Members</h1>
          </Link>
          <Link to="/mark">
            <h1 className="hover:text-orange-400 duration-200">
              Mark Attendance
            </h1>
          </Link>
          <Link to="/view-attendance">
            <h1 className="hover:text-orange-400 duration-200">View Attendance</h1>
          </Link>
        </nav>
      </div>
      <div className="navbar-end">
        <h1 className="text-3xl font text-red-400">
          {isMember ? <Link to="/logout">Logout</Link> : <Link to="/login">Login</Link>}
        </h1>
      </div>
    </div>
  );
};

export default Navbar;
