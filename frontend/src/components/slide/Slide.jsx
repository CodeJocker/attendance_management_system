import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from 'swiper/modules';
import PropTypes from 'prop-types';

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// Default image
import defaultImg from "../../assets/imgs/Amen.jpg";

const swiperParams = {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  loop: true,
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  // pagination : {clickable: true},
  pagination: true,
  modules: [EffectCoverflow, Pagination],
  className: "w-full h-full"
};

const Slide = ({ data }) => {
  if (!Array.isArray(data)) {
    console.error("Data prop is not an array");
    return null;
  }

  return (
    <div className="w-full bg-slate-200 h-[70vh]">
      <Swiper {...swiperParams}>
        {data.length > 0 ? (
          data.map(item => (
            <SwiperSlide key={item.id} className="flex items-center justify-center">
              <img 
                src={item.image || defaultImg} 
                alt={item.username || 'Slide image'} 
                onError={(e) => { e.target.src = defaultImg; }}
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide className="flex items-center justify-center">
            <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-lg">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
};

export default Slide