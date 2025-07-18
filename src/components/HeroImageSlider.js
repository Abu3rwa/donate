import React, { useState, useEffect, useRef } from "react";
import { IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const images = [
  require("../assets/468742514_8766108773469881_4524514268323846924_n.jpg"),
  require("../assets/468500003_8770164286397663_795409730327188365_n.jpg"),
  require("../assets/475801362_1675287210537054_7479658673602311601_n.jpg"),
  require("../assets/481988533_9306874889393264_3406120898396487537_n.jpg"),
  require("../assets/488256335_9483793145034770_3893820036335481734_n.jpg"),
  require("../assets/488612872_4083956205257510_1041545498427009329_n.jpg"),
];

const HeroImageSlider = ({ interval = 5000 }) => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    timeoutRef.current = setTimeout(nextSlide, interval);
    return () => clearTimeout(timeoutRef.current);
  }, [current, interval]);

  return (
    <div className="relative w-full h-[95vh] sm:h-[60vh] md:h-[80vh] overflow-hidden rounded-b-3xl shadow-lg">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`Hero Slide ${idx + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          draggable={false}
        />
      ))}
      {/* Controls */}
      <div className="absolute inset-y-0 left-0 flex items-center z-20">
        <IconButton
          onClick={prevSlide}
          aria-label="Previous slide"
          className="bg-white/70 hover:bg-white/90 m-2"
        >
          <ArrowBackIos />
        </IconButton>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center z-20">
        <IconButton
          onClick={nextSlide}
          aria-label="Next slide"
          className="bg-white/70 hover:bg-white/90 m-2"
        >
          <ArrowForwardIos />
        </IconButton>
      </div>
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full border-2 border-white bg-white/80 transition-all duration-200 ${
              idx === current ? "bg-blue-500 border-blue-500 scale-125" : ""
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroImageSlider;
