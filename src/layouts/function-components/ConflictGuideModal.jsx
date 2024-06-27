import React, { useEffect, useRef, useState } from "react";
import { PortableText } from "@portabletext/react";
import portableTextComponents from "@/layouts/portable-text-components";

const ConflictGuideModal = ({ termsPopup }) => {
  const [isModalActive, setIsModalActive] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const textRef = useRef();

  const { termsTitle, termsButton, termsContent } = termsPopup;

  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem("conflict-guide-show-modal") || "true")
    ) {
      setIsModalActive(true);
      document
        .querySelector(".conflict-guide-wrapper")
        ?.classList.add("blur-md");
    }
  }, []);

  useEffect(() => {
    if (textRef.current) {
      textRef.current?.addEventListener("scroll", (event) => {
        if (
          event.target.scrollHeight <=
          event.target.scrollTop + event.target.clientHeight
        ) {
          setIsButtonDisabled(false);
        }
      });
    }
  }, [textRef?.current]);

  const handleModalAccept = () => {
    localStorage.setItem("conflict-guide-show-modal", "false");
    setIsModalActive(false);
    document
      .querySelector(".conflict-guide-wrapper")
      ?.classList.remove("blur-md");
  };

  return (
    <div
      className={`absolute top-0 bottom-0 right-0 left-0 z-20 ${isModalActive ? "" : "hidden"}`}
    >
      <div className="flex flex-col items-center justify-center h-full w-full bg-black/50">
        <div className="max-w-[600px] m-4 p-6 rounded-xl bg-white">
          <h3 className="mb-6 font-normal text-center">{termsTitle}</h3>
          <div ref={textRef} className="overflow-auto h-[400px] px-5 mb-5">
            <PortableText
              value={termsContent}
              components={portableTextComponents}
            />
          </div>
          <div className="flex justify-end mt-auto">
            {termsButton && (
              <button
                onClick={handleModalAccept}
                className="btn btn-primary h-[42px] py-0 px-5 disabled:bg-none disabled:bg-gray-300"
                disabled={isButtonDisabled}
              >
                {termsButton}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConflictGuideModal;
