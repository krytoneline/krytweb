import React from "react";
import Carousel from "react-multi-carousel";

function MainHeader({ carouselImg }) {
  const responsive = {
    all: {
      breakpoint: { max: 4000, min: 0 },
      items: 1,
    },
  };

  return (
    <section className="w-full md:mt-1 mt-0">
      <div className="w-full h-full md:h-[60vh] bg-white">
        <Carousel
          responsive={responsive}
          autoPlay
          infinite
          arrows={true}
          showDots
          className="h-full z-0"
        >
          {carouselImg.map((img, index) => (
            <div
              key={index}
              className="w-full h-full flex items-center justify-center"
            >
              <img
                src={img}
                alt="banner"
                className="
                  w-full md:h-[85vh]
                  object-contain
                  md:object-contain
                "
              />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

export default MainHeader;
