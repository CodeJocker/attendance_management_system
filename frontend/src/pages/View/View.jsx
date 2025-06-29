import React, { useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const View = ({ data }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelectAll = () => {
    setSelectedItems(selectedItems.length === data.length ? [] : data.map(item => item.id));
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">View Members</h2>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={selectedItems.length === data.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="py-3 px-6 text-left">Product Owner</th>
                {/* <th className="py-3 px-6 text-left">Member</th> */}
                <th className="py-3 px-6 text-left hidden md:table-cell">Owner First name</th>
                {/* <th className="py-3 px-6 text-left hidden md:table-cell">Username</th> */}
                <th className="py-3 px-6 text-left hidden lg:table-cell">Owner Telephone</th>
                {/* <th className="py-3 px-6 text-left hidden lg:table-cell">Telephone</th> */}
                <th className="py-3 px-6 text-left hidden xl:table-cell">Product Register Date</th>
                {/* <th className="py-3 px-6 text-left hidden xl:table-cell">Register Date</th> */}
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {data.length > 0 ? (
                data.map((item) => (
                  <motion.tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                      />
                    </td>
                    <td className="py-3 px-6 text-left">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <img
                            className="w-10 h-10 rounded-full object-cover"
                            src={item.image}
                            alt={`${item.FirstName} ${item.LastName}`}
                          />
                        </div>
                        <div>
                          <div className="font-medium">{item.FirstName} {item.LastName}</div>
                          <div className="text-xs text-gray-500">{item.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left hidden md:table-cell">
                      <div className="font-medium">{item.username}</div>
                    </td>
                    <td className="py-3 px-6 text-left hidden lg:table-cell">
                      <div>{item.Tel || (
                        <span className="text-md text-error">no number provided</span>
                      )}</div>
                    </td>
                    <td className="py-3 px-6 text-left hidden xl:table-cell">
                      <div>{new Date(item.DateOfCellEntry).toLocaleDateString()}</div>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <NavLink to={`/details/${item.id}`}>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs md:text-sm">
                          Details
                        </button>
                      </NavLink>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default View;