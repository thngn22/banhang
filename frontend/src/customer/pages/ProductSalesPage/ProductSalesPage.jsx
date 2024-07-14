import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import * as ProductService from "../../../services/ProductService";
import ProductCard from "../../components/Product/ProductCard";
import { Pagination } from "antd";

const ProductSalesPage = () => {
  const [pageNumber, setPageNumber] = useState(1);

  const { data: listProductSales } = useQuery({
    queryKey: [pageNumber],
    queryFn: () => {
      return ProductService.getProductSales({
        page_number: pageNumber,
      });
    },
  });

  const onChange = (pageNumber) => {
    setPageNumber(pageNumber);
  };

  return (
    <div className="p-8">
      <p className="text-center text-3xl font-medium mb-8">
        Những sản phẩm có khuyến mãi
      </p>
      <div className="grid grid-cols-5 justify-items-center">
        {listProductSales &&
          listProductSales.contents.map((product, index) => (
            <div key={index} className="group relative w-[16rem]">
              <ProductCard data={product} />
            </div>
          ))}
      </div>
      <div className="flex justify-center mt-2">
        {listProductSales && (
          <Pagination
            total={listProductSales?.totalElements}
            pageSize={listProductSales?.pageSize}
            defaultCurrent={pageNumber}
            showSizeChanger={false}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  );
};

export default ProductSalesPage;
