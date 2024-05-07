import { humanize } from "@/lib/utils/textConverter";
import * as Icon from "react-feather";

const HomapageFeature = ({ cards }) => {
  return (
    <div className="key-feature-grid mt-10 grid gap-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {cards.map((item, i) => {
        const { title, description, shortDescription } = item;
        const FeatherIcon = Icon[humanize("map")];

        return (
          <div key={i} className="flex flex-col justify-between">
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front rounded-lg bg-white p-5 shadow-lg flex flex-col justify-between">
                  <div>
                    <h3 className="h4 text-xl lg:text-2xl">{title}</h3>
                    <p>{shortDescription}</p>
                  </div>
                  <span className="icon mt-4">
                    <FeatherIcon />
                  </span>
                </div>
                <div className="flip-card-back rounded-lg bg-white p-5 shadow-lg flex items-center text-black">
                  <p>{description}</p>
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
