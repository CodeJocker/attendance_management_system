import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Transition } from '@headlessui/react';
// import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { Bars3Icon as MenuIcon, XMarkIcon as XIcon } from '@heroicons/react/24/outline';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

const NavLink = ({ to, children, mobile = false }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  const baseClasses = "transition duration-200";
  const desktopClasses = "hover:text-orange-400";
  const mobileClasses = "block px-4 py-2 text-sm";
  const activeClasses = mobile ? "bg-blue-700 text-white" : "text-orange-400";
  const inactiveClasses = mobile ? "text-gray-300 hover:bg-blue-700 hover:text-white" : "text-white";
  
  const classes = `
    ${baseClasses}
    ${mobile ? mobileClasses : desktopClasses}
    ${isActive ? activeClasses : inactiveClasses}
  `;

  return (
    <Link to={to} className={classes}>
      {children}
    </Link>
  );
};

const MobileMenu = ({ isMember }) => (
  <Menu as="div" className="ml-3 relative">
    {({ open }) => (
      <>
        <div>
          <Menu.Button className="bg-blue-800 p-2 rounded-md text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white">
            <span className="sr-only">Open main menu</span>
            {open ? (
              <XIcon className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <MenuIcon className="block h-6 w-6" aria-hidden="true" />
            )}
          </Menu.Button>
        </div>
        <Transition
          show={open}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            static
            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <Menu.Item>
              {({ active }) => (
                <NavLink to="/index" mobile={true}>
                  Home
                </NavLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <NavLink to="/register-member" mobile={true}>
                  Add New Member
                </NavLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <NavLink to="/view" mobile={true}>
                  View Members
                </NavLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <NavLink to="/mark" mobile={true}>
                  Mark Attendance
                </NavLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <NavLink to="/view-attendance" mobile={true}>
                  View Attendance
                </NavLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <NavLink to={isMember ? "/logout" : "/login"} mobile={true}>
                  {isMember ? "Logout" : "Login"}
                </NavLink>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </>
    )}
  </Menu>
);

const Navbar = () => {
  const [isMember, setIsMember] = useState(false);

  const checkMemberStatus = useCallback(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    setIsMember(!!accessToken && !!refreshToken);
  }, []);

  useEffect(() => {
    checkMemberStatus();
    window.addEventListener('storage', checkMemberStatus);
    return () => window.removeEventListener('storage', checkMemberStatus);
  }, [checkMemberStatus]);

  return (
    <nav className="bg-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl sm:text-3xl font-bold">
                <span className="text-slate-200">Cellule </span>
                <span className="text-blue-300">Yasipi</span>
              </h1>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/index">Home</NavLink>
              <NavLink to="/register-member">Add New Member</NavLink>
              <NavLink to="/view">View Members</NavLink>
              <NavLink to="/mark">Mark Attendance</NavLink>
              <NavLink to="/view-attendance">View Attendance</NavLink>
              <NavLink to={isMember ? "/logout" : "/login"}>
                {isMember ? "Logout" : "Login"}
              </NavLink>
            </div>
          </div>
          <div className="md:hidden">
            <MobileMenu isMember={isMember} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar