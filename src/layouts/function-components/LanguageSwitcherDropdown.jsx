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
        <button onClick={toggleOpen}>
          <IoGlobeOutline
            className={`w-5 h-5 transition-colors ${open ? "stroke-dark" : "stroke-primary hover:stroke-dark"}`}
          />
        </button>

        <div
          className={`absolute -left-[3.2rem] xl:-left-6 top-8 z-20 rounded bg-theme-light overflow-hidden my-1 overflow-y-auto ${open ? "shadow-md" : "hidden"}`}
        >
          <ul
            onClick={() => setOpen(false)}
            className="divide-y divide-gray-50 text-sm text-dark"
          >
            {Object.entries(localeNames).map(([lang, label]) => (
              <li
                key={lang}
                className={`px-2.5 text-center py-1.5 transition-colors ${currentLanguage === lang ? "text-orange-500 pointer-events-none" : "hover:text-orange-500"}`}
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
