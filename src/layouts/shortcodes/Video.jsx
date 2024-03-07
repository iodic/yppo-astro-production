const Video = ({ title, width = 600, height = "auto", src, ...rest }) => {
  return (
    <video
      className="overflow-hidden rounded-md shadow-2xl w-full object-contain mx-auto max-w-3xl w-[94%]"
      width={width}
      height={height}
      controls
      playsInline
      {...rest}
    >
      <source
        src={src.match(/^http/) ? src : `/videos/${src}`}
        type="video/mp4"
      />
      {title}
    </video>
  );
};

export default Video;
