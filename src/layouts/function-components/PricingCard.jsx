import { useState, useMemo, useCallback, useEffect } from "react";
import { humanize } from "@/lib/utils/textConverter";

import * as Icon from "react-feather";

const PricingCard = ({ card, cardAction, generalText }) => {
  const {
    title,
    description,
    featured,
    icon: cardIcon,
    priceDetails,
    entryFee = 0,
    pricePerEmployee,
  } = card;

  const { urlTitle, url } = cardAction || {};
  const { numberOfEmployeesText } = generalText;

  const CardIcon = Icon[humanize(cardIcon)];

  const [numberOfEmployeesValue, setNumberOfEmployeesValue] = useState(100);
  const [numberOfEmployees, setNumberOfEmployees] = useState(100);

  useEffect(() => {
    if (numberOfEmployeesValue !== undefined) {
      if (numberOfEmployeesValue !== "") {
        if (Number(numberOfEmployeesValue) < 1) {
          setNumberOfEmployees(1);
          setNumberOfEmployeesValue(1);
        } else {
          setNumberOfEmployees(Number(numberOfEmployeesValue));
        }
      }
    }
  }, [numberOfEmployeesValue]);

  const getPriceByIndividualFee = useCallback(() => {
    if (pricePerEmployee?.length) {
      const individualFee = pricePerEmployee.find(
        ({ employeeLimit }, index) => {
          const nextStartingEmployeeCount =
            index + 1 <= pricePerEmployee.length - 1
              ? Number(pricePerEmployee[index + 1]?.employeeLimit)
              : undefined;

          return (
            numberOfEmployees >= Number(employeeLimit) &&
            (!nextStartingEmployeeCount ||
              numberOfEmployees < nextStartingEmployeeCount)
          );
        },
      )?.individualFee;

      return numberOfEmployees * (individualFee || 0);
    }

    return 0;
  }, [numberOfEmployees, pricePerEmployee]);

  const price = useMemo(() => {
    const newPrice = Number(entryFee) + getPriceByIndividualFee();

    const newPriceDecimal = newPrice.toFixed(2);

    return newPriceDecimal.split(".")[1] === "00" ? newPrice : newPriceDecimal;
  }, [entryFee, numberOfEmployees, pricePerEmployee]);

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

            <div className="my-4 p-0 form-group bg-transparent border-none">
              <span
                htmlFor="number-of-employees"
                className="text-sm form-label"
              >
                {numberOfEmployeesText
                  ? numberOfEmployeesText
                  : "Number of Employees"}
              </span>

              <input
                type="number"
                id="number-of-employees"
                className="form-control w-[160px] h-[50px]"
                value={numberOfEmployeesValue}
                onChange={(event) =>
                  setNumberOfEmployeesValue(event.target.value)
                }
              />
            </div>
          </div>

          <span
            className={`inline-flex h-16 w-16 min-w-16 items-center justify-center rounded-full font-bold ${
              featured ? "bg-gradient text-white" : "bg-theme-light text-dark"
            }`}
          >
            <CardIcon className="font-semibold" />
          </span>
        </div>

        {pricePerEmployee?.length && (
          <p className="mt-3 text-3xl font-medium text-dark">
            {priceDetails?.pricePrefix}
            {price}{" "}
            <span className="text-base">{priceDetails?.priceSuffix}</span>
          </p>
        )}

        {description && <p className="my-6">{description}</p>}

        {/* Temporarily hidden section */}
        {/* {listSection && (
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
        )} */}

        <div className="text-center">
          <a
            className={`btn ${
              featured ? "btn-primary capitalize" : "btn-outline-white"
            } block h-[48px] w-full rounded-[50px] leading-[30px]`}
            href={url}
            target="_blank"
          >
            {urlTitle ? urlTitle : "Schedule A Demo"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
