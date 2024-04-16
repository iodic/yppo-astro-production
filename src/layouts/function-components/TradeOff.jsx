import React from "react";
import { PortableText } from '@portabletext/react'

const TradeOff = ({ content, type }) => {
  const consClasses =
    "card-cons rounded-l bg-white mb-6 px-6 pb-6 shadow-lg border-left border-l-4 border-l-[#8ebc0c]";
  const prosClasses =
    "card-pros rounded-l bg-white mb-6 px-6 pb-6 shadow-lg border-left border-l-4 border-l-[#f3873c]";

  return (
    <div className={type === "CONS" ? consClasses : prosClasses}>
      <p className="pt-4 pl-2 uppercase text-xl font-semibold text-black">
        {type}
      </p>
      <PortableText value={content} />
    </div>
  );
};

export default TradeOff;
