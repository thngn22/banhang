import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import * as ProductService from "../../../services/ProductService";
import ProductCard from "../Product/ProductCard";

const MultiCarousel = (props) => {
  const { data: filterProducts } = useQuery({
    queryKey: ["filterProducts"],
    queryFn: () => {
      return ProductService.getFilterProduct({
        category_id: 4,
      });
    },
  });

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
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
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 6,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3,
    },
  };
  return (
    <div className="mb-4">
      <Carousel responsive={props.homePage ? responsiveHome : responsive}>
        {filterProducts ? (
          filterProducts?.contents?.map((product, index) => (
            <div
              key={index}
              className="group relative"
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
