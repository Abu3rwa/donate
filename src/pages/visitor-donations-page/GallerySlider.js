import React from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function GallerySlider({ images, campaignName, height = 220 }) {
  const [current, setCurrent] = React.useState(0);
  const [fade, setFade] = React.useState(false);
  const total = images.length;
  const intervalRef = React.useRef();

  // Function to start or restart the auto-slide interval
  const startAutoSlide = React.useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (total <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));
    }, 5000 + Math.floor(Math.random() * 1000)); // Slower: 5s + random offset
  }, [total]);

  // Start auto-slide on mount and when total changes
  React.useEffect(() => {
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, [startAutoSlide, total]);

  // Fade effect on image change
  React.useEffect(() => {
    setFade(true);
    const timeout = setTimeout(() => setFade(false), 400);
    return () => clearTimeout(timeout);
  }, [current]);

  // When user clicks a thumbnail or nav, reset the interval
  const handleSetCurrent = (i) => {
    setCurrent(i);
    startAutoSlide();
  };

  const goPrev = (e) => {
    e.stopPropagation();
    handleSetCurrent(current === 0 ? total - 1 : current - 1);
  };
  const goNext = (e) => {
    e.stopPropagation();
    handleSetCurrent(current === total - 1 ? 0 : current + 1);
  };

  if (total === 0) return null;
  return (
    <div className="donate-gallery-slider relative flex flex-col items-center justify-center w-full">
      <div
        className="relative flex items-center justify-center w-full"
        style={{ minHeight: height, maxHeight: height }}
      >
        {total > 1 && (
          <button
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow hover:bg-gray-100"
            onClick={goPrev}
            title="السابق"
            aria-label="السابق"
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </button>
        )}
        <img
          src={images[current]}
          alt={campaignName + " صورة " + (current + 1)}
          className={`donate-gallery-img rounded border mx-auto transition-opacity duration-400 ${
            fade ? "opacity-0" : "opacity-100"
          }`}
          style={{
            width: "100%",
            height: height,
            objectFit: "cover",
            display: "block",
            transition: "opacity 0.4s cubic-bezier(.4,0,.2,1)",
          }}
        />
        {total > 1 && (
          <button
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow hover:bg-gray-100"
            onClick={goNext}
            title="التالي"
            aria-label="التالي"
          >
            <ArrowForwardIosIcon fontSize="small" />
          </button>
        )}
      </div>
      {/* Thumbnails below main image, visually part of the same gallery */}
      {total > 1 && (
        <div className="flex gap-2 mt-2">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={campaignName + " مصغرة " + (i + 1)}
              className={`rounded border cursor-pointer ${
                i === current
                  ? "ring-2 ring-green-600"
                  : "opacity-70 hover:opacity-100"
              }`}
              style={{ width: 40, height: 40, objectFit: "cover" }}
              onClick={() => handleSetCurrent(i)}
            />
          ))}
        </div>
      )}
      {/* Dots */}
      {total > 1 && (
        <div className="flex gap-1 mt-1">
          {images.map((_, i) => (
            <span
              key={i}
              className={`inline-block w-2 h-2 rounded-full ${
                i === current ? "bg-green-600" : "bg-gray-300"
              }`}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
}
