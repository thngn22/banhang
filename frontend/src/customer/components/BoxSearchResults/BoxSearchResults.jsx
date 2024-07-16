import React from "react";
import { Link } from "react-router-dom";

const BoxSearchResults = ({
  searchResults,
  handleNavigate,
  handleSetNameSearch,
}) => {
  return (
    <div className="max-h-60 overflow-auto">
      {searchResults.map((product) => (
        <Link
          key={product.id}
          to={`/product/${product.id}`}
          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
          onClick={() => {
            handleSetNameSearch();
          }}
        >
          <div className="flex items-center">
            <div className="w-[2rem] h-[2rem]">
              <img
                className="w-full object-cover object-top rounded-xl"
                src={`${product?.productImage}`}
                alt={`${product?.productImage}`}
              />
            </div>
            <div className="ml-2 flex flex-col justify-between">
              <div className="flex flex-col text-gray-900">
                <p className="text-sm font-medium">{product?.name}</p>
                {product?.discountRate > 0 ? (
                  <div className="flex gap-2 items-center">
                    <p className="text-sm">
                      {product?.salePrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                    <p className="text-xs line-through text-gray-400">
                      {product?.estimatedPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  </div>
                ) : (
                  <p>
                    {product?.estimatedPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BoxSearchResults;
