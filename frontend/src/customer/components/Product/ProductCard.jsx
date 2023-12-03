import React from "react";
import "./ProductCard.css";

const ProductCard = ({data}) => {
  return (
    <div className="productCard w-[15rem] m-3 transition-all cursor-pointer">
      <div className="">
        <img
          className="h-full w-full object-cover"
          src="https://bizweb.dktcdn.net/100/415/697/products/den-1-ace6a02d-782a-409c-83ef-eaf0e7993eff.jpg?v=1692009483210"
          alt="https://bizweb.dktcdn.net/100/415/697/products/den-1-ace6a02d-782a-409c-83ef-eaf0e7993eff.jpg?v=1692009483210"
        />
      </div>

      <div className="textPart bg-white p-3">
        <div className="">
          <p className="font-bold opacity-60">
            {data.name}
          </p>
          <p>{data.description}</p>
        </div>

        <div className="flex items-center justify-center space-x-2">
          {/* <p className="font-semibold">150.000đ</p>
          <p className="line-through opacity-50">250.000đ</p>
          <p className="text-green-600 font-semibold">-40%</p> */}
          <p className="font-semibold">{data.productImage}</p>
          <p className="line-through opacity-50">{data.quantity}</p>
          <p className="text-green-600 font-semibold">{data.categoryId}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
