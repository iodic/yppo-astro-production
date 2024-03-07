import { humanize } from "@/lib/utils/textConverter";
import * as Icon from "react-feather";

const HomapageFeature = ({ feature_list }) => {
  return (
    <div className="key-feature-grid mt-10 grid grid-cols-2 gap-7 md:grid-cols-3 xl:grid-cols-4">
      {feature_list.map((item, i) => {
        const FeatherIcon = Icon[humanize(item.icon)];
        return (
          <div
            key={i}
            className="flex flex-col justify-between"
          >
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front rounded-lg bg-white p-5 shadow-lg flex flex-col justify-between">
                  <div>
                    <h3 className="h4 text-xl lg:text-2xl">{item.title}</h3>
                    <p>{item.content}</p>
                  </div>
                  <span className="icon mt-4">
                    <FeatherIcon />
                  </span>
                </div>
                <div className="flip-card-back rounded-lg bg-white p-5 shadow-lg flex items-center text-black">
                  <p>{item.moreinfo}</p>
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
