import { PortableText } from "@portabletext/react";
import portableTextComponents from "../portable-text-components";

import SlideInImageComponent from "@/layouts/function-components/SlideInImage"

const HomapageFeature = ({ cards }) => {
  return (
    <div className="flex flex-col mt-5">
      {cards.map((item, index) => {
        const { title, description, cardImage } = item;

        return (
          <div key={index} className="sm:mt-8">
            <div className="py-3 my-3 sm:py-5 lg:my-5">
              <h2 className="text-3xl sm:text-4xl text-center sm:text-left mb-5">
                {title}
              </h2>

              <div className={`md:flex md:items-center ${index === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <SlideInImageComponent cardImage={cardImage} />
                <div
                  className={`w-[90%] sm:w-auto mx-auto sm:mx-0 ${index === 0 ? "sm:mt-12" : ""}`}
                >
                  <PortableText
                    value={description}
                    components={portableTextComponents}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HomapageFeature;
