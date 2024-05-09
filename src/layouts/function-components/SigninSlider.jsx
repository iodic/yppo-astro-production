import React, { useRef, useState } from "react";

import SwiperCore from "swiper";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

const SigninSlider = ({ title }) => {
  SwiperCore.use([Pagination]);
  const [swiper, setSwiper] = useState(null);
  const paginationRef = useRef(null);

  return (
    <div className="auth-banner bg-gradient hidden flex-col items-center justify-center py-16 lg:col-6 lg:block">
      <img
        className="absolute left-0 top-0 h-full w-full"
        src="/images/login-banner-bg.png"
        alt=""
      />
      <div className="w-full text-center">
        {title && (
          <h2 className="h3 text-white max-w-[80%] mx-auto">{title}</h2>
        )}

        <div className="auth-banner-carousel">
          <Swiper
            pagination={{
              type: "bullets",
              el: paginationRef.current,
              clickable: true,
              dynamicBullets: true,
            }}
            onSwiper={(swiper) => {
              setSwiper(swiper);
            }}
            // loop={true}
            modules={[Pagination, Autoplay]}
            slidesPerView={1}
          >
            <SwiperSlide key={"feature-" + 0}>
              <img
                width="667"
                height="557"
                className="mx-auto"
                src="/images/mascots/conflict-guide.png"
                alt=""
              />
            </SwiperSlide>
          </Swiper>

          <div className="relative flex justify-center">
            <div
              width="100%"
              className=" pagination"
              style={{ width: "100%" }}
              ref={paginationRef}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninSlider;
