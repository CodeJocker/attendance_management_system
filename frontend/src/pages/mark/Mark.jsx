import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";

const Mark = ({ data }) => {
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/current-user/");
        console.log("User data received:", response.data); // Debugging line
        if (response.data && response.data.id) {
          setUserId(response.data.id);
        } else {
          setError("User ID not found in the response");
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
        setError("Failed to fetch user ID");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserId();
  }, []);

  const handleAttendance = async (itemId, isAttended, isLate) => {
    if (!userId) {
      console.error("User ID not available. Current userId:", userId);
      setError("User ID not available. Please try refreshing the page.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/attendance/", {
        user: userId,
        attendee: itemId,
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
      setError("Failed to record attendance");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
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
      className="h-[85vh]"
    >
      {data.length > 0 ? (
        data.map((item) => (
          <SwiperSlide key={item.id} className="p-5 grid grid-cols-4 items-center justify-center w-[1000px]">
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
                      <div
                        className={`btn ${attendanceStatus[item.id]?.isAttended ? 'btn-success' : 'btn-error'}`}
                        onClick={() => handleAttendance(item.id, !attendanceStatus[item.id]?.isAttended, false)}
                      >
                        {attendanceStatus[item.id]?.isAttended ? 'Attended' : 'Not Attended'}
                      </div>
                      <div
                        className={`btn ${attendanceStatus[item.id]?.isLate ? 'btn-warning' : 'btn-outline'}`}
                        onClick={() => handleAttendance(item.id, true, !attendanceStatus[item.id]?.isLate)}
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
        ))
      ) : (
        <SwiperSlide>
          <span className="loading loading-spinner flex items-center justify-center"></span>
        </SwiperSlide>
      )}
    </Swiper>
  );
};

export default Mark;