import React from "react";
import Img from "../../assets/imgs/0064c8b1-0a62-4860-b622-3dc9898a42b8.jpg";

const View = ({data})=> {
  return (
    <div className="translate-y-16">
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th className="text-xl font text-slate-600 cursor-default">ID</th>
              <th className="text-xl font text-slate-600 cursor-default">
                Photo
              </th>
              <th className="text-xl font text-slate-600 cursor-default">
                Slug
              </th>
              <th className="text-xl font text-slate-600 cursor-default">
                Username
              </th>
              <th className="text-xl font text-slate-600 cursor-default">
                Telephone
              </th>
              <th className="text-xl font text-slate-600 cursor-default">
                Register Date
              </th>
              <th className="text-xl font text-slate-600 cursor-default">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {
              data.length > 0 ? (
                data.map(item => (
            <tr key={item.id}>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <td>
              {" "}
              <div className="font-bold">{item.id}</div>
            </td>
            <td>
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="mask mask-squircle w-12 h-12">
                    <img src={item.image} alt="Avatar Tailwind CSS Component" />
                  </div>
                </div>
              </div>
            </td>
            <td>
                {item.slug}
              <br />
              <span className="badge badge-ghost badge-sm">
              {item.FirstName} - {item.LastName}
              </span>
            </td>
            <td>
              <div className="div">
                {" "}
                <div>
                  <div className="font-bold">{item.username}</div>
                  <div className="text-sm opacity-50">United States</div>
                </div>
              </div>
            </td>
            <td>
              <div className="tel">{item.Tel}</div>
            </td>
            <td>
              <div className="register-date">{item.DateOfCellEntry}</div>
            </td>
            <th>
              <button className="btn btn-info btn-md">details</button>
            </th>
          </tr>
                ))
              ) : <span className="loading loading-bars text-3xl"></span>
            }
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th></th>
              <th className="font-bold text-slate-800">ID</th>
              <th className="font-bold text-slate-800">Photo</th>
              <th className="font-bold text-slate-800">Slug</th>
              <th className="font-bold text-slate-800">username</th>
              <th className="font-bold text-slate-800">Telephone</th>
              <th className="font-bold text-slate-800">Register Date</th>
              <th className="font-bold text-slate-800">Details</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default View;
