import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProductCard from "../Product/ProductCard";

const MultiCarousel = (props) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };
  const responsiveHome = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };
  return (
    <div className="mb-4">
      <Carousel responsive={props.homePage ? responsiveHome : responsive}>
        {props?.dataCarousel ? (
          props?.dataCarousel?.map((product, index) => (
            <div
              key={index}
              className="group relative w-[17rem]"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <ProductCard data={product} />
            </div>
          ))
        ) : (
          <>
            <div>Item 1</div>
            <div>Item 2</div>
            <div>Item 3</div>
            <div>Item 4</div>
            <div>Item 5</div>
          </>
        )}
      </Carousel>
    </div>
  );
};

export default MultiCarousel;
