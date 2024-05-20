import React, { useState } from "react";

const capitalizeString = (str) => {
  if (str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
};

const SanityVideoComponent = ({
  videoUrl,
  videoPoster,
  videoTranscriptRepeater,
  generalText,
}) => {
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <>
      <video
        className="mb-6"
        controls={true}
        playsInline={true}
        poster={videoPoster}
        src={videoUrl}
      ></video>
      <div>
        {Boolean(videoTranscriptRepeater?.length) && (
          <>
            <button
              className="btn whitespace-nowrap w-fit mb-2 text-center rounded-md cursor-pointer hover:bg-slate-700 hover:text-[#fafafa]"
              onClick={() => setShowTranscript(!showTranscript)}
            >
              {showTranscript
                ? generalText?.hideTranscriptText
                  ? generalText?.hideTranscriptText
                  : "Hide Transcript"
                : generalText?.showTranscriptText
                  ? generalText?.showTranscriptText
                  : "Show Transcript"}
            </button>
            {showTranscript && (
              <div className="mt-2 p-4 rounded-md bg-[#00000010] mb-10">
                {videoTranscriptRepeater.map(
                  (
                    { videoTranscriptSpeaker, videoTranscriptContent },
                    index,
                  ) => (
                    <div>
                      {videoTranscriptSpeaker && (
                        <span
                          className={`rounded-md px-[0.8rem] py-[0.45rem] text-xs font-semibold text-white ${index % 2 === 0 ? "bg-[#f3873c]" : "bg-[#c068f2]"}`}
                        >
                          {capitalizeString(videoTranscriptSpeaker)}:
                        </span>
                      )}
                      <p
                        className={`mt-2 ${
                          index === videoTranscriptRepeater.length - 1
                            ? "mb-0"
                            : ""
                        }`}
                      >
                        {videoTranscriptContent}
                      </p>
                    </div>
                  ),
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default SanityVideoComponent;
