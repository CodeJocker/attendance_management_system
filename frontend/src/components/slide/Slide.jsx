import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";
import api from "../../api";

const Mark = ({ data }) => {
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch the user ID when the component mounts
    const fetchUserId = async () => {
      try {
        const response = await api.get("/api/current-user/");
        if (response.data && response.data.id) {
          setUserId(response.data.id);
        } else {
          console.error("User ID not found in response");
        }
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Error response:", error.response.status, error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error", error.message);
        }
      }
    };
    fetchUserId();
  }, []);

  const handleAttendance = async (itemId, isAttended, isLate) => {
    if (!userId) {
      console.error("User ID not available");
      return;
    }

    try {
      const response = await axios.post("/api/attendance/", {
        user: userId,
        isAttended: isAttended,
        isLate: isLate,
        topic: "Your topic here",
      });

      setAttendanceStatus(prevStatus => ({
        ...prevStatus,
        [itemId]: { isAttended, isLate }
      }));

      console.log("Attendance recorded:", response.data);
    } catch (error) {
      console.error("Error recording attendance:", error);
    }
  };

  return (
    <>
      <Swiper
        effect={"coverflow"}
        slidesPerView={"auto"}
        centeredSlides={true}
        grabCursor={true}
        loop={true}
        spaceBetween={50}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        modules={[Pagination]}
        className=" h-[85vh]"
      >
        {data.length > 0 ? (
          data.map((item) => (
            <div
              className="p-5 overflow-auto grid grid-cols-4 items-center justify-center w-[1000px]"
              key={item.id}
            >
              <SwiperSlide className="">
                <fieldset className="form-centrol shadow-2xl w-[300px] rounded-md">
                  <div className="card">
                    <div className="card-body">
                      <div className="image">
                        <img
                          src={item.image}
                          alt=""
                          className="rounded-full w-60 h-60"
                        />
                      </div>
                      <div className="desc">
                        <div className="name flex gap-2 items-center justify-center">
                          <h1 className="font">{item.FirstName}</h1>
                          <h1 className="font">{item.LastName}</h1>
                        </div>
                        <div className="date flex items-center justify-center">
                          <h1>{new Date().toLocaleDateString("en-US")}</h1>
                        </div>
                        <div className="buttons flex flex-col space-y-3">
                          {attendanceStatus[item.id]?.isAttended ? (
                            <div
                              className="btn btn-success"
                              onClick={() => handleAttendance(item.id, false, false)}
                            >
                              Attended
                            </div>
                          ) : (
                            <div
                              className="btn btn-error"
                              onClick={() => handleAttendance(item.id, true, false)}
                            >
                              Not Attended
                            </div>
                          )}
                          <div
                            className="btn btn-warning"
                            onClick={() => handleAttendance(item.id, true, true)}
                          >
                            Is Late
                          </div>
                          <div className="text mt-4 text-center">Status</div>
                          <div>
                            {attendanceStatus[item.id]?.isAttended ? (
                              attendanceStatus[item.id]?.isLate ? (
                                <div className="btn btn-warning w-full">
                                  Late
                                </div>
                              ) : (
                                <div className="btn btn-success w-full">
                                  Present
                                </div>
                              )
                            ) : (
                              <div className="btn btn-error w-full">Absent</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </SwiperSlide>
            </div>
          ))
        ) : (
          <span className="loading loading-spinner flex items-center justify-center"></span>
        )}
      </Swiper>
    </>
  );
};

export default Mark;