import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { ZoomIn, ZoomOut, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Custom Image Zoom Component
const ImageZoom = ({ src, alt, className }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!isZoomed) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomStyle({});
  };

  return (
    <div className={`relative overflow-hidden cursor-zoom-in ${className}`}>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 ease-out"
        style={zoomStyle}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onError={(e) => {
          e.target.src = "/placeholder-image.jpg"; // Fallback image
        }}
      />
      {isZoomed && (
        <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
          <ZoomIn size={12} className="inline mr-1" />
          Zoom Active
        </div>
      )}
    </div>
  );
};

// Image Gallery Component
const ImageGallery = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Safe access to images array with fallback
  const imageUrls = images || [];

  // If no images provided, show placeholder
  if (imageUrls.length === 0) {
    return (
      <div className="space-y-4">
        <div className="h-96 md:h-[500px] bg-gray-200 rounded-xl flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
              <ZoomIn size={24} />
            </div>
            <p>No images available</p>
          </div>
        </div>
      </div>
    );
  }

  const handleDownloadImage = () => {
    const currentImage = imageUrls[activeIndex];
    if (currentImage) {
      const link = document.createElement("a");
      link.href = currentImage;
      link.download = `property-image-${activeIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShareImage = async () => {
    const currentImage = imageUrls[activeIndex];
    if (navigator.share && currentImage) {
      try {
        await navigator.share({
          title: "Property Image",
          url: currentImage,
        });
      } catch (error) {
        // Fallback: copy to clipboard
        console.log(error);
        navigator.clipboard.writeText(currentImage);
        alert("Image URL copied to clipboard!");
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image Slider */}
      <div className="relative group">
        <Swiper
          modules={[Navigation, Thumbs]}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          className="main-slider h-96 md:h-[500px] rounded-xl overflow-hidden shadow-lg"
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          loop={imageUrls.length > 1}
          grabCursor={true}
        >
          {imageUrls.map((image, index) => (
            <SwiperSlide key={index}>
              <ImageZoom
                src={image}
                alt={`Property image ${index + 1}`}
                className="w-full h-full"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        {imageUrls.length > 1 && (
          <>
            <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </div>
            <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </div>
          </>
        )}

        {/* Image Counter and Actions */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
          <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {activeIndex + 1} / {imageUrls.length}
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-black/70 text-white border-0 hover:bg-black/80"
              onClick={handleShareImage}
            >
              <Share2 size={16} />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-black/70 text-white border-0 hover:bg-black/80"
              onClick={handleDownloadImage}
            >
              <Download size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Thumbnail Slider */}
      {imageUrls.length > 1 && (
        <div className="relative">
          <Swiper
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={3}
            watchSlidesProgress={true}
            className="thumbs-slider"
            breakpoints={{
              480: { slidesPerView: 4 },
              640: { slidesPerView: 5 },
              768: { slidesPerView: 6 },
              1024: { slidesPerView: 7 },
              1280: { slidesPerView: 8 },
            }}
          >
            {imageUrls.map((image, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                    activeIndex === index
                      ? "border-blue-500 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => {
                    // Manual slide to specific index
                    if (thumbsSwiper) {
                      thumbsSwiper.slideTo(index);
                    }
                    setActiveIndex(index);
                  }}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-16 md:h-20 object-cover hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Image Info */}
      <div className="text-center text-sm text-gray-600">
        <p>Click and drag to navigate • Hover over main image to zoom</p>
      </div>
    </div>
  );
};

export default ImageGallery;
