import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import * as ProductService from "../../../services/ProductService";
import ProductCard from "../../components/Product/ProductCard";
import { Pagination } from "antd";

const SearchProductPage = () => {
  const { name } = useParams();
  const [pageNumber, setPageNumber] = useState(1);

  const { data: searchProducts } = useQuery({
    queryKey: [name, pageNumber, "searchProducts"],
    queryFn: () => {
      return ProductService.getMiniSearchProducts({
        search: name,
        page_number: pageNumber,
      });
    },
  });
  const onChange = (pageNumber) => {
    setPageNumber(pageNumber);
  };
  return (
    <div className="flex flex-col justify-center px-20 mb-4">
      <p className="text-center text-3xl font-semibold mt-8">
        Các sản phẩm đã tìm kiếm
      </p>
      <div className="mt-6 grid grid-cols-4 gap-4 justify-items-center">
        {searchProducts ? (
          searchProducts.contents.map((product, index) => (
            <div key={index} className="group relative w-[16rem]">
              <ProductCard data={product} />
            </div>
          ))
        ) : (
          <>Không có sản phẩm</>
        )}
      </div>
      {searchProducts && (
        <div className="flex justify-center mt-6">
          <Pagination
            total={searchProducts.totalElements}
            pageSize={searchProducts.pageSize}
            current={searchProducts.pageNumber}
            onChange={onChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default SearchProductPage;
