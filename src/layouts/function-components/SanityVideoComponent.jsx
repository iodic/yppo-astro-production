import React from "react";

const SanityVideoComponent = ({ videoUrl, videoPoster }) => {
  return (
    <video
      className="mb-6"
      controls={true}
      playsInline={true}
      poster={videoPoster}
    >
      <source src={videoUrl} />
    </video>
  );
};

export default SanityVideoComponent;
