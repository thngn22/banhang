import React from "react";
import "./ProductCard.css";

const ProductCard = ({data}) => {
  return (
    <div className="productCard w-[15rem] m-3 transition-all cursor-pointer">
      <div className="">
        <img
          className="h-full w-full object-cover"
          src={data.imageUrl}
          alt={data.imageUrl}
        />
      </div>

      <div className="textPart bg-white p-3">
        <div className="">
          <p className="font-bold opacity-60">
            {data.title}
          </p>
          <p>{data.brand}</p>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <p className="font-semibold">150.000đ</p>
          <p className="line-through opacity-50">250.000đ</p>
          <p className="text-green-600 font-semibold">-40%</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
