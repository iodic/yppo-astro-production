import React, { useState, useEffect } from "react";
import { humanize } from "@/lib/utils/textConverter";

import Dropdown from "./Dropdown";

import * as Icon from "react-feather";
import { BsPinAngleFill } from "react-icons/bs";

const PricingCard = ({ card, generalText }) => {
  const {
    title,
    description,
    featured,
    icon: cardIcon,
    priceDetails,
    pricePerEmployee,
    listSection,
  } = card;

  const { numberOfEmployeesText, mainButtonText, ctaText } = generalText;

  const CardIcon = Icon[humanize(cardIcon)];

  const [selectedPricing, setSelectedPricing] = useState({});
  const [priceOptions, setPriceOptions] = useState([]);

  useEffect(() => {
    if (pricePerEmployee) {
      setSelectedPricing({
        value: pricePerEmployee[0].price,
        label: pricePerEmployee[0]?.employeeRange,
      });

      pricePerEmployee.map((priceObject) => {
        setPriceOptions((priceOptions) => [
          ...priceOptions,
          {
            value: priceObject?.price,
            label: priceObject?.employeeRange,
          },
        ]);
      });
    }
  }, [card]);

  return (
    <div
      className="mt-8 px-3 mx-auto md:col-6 xl:col-4 xl:mt-0"
      key={title && title}
    >
      <div
        className={`relative rounded-xl bg-white px-8 py-10 overflow-hidden shadow-lg ${
          featured ? "md:-mt-16 border border-primary " : undefined
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            {title && <h2 className="h3">{title}</h2>}

            {priceOptions && (
              <div className="my-4">
                <span className="text-sm">
                  {numberOfEmployeesText
                    ? numberOfEmployeesText
                    : "Number of Employees"}
                </span>

                <Dropdown
                  onSelect={setSelectedPricing}
                  options={priceOptions}
                  title={title}
                />
              </div>
            )}
          </div>

          <span
            className={`inline-flex h-16 w-16 min-w-16 items-center justify-center rounded-full font-bold ${
              featured ? "bg-gradient text-white" : "bg-theme-light text-dark"
            }`}
          >
            <CardIcon className="font-semibold" />
          </span>
        </div>

        {selectedPricing?.value && (
          <p className="mt-3 text-2xl text-dark">
            {priceDetails?.pricePrefix} {selectedPricing.value}.00{" "}
            {priceDetails?.priceSuffix}
          </p>
        )}

        {description && <p className="mt-6">{description}</p>}

        {listSection && (
          <div className="my-6 border-y border-border py-6">
            <h4 className="h6">{listSection?.listTitle}</h4>

            <ul className="mt-6">
              {listSection?.listItem.map((service, i) => (
                <li className="mb-3 text-sm" key={`service-${i}`}>
                  <span className="mr-2">
                    <BsPinAngleFill
                      className={`mr-1 inline h-[14px] w-[14px] ${
                        featured ? "text-primary" : undefined
                      }`}
                    />
                  </span>
                  {service}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center">
          <a
            className={`btn ${
              featured ? "btn-primary" : "btn-outline-white"
            } block h-[48px] w-full rounded-[50px] leading-[30px]`}
            href="#"
          >
            {mainButtonText ? mainButtonText : "Buy Now"}
          </a>

          <a className="mt-6 inline-flex items-center text-dark" href="#">
            {ctaText ? ctaText : "Request a Demo"}

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
  );
};

export default PricingCard;
