import ProductCard from "../../components/Product/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import * as ProductService from "../../../services/ProductService";
import { Pagination, Select, Slider } from "antd";
import { useState } from "react";
import { Option } from "antd/es/mentions";
import * as FilterService from "../../../services/FilterService";

export default function ProductPage() {
  const { categoryId, categoryName } = useParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [sort, setSort] = useState("");

  const { data: filterProducts } = useQuery({
    queryKey: [categoryId, pageNumber, sort, size, color, priceMax, priceMin],
    queryFn: () => {
      return ProductService.getFilterProduct({
        category_id: categoryId,
        page_number: pageNumber,
        sort: sort,
        size: size,
        color: color,
        min_price: priceMin,
        max_price: priceMax,
      });
    },
  });

  const { data: sizeInCate } = useQuery({
    queryKey: ["sizeInCate", categoryId],
    queryFn: () => {
      return FilterService.getSizeInCate({
        category_id: categoryId,
      });
    },
  });

  const { data: colorInCate } = useQuery({
    queryKey: ["colorInCate", categoryId],
    queryFn: () => {
      return FilterService.getColorInCate({
        category_id: categoryId,
      });
    },
  });

  const onChange = (pageNumber) => {
    setPageNumber(pageNumber);
  };
  const handleField = (value, setField) => {
    setTimeout(() => {
      setField(value);
    }, 0);
  };
  const handlePriceChange = (value) => {
    setTimeout(() => {
      setPriceMin(value[0]);
      setPriceMax(value[1]);
    }, 1000);
  };

  return (
    <div className="bg-white flex justify-center">
      <div className="w-full px-24 py-10">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {categoryName}
        </h2>

        <div className="flex justify-between mt-8">
          <div className="flex items-stretch justify-between w-2/3">
            {/* Combo box for Size and Color */}
            <div className="flex">
              <Select
                defaultValue=""
                defaultActiveFirstOption
                onChange={(value) => handleField(value, setSize)}
                className="mr-2 w-28"
              >
                <Option value="">Chọn Size</Option>
                {sizeInCate &&
                  sizeInCate.map((size) => (
                    <Option key={size} value={size}>
                      {size}
                    </Option>
                  ))}
              </Select>

              <Select
                defaultValue=""
                defaultActiveFirstOption
                onChange={(value) => handleField(value, setColor)}
                className="mr-2 w-36"
              >
                <Option value="">Chọn màu</Option>
                {colorInCate &&
                  colorInCate.map((color) => (
                    <Option key={color} value={color}>
                      {color}
                    </Option>
                  ))}
              </Select>
            </div>

            {/* Slider for Price */}
            <Slider
              range
              defaultValue={[0, 2000000]}
              min={0}
              max={2000000}
              tipFormatter={(value) => `${value.toLocaleString()} VNĐ`}
              onChange={handlePriceChange}
              className="w-3/4"
              trackStyle={[{ backgroundColor: "dodgerblue" }]}
              handleStyle={[{ borderColor: "dodgerblue" }]}
            />
          </div>

          {/* Combo box for Sort */}
          <Select
            defaultValue="name_asc"
            defaultActiveFirstOption
            onChange={(value) => handleField(value, setSort)}
            className="w-52"
          >
            <Option value="name_asc">Từ A-Z</Option>
            <Option value="name_desc">Từ Z-A</Option>
            <Option value="rating_asc">Rating từ Cao-Thấp</Option>
            <Option value="rating_desc">Rating từ Thấp-Cao</Option>
            <Option value="old_to_new">Từ Cũ - Mới</Option>
            <Option value="new_to_old">Từ Mới - Cũ</Option>
            <Option value="price_asc">Giá từ Thấp-Cao</Option>
            <Option value="price_desc">Giá từ Cao-Thấp</Option>
            <Option value="sold_asc">Số lượng bán từ Cao-Thấp</Option>
            <Option value="sold_desc">Số lượng bán từ Thấp-Cao</Option>
          </Select>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8">
          {filterProducts ? (
            filterProducts?.contents?.map((product, index) => (
              <div key={index} className="group relative">
                <ProductCard data={product} />
              </div>
            ))
          ) : (
            <>Không có sản phẩm</>
          )}
        </div>
        {filterProducts && (
          <div className="flex justify-center mt-6">
            <Pagination
              total={filterProducts?.totalElements}
              pageSize={filterProducts?.pageSize}
              current={filterProducts?.pageNumber}
              onChange={onChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
