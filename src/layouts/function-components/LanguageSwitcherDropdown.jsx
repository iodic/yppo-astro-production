import React, { useState, useRef, useEffect } from "react";

import { i18nConfig } from "@/i18n/i18nConfig";
import { IoGlobeOutline } from "react-icons/io5";

const { localeNames, defaultLocale } = i18nConfig;

export default function LanguageSwitcherDropdown({
  currentLanguage,
  currentPath,
}) {
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);

  function toggleOpen() {
    setOpen(!open);
  }

  useEffect(() => {
    function close(e) {
      if (!dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      window.addEventListener("click", close);
    }
    return function removeListener() {
      window.removeEventListener("click", close);
    };
  }, [open]);

  return (
    <div className="flex flex-wrap">
      <div ref={dropdownRef} className="relative flex items-center ml-4">
        <button onClick={toggleOpen} onMouseEnter={() => setOpen(true)}>
          <IoGlobeOutline
            className={`w-5 h-5 transition-colors ${open ? "stroke-primary" : "stroke-text hover:stroke-primary"}`}
          />
        </button>

        <div
          className={`absolute top-8 -left-16 xl:-left-9 ml-1 rounded-lg  border-primary/25 px-4 py-2 duration-300 lg:mt-0 border bg-white shadow-[0_0.9rem_1.56rem_rgb(0,0,0,0.1) ${open ? "shadow-md" : "hidden"}`}
        >
          <ul onClick={() => setOpen(false)}>
            {Object.entries(localeNames).map(([lang, label]) => (
              <li
                key={lang}
                className={`py-1 mb-1 text-sm font-medium text-dark transition ${currentLanguage === lang ? "text-primary pointer-events-none" : "hover:text-primary"}`}
              >
                <a
                  href={`${lang === defaultLocale ? "/" : `/${lang}`}${currentLanguage !== defaultLocale ? currentPath.substring(4) : currentPath}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
