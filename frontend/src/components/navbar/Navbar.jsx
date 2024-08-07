import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive
          ? "bg-blue-700 text-white"
          : "text-blue-200 hover:bg-blue-600 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
};

const UserMenu = ({ isMember }) => (
  <Menu as="div" className="relative ml-3">
    <div>
      <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white">
        <span className="sr-only">Open user menu</span>
        <UserCircleIcon className="h-8 w-8 text-blue-200" />
        <ChevronDownIcon className="ml-1 h-4 w-4 text-blue-200" />
      </Menu.Button>
    </div>
    <Transition
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <Menu.Item>
          {({ active }) => (
            <Link
              to="/profile"
              className={`${
                active ? "bg-gray-100" : ""
              } block px-4 py-2 text-sm text-gray-700`}
            >
              Your Profile
            </Link>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <Link
              to={isMember ? "/logout" : "/login"}
              className={`${
                active ? "bg-gray-100" : ""
              } block px-4 py-2 text-sm text-gray-700`}
            >
              {isMember ? "Sign out" : "Sign in"}
            </Link>
          )}
        </Menu.Item>
      </Menu.Items>
    </Transition>
  </Menu>
);

const Navbar = () => {
  const [isMember, setIsMember] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
    <nav className="bg-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold">
                <span className="text-blue-200">Cellule </span>
                <span className="text-white">Yasipi</span>
              </h1>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/index">Home</NavLink>
              <NavLink to="/register-member">Add Member</NavLink>
              <NavLink to="/view">View Members</NavLink>
              <NavLink to="/mark">Mark Attendance</NavLink>
              <NavLink to="/view-attendance">View Attendance</NavLink>
            </div>
          </div>
          <div className="hidden md:block">
            <UserMenu isMember={isMember} />
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Transition
        show={isOpen}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <NavLink to="/index">Home</NavLink>
            <NavLink to="/register-member">Add Member</NavLink>
            <NavLink to="/view">View Members</NavLink>
            <NavLink to="/mark">Mark Attendance</NavLink>
            <NavLink to="/view-attendance">View Attendance</NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-blue-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <UserCircleIcon className="h-10 w-10 text-blue-200" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">User Name</div>
                <div className="text-sm font-medium text-blue-200">yasipicellule@gmail.com</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              {/* <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:text-white hover:bg-blue-700"
              >
                Your Profile
              </Link> */}
              <Link
                to={isMember ? "/logout" : "/login"}
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:text-white hover:bg-blue-700"
              >
                {isMember ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </div>
        </div>
      </Transition>
    </nav>
  );
};

export default Navbar;