import React from "react";
import "./ProductCard.css";
import { Link } from "react-router-dom";
import { Rate, Space } from "antd";

const ProductCard = ({ data }) => {
  // console.log("data", data);
  const desc = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"];

  return (
    <div className="productCard w-[15rem] m-3 transition-all cursor-pointer border border-gray-300">
      <Link to={`/product/${data.id}`}>
        <div className="">
          <img
            className="h-full w-full object-cover"
            src={data?.productImage}
            alt={data?.productImage}
          />
        </div>

        <div className="textPart bg-white p-2">
          <div className="text-left">
            <Space className="configStar">
              <>
                <Rate tooltips={desc} disabled value={data?.rating} allowHalf />
              </>
            </Space>
            <span className="float-right">Sold: {data?.sold}</span>
          </div>
          <div className="text-left">
            <p className="font-semibold">{data?.name}</p>
          </div>

          <div className="flex items-center space-x-2 text-left">
            <span className="text-red-600">Giá:</span>
            <span className="text-red-600">
              {parseFloat(data?.estimatedPrice)?.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
