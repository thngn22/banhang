import React from "react";
import "./ProductCard.css";
import { Link } from "react-router-dom";

const ProductCard = ({ data }) => {
  // console.log("data", data);

  return (
    <div className="productCard w-[15rem] m-3 transition-all cursor-pointer">
      <Link to={`/product/${data.id}`}>
        <div className="">
          <img
            className="h-full w-full object-cover"
            src={data?.productImage}
            alt={data?.productImage}
          />
        </div>

        <div className="textPart bg-white p-3">
          <div className="">
            <p className="font-bold opacity-60">{data?.name}</p>
          </div>

          <div className="flex items-center justify-center space-x-2">
            {/* <p className="font-semibold">150.000đ</p>
          <p className="line-through opacity-50">250.000đ</p>
          <p className="text-green-600 font-semibold">-40%</p> */}
            {/* <p className="font-semibold">{data.productImage}</p>
          <p className="line-through opacity-50">{data.quantity}</p>
          <p className="text-green-600 font-semibold">{data.categoryId}</p> */}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
