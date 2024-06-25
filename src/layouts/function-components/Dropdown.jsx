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
    <div className="relative w-[150px] xl:w-[180px] my-4">
      <div
        className="cursor-pointer px-3 py-2 border border-primary/25 rounded-xl"
        onClick={toggleDropdown}
      >
        {selectedOption ? selectedOption.label : "Select an option"}
      </div>
      {isOpen && (
        <ul className="absolute top-full left-0 w-full max-h-[200px] mt-1 overflow-y-auto border border-primary/25 rounded-xl bg-white shadow-md z-50">
          {options.map((option) => (
            <li
              className={`list-none cursor-pointer px-3 py-2 hover:text-primary ${option.value === selectedOption?.value ? "text-primary" : ""}`}
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
