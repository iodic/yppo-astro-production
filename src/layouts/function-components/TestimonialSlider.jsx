import { useRef, useState } from "react";

import SwiperCore from "swiper";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

import { Star } from "react-feather";

const TestimonialSlider = ({ list }) => {
  SwiperCore.use([Pagination]);
  const [swiper, setSwiper] = useState(null);
  const paginationRef = useRef(null);

  return (
    <div className="reviews-carousel relative">
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
        breakpoints={{
          992: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 3,
          },
        }}
      >
        {list.map((item, i) => {
          const { title, subtitle, description, image, rating } = item;

          return (
            <SwiperSlide key={"feature-" + i}>
              <div className="review">
                {image && (
                  <div className="review-author-avatar">
                    <img src={image} alt="" />
                  </div>
                )}

                {title && <h4 className="mb-2">{title}</h4>}
                {subtitle && <p className="mb-4 text-[#666]">{subtitle}</p>}
                {description && <p>{description}</p>}

                {rating && (
                  <div
                    className={`review-rating mt-6 flex items-center justify-center space-x-2.5 stars-${rating}`}
                  >
                    <Star />
                    <Star />
                    <Star />
                    <Star />
                    <Star />
                  </div>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="relative flex justify-center">
        <div
          width="100%"
          className="swiper-pagination reviews-carousel-pagination !bottom-0"
          style={{ width: "100%" }}
          ref={paginationRef}
        ></div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
