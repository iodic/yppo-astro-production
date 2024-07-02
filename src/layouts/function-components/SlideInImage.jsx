import React, { useEffect, useRef, useState } from 'react';

const SlideInImageComponent = ({ index, cardImage }) => {
  const imageRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 1 }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  return (
    <img
      ref={imageRef}
      className={`self-start transition-opacity ease-in duration-700 object-contain mb-3 sm:mb-0 sm:w-full md:w-[40%] h-fit"} ${inView ? "opacity-100" : "opacity-0"}`}
      alt="card-image"
      src={cardImage}
    />
  );
};

export default SlideInImageComponent;
