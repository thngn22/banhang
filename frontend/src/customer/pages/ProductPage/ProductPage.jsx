import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Pagination, Select, Slider, Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import ProductCard from "../../components/Product/ProductCard";
import * as ProductService from "../../../services/ProductService";
import * as FilterService from "../../../services/FilterService";
import { Option } from "antd/es/mentions";
import "./styles.css";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductPage() {
  const { categoryId, categoryName } = useParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [sort, setSort] = useState("");
  const [applyFilters, setApplyFilters] = useState(false);

  const { data: filterProducts, refetch } = useQuery({
    queryKey: [categoryId, pageNumber, sort, applyFilters],
    queryFn: () => {
      return ProductService.getFilterProduct({
        category_id: categoryId,
        page_number: pageNumber,
        sort: sort,
        size: sizes.join(","), // Join selected sizes for the API request
        color: colors.join(","), // Join selected colors for the API request
        min_price: priceMin,
        max_price: priceMax,
      });
    },
  });

  const { data: sizeInCate } = useQuery({
    queryKey: ["sizeInCate", categoryId],
    queryFn: () => {
      return FilterService.getSizeInCate({ category_id: categoryId });
    },
  });

  const { data: colorInCate } = useQuery({
    queryKey: ["colorInCate", categoryId],
    queryFn: () => {
      return FilterService.getColorInCate({ category_id: categoryId });
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

  const toggleSize = (size) => {
    setSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((s) => s !== size)
        : [...prevSizes, size]
    );
  };

  const toggleColor = (color) => {
    setColors((prevColors) =>
      prevColors.includes(color)
        ? prevColors.filter((c) => c !== color)
        : [...prevColors, color]
    );
  };

  const applyFilterChanges = () => {
    setApplyFilters(true);
    refetch();
  };

  useEffect(() => {
    if (applyFilters) {
      refetch();
    }
  }, [applyFilters, refetch]);

  return (
    <div className="bg-white flex justify-center">
      <div className="flex w-full px-8 py-10">
        <div className="w-1/5">
          <div className="flex flex-col p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-4 border-b-2">
              <p className="text-2xl font-bold">Lọc</p>
              <FilterOutlined className="text-xl" />
            </div>

            <div className="border-b-2 mt-2">
              <p className="font-medium">Giá</p>
              <Slider
                range
                defaultValue={[0, 2000000]}
                min={0}
                max={2000000}
                tipFormatter={(value) => `${value.toLocaleString()} VNĐ`}
                onChange={handlePriceChange}
                trackStyle={[{ backgroundColor: "black" }]}
                handleStyle={[{ borderColor: "black" }]}
              />
            </div>

            <div className="border-b-2 mt-2 pb-4">
              <p className="mt-4 font-medium">Size</p>
              <div className="grid grid-cols-4 gap-2 mt-4">
                {sizeInCate?.map((size, index) => (
                  <div
                    key={index}
                    onClick={() => toggleSize(size)}
                    className={classNames(
                      sizes.includes(size)
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-gray-200",
                      "group relative flex items-center justify-center rounded-full border py-4 text-sm font-medium cursor-pointer"
                    )}
                  >
                    <span>{size}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2">
              <p className="mt-4 font-medium">Màu sắc</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {colorInCate?.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => toggleColor(color)}
                    className={classNames(
                      colors.includes(color)
                        ? "bg-black text-white"
                        : "bg-gray-50 text-gray-400 hover:bg-gray-200",
                      "group relative flex items-center justify-center rounded-xl border py-2 px-3 text-sm cursor-pointer"
                    )}
                  >
                    <span>{color}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <Button
                onClick={applyFilterChanges}
                className="btn__custom-filter bg-black text-white border-none hover:opacity-80 hover:text-white active:bg-gray-900 flex justify-center items-center text-base mt-4"
                style={{
                  width: "100%",
                  padding: "24px",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                Tiến hành lọc
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 ml-8">
          <div className="flex justify-between">
            <p className="text-2xl font-bold tracking-tight text-gray-900">
              {categoryName}
            </p>

            <div className="flex items-center">
              <p className="font-normal text-base text-gray-500">Sort By:</p>
              <Select
                defaultValue="name_asc"
                defaultActiveFirstOption
                onChange={(value) => handleField(value, setSort)}
                className="sortByProduct"
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
          </div>

          <div className="mt-6 flex flex-wrap gap-9">
            {filterProducts ? (
              filterProducts.contents.map((product, index) => (
                <div key={index} className="group relative w-[16rem]">
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
                total={filterProducts.totalElements}
                pageSize={filterProducts.pageSize}
                current={filterProducts.pageNumber}
                onChange={onChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
