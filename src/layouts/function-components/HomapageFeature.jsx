import { PortableText } from "@portabletext/react";
import portableTextComponents from "../portable-text-components";

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
              <img
                class={`object-contain mb-3 sm:mb-0 sm:w-[48%] md:w-[40%] ${index === 0 ? "sm:float-left sm:mr-6" : "sm:float-right sm:ml-6"}`}
                alt="card-image"
                src={cardImage}
              />

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
        );
      })}
    </div>
  );
};

export default HomapageFeature;
