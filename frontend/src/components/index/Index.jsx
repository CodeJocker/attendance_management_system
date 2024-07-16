import React, { useEffect, useState } from 'react'
import Slide from "../slide/Slide"
import api from '../../api';
const Index = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    getUserData();
  }, []);

   const getUserData = () => {
    api.get("api/list/user/")
      .then((res) => res.data)
      .then((data) => {
        setUserData(data);
        console.log(data);
      })
      .catch((error) => console.log(error));
  };
  return (
    <>
        <div className="Header text-center mt-5">
            <h1 className="text-2xl font text-slate-800 font-bold">Welcome to the Cellule YaCP Web Platform</h1>
        </div>

        <section className="slide" id="slide">
        <Slide data={userData} />
      </section>
    </>
  )
}

export default Index