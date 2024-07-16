import React, { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const AddMember = () => {
  const [userData, setUserData] = useState([]);
  const [slug, setSlug] = useState("");
  const [username, setUsername] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [image, setImage] = useState(null);
  const [pnumber, setPnumber] = useState("");
  const [dob, setDob] = useState("");
  const [churchEntryDate, setChurchEntryDate] = useState("");
  const [cellEntryDate, setCellEntryDate] = useState("");

  const navigate = useNavigate()

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("slug", slug);
    formData.append("username", username);
    formData.append("FirstName", fname);
    formData.append("LastName", lname);
    formData.append("image", image);
    formData.append("Tel", pnumber);
    formData.append("DateOfBirth", dob);
    formData.append("DateOfChurchEntry", churchEntryDate);
    // formData.append("RegisterDate", regDate);
    formData.append("DateOfCellEntry", cellEntryDate);

    // Log form data entries
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const res = await api.post(
        "/api/create/user/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 201) {
        alert("Member created successfully");
        getUserData();
        navigate("/view");
      } else {
        alert("Error creating member");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center translate-y-5 translate-x-[-20px]">
      <div className="form card shrink-0 w-full max-w-sm">
        <fieldset className="form-control border shadow-2xl rounded-md p-3">
          <header className="text-2xl font text-center font-bold">
            Add Members
          </header>
          <form
            method="post"
            onSubmit={handleSubmit}
            className="flex flex-col card-body"
            encType="multipart/form-data"
          >
            <div className="flex gap-x-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Slug</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  className="input input-bordered bg-slate-200 placeholder:text-slate-800 placeholder:font text-slate-800"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Enter the slug field"
                />
              </div>

              <div className="form-control">
                <label htmlFor="" className="label">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  className="input input-bordered bg-slate-200 placeholder:text-slate-800 placeholder:font text-slate-800"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter the username"
                />
              </div>
            </div>

            <div className="flex gap-x-5">
              <div className="form-control">
                <label className="label">First Name</label>
                <input
                  type="text"
                  name="fname"
                  className="input input-bordered bg-slate-200 placeholder:text-slate-800 placeholder:font text-slate-800"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  placeholder="Enter the first name"
                />
              </div>

              <div className="form-control">
                <label htmlFor="" className="label">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lname"
                  className="input input-bordered bg-slate-200 placeholder:text-slate-800 placeholder:font text-slate-800"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  placeholder="Enter the last name"
                />
              </div>
            </div>

            <div className="form-control">
              <label htmlFor="" className="label">
                Photo
              </label>
              <input
                type="file"
                name="image"
                className="input-bordered input bg-slate-200 placeholder:bg-slate-100"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <div className="flex gap-x-5">
              <div className="form-control">
                <label htmlFor="" className="label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="pnumber"
                  className="input input-bordered bg-slate-200 placeholder:text-slate-800 placeholder:font text-slate-800"
                  value={pnumber}
                  onChange={(e) => setPnumber(e.target.value)}
                  placeholder="Enter mobile phone number"
                />
              </div>

              <div className="form-control">
                <label htmlFor="" className="label">
                  Date Of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  className="input input-bordered bg-slate-200 w-56 placeholder:text-slate-800 placeholder:font text-slate-800"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-x-5">
              <div className="form-control">
                <label htmlFor="" className="label">
                  Date Of Church Entry
                </label>
                <input
                  type="date"
                  name="churchEntryDate"
                  className="input input-bordered bg-slate-200 w-56 placeholder:text-slate-800 placeholder:font text-slate-800"
                  value={churchEntryDate}
                  onChange={(e) => setChurchEntryDate(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label htmlFor="" className="label">
                  Date Of Cell Entry
                </label>
                <input
                  type="date"
                  name="cellEntryDate"
                  className="input input-bordered bg-slate-200 w-56 placeholder:text-slate-800 placeholder:font text-slate-800"
                  value={cellEntryDate}
                  onChange={(e) => setCellEntryDate(e.target.value)}
                />
              </div>
            </div>

            <div className="button">
              <button
                type="submit"
                className="btn btn-info btn-outline w-[470px]"
              >
                Save
              </button>
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default AddMember;
