import React, { useState, useEffect } from "react";

const Dropdown = ({ title, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);

    if (onSelect) {
      onSelect(option);
    }
  };

  useEffect(() => {
    if (options) {
      setSelectedOption(options[0]);
    }
  }, [options]);

  return (
    <div className="relative w-[160px]">
      <div
        className="flex cursor-pointer px-3 border border-primary/25 rounded-xl"
        onClick={toggleDropdown}
      >
        {selectedOption ? selectedOption.label : "Select an option"}

        <svg
          className={`absolute top-2 right-2 w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          x="0px"
          y="0px"
          viewBox="0 0 512 512"
          xmlSpace="preserve"
        >
          <path
            fill="currentColor"
            d="M505.755,123.592c-8.341-8.341-21.824-8.341-30.165,0L256.005,343.176L36.421,123.592c-8.341-8.341-21.824-8.341-30.165,0 s-8.341,21.824,0,30.165l234.667,234.667c4.16,4.16,9.621,6.251,15.083,6.251c5.462,0,10.923-2.091,15.083-6.251l234.667-234.667 C514.096,145.416,514.096,131.933,505.755,123.592z"
          ></path>
        </svg>
      </div>

      {isOpen && (
        <ul className="absolute top-full left-0 w-full max-h-[200px] mt-1 overflow-y-auto border border-primary/25 rounded-xl bg-white shadow-md z-50">
          {options.map((option) => (
            <li
              className={`list-none cursor-pointer px-3 py-2 hover:text-primary ${option.label === selectedOption?.label ? "text-primary" : ""}`}
              key={`${option.value}-${title}`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
