import React from "react";

const AnimateImage = ({ src, alt = "Image", width = 'w-12', height = 'w-12' }) => {
  return (
    <div
      className={`aspect-square ${width} ${height} rounded-md overflow-hidden relative flex justify-center items-center`}
    >
      <img
        src={src}
        alt={alt}
        className="object-cover w-full h-full absolute inset-0"
        onError={(e) => {
          e.target.style.display = "none";
          e.target.parentElement.classList.add("animate-pulse");
          const span = document.createElement("span");
          span.className = "text-white text-[10px]";
          e.target.parentElement.appendChild(span);
        }}
      />
    </div>
  );
};

export default AnimateImage;
