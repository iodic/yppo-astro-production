import { humanize } from "@/lib/utils/textConverter";
import * as Icon from "react-feather";

const HomapageFeature = ({ cards }) => {
  const isTouchScreenDevice = () => {
    try {
      document.createEvent("TouchEvent");
      return true;
    } catch (e) {
      return false;
    }
  };

  const onCardClick = (e) => {
    const cardWrapper = e.target.closest(".flip-card-inner");

    if (!isTouchScreenDevice()) {
      cardWrapper.classList.add("flip-card-inner-back");
    } else {
      if (cardWrapper.classList.contains("flipped")) {
        cardWrapper.classList.toggle("flip-card-inner-back");
        cardWrapper.classList.remove("flipped");
      }

      if (!cardWrapper.classList.contains("flipped")) {
        cardWrapper.classList.add("flipped");
      }
    }
  };

  const onHoverLeave = (e) => {
    if (!isTouchScreenDevice()) {
      const cardWrapper = e.target.closest(".flip-card-inner");
      cardWrapper.classList.remove("flip-card-inner-back");
    }
  };

  return (
    <div className="key-feature-grid mt-10 grid gap-7 grid-cols-1 md:grid-cols-8">
      {cards.map((item, i) => {
        const { title, description, shortDescription, icon } = item;
        const FeatherIcon = Icon[humanize(icon)];

        return (
          <div
            key={i}
            className={`flex flex-col justify-between ${i === 2 ? "md:col-span-4 md:col-start-3" : "md:col-span-4"}`}
          >
            <div
              className="flip-card"
              onMouseLeave={(e) => onHoverLeave(e)}
              onClick={(e) => onCardClick(e)}
            >
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
