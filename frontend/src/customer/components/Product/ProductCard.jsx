import React from "react";
import { Link } from "react-router-dom";
import { Rate, Space } from "antd";

const ProductCard = ({ data }) => {
  const desc = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"];

  return (
    <div className="productCard w-[19rem] transition-all cursor-pointer">
      <Link to={`/product/${data.id}`}>
        <div className="aspect-w-1 aspect-h-1">
          <img
            className="object-cover rounded-3xl"
            src={data?.productImage}
            alt={data?.productImage}
          />
        </div>

        <div className="textPart bg-white p-2">
          <div className="text-left">
            <Space className="configStar">
              <Rate tooltips={desc} disabled value={data?.rating} allowHalf />
            </Space>
            <span className="float-right">Sold: {data?.sold}</span>
          </div>
          <div className="text-left h-14 overflow-hidden">
            <p className="font-bold line-clamp-2 text-lg">{data?.name}</p>
          </div>

          <div className="flex items-center space-x-2 text-left">
            <p className="text-red-600 text-lg font-semibold">
              {Number(data?.estimatedPrice).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
