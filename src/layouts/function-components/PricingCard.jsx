import React, { useState } from "react";
import { humanize } from "@/lib/utils/textConverter";

import Dropdown from "./Dropdown";

import * as Icon from "react-feather";
import { BsPinAngleFill } from "react-icons/bs";

const PricingCard = ({ card }) => {
  const FeatherIcon = Icon[humanize(card.icon)];

  const [selectedPricing, setSelectedPricing] = useState({
    value: "5,000",
    label: "1-100",
  });

  return (
    <>
      {card && (
        <div className="mt-8 px-3 md:col-6 lg:col-4 lg:mt-0" key={card.title}>
          <div
            className={`rounded-xl bg-white px-8 py-10 shadow-lg ${
              card.featured ? "-mt-16 border border-primary " : undefined
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="h3">{card.title}</h2>

                <Dropdown
                  onSelect={setSelectedPricing}
                  options={[
                    { value: "5,000", label: "1-100" },
                    { value: "6,200", label: "101-250" },
                    { value: "8,075", label: "251-500" },
                  ]}
                />

                <p className="mt-3 text-2xl text-dark">
                  {card?.priceDetails?.pricePrefix} {selectedPricing.value}.00{" "}
                  {card?.priceDetails?.priceSuffix}
                </p>
              </div>

              <span
                className={`inline-flex h-16 w-16 items-center justify-center rounded-full font-bold ${
                  card.featured
                    ? "bg-gradient text-white"
                    : "bg-theme-light text-dark"
                }`}
              >
                <FeatherIcon className="font-semibold" />
              </span>
            </div>

            <p className="mt-6">{card.description}</p>

            <div className="my-6 border-y border-border py-6">
              <h4 className="h6">{card?.listSection?.listTitle}</h4>

              <ul className="mt-6">
                {card?.listSection?.listItem.map((service, i) => (
                  <li className="mb-3 text-sm" key={`service-${i}`}>
                    <span className="mr-2">
                      <BsPinAngleFill
                        className={`mr-1 inline h-[14px] w-[14px] ${
                          card.featured ? "text-primary" : undefined
                        }`}
                      />
                    </span>
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center">
              <a
                className={`btn ${
                  card.featured ? "btn-primary" : "btn-outline-white"
                } block h-[48px] w-full rounded-[50px] leading-[30px]`}
                href="#"
              >
                Buy Now
                {/* TODO: Update with data from Sanity */}
              </a>

              <a className="mt-6 inline-flex items-center text-dark" href="#">
                Request a Demo
                {/* TODO: Update with data from Sanity */}
                <svg
                  className="ml-1.5"
                  width="13"
                  height="16"
                  viewBox="0 0 13 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.7071 8.70711C13.0976 8.31658 13.0976 7.68342 12.7071 7.29289L6.34315 0.928932C5.95262 0.538408 5.31946 0.538408 4.92893 0.928932C4.53841 1.31946 4.53841 1.95262 4.92893 2.34315L10.5858 8L4.92893 13.6569C4.53841 14.0474 4.53841 14.6805 4.92893 15.0711C5.31946 15.4616 5.95262 15.4616 6.34315 15.0711L12.7071 8.70711ZM0 9H12V7H0V9Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PricingCard;
