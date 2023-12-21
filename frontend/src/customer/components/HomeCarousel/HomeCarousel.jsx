import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import "./carousel-custom.css";
import { mainCarouselData } from "./MainCarouselData";

const HomeCarousel = () => {
  const items = mainCarouselData.map((item) => (
    <img
      className="cursor-pointer"
      src={item.image}
      path={item.path}
      role="presentation"
      alt="item-presentation"
      style={{ height: "600px", width: "100%" }}
    />
  ));

  return (
    <AliceCarousel
      items={items}
      disableButtonsControls
      autoPlay
      autoPlayInterval={3000}
      infinite
    />
  );
};

export default HomeCarousel;
