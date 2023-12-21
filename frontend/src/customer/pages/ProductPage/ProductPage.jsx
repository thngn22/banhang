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

  // console.log("filterProducts", filterProducts);
  // console.log("sizeInCate", sizeInCate);
  // console.log("colorInCate", colorInCate);

  const onChange = (pageNumber) => {
    setPageNumber(pageNumber);
  };
  const handleSizeChange = (value) => {
    setTimeout(() => {
      setSize(value);
    }, 0);
  };

  const handleColorChange = (value) => {
    setTimeout(() => {
      setColor(value);
    }, 0);
  };

  const handleSort = (value) => {
    setTimeout(() => {
      setSort(value);
    }, 0);
  };
  const handlePriceChange = (value) => {
    setTimeout(() => {
      setPriceMin(value[0]);
      setPriceMax(value[1]);
    }, 1000);
  };

  // console.log("filterProducts", filterProducts);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {categoryName}
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              justifyContent: "space-between",
              width: "60%", // Chiều rộng cố định cho phần chứa Slider
            }}
          >
            {/* Combo box for Size and Color */}
            <div style={{ display: "flex" }}>
              <Select
                defaultValue=""
                defaultActiveFirstOption
                onChange={handleSizeChange}
                style={{ marginRight: "10px", width: "120px" }}
              >
                <Option value="">Chọn Size</Option>
                {sizeInCate &&
                  sizeInCate.map((size) => (
                    <Option value={size}>{size}</Option>
                  ))}
              </Select>

              <Select
                defaultValue=""
                defaultActiveFirstOption
                onChange={handleColorChange}
                style={{ marginRight: "10px", width: "150px" }}
              >
                <Option value="">Chọn màu</Option>
                {colorInCate &&
                  colorInCate.map((color) => (
                    <Option value={color}>{color}</Option>
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
              style={{ width: "70%" }} // Chiều rộng cố định cho Slider
              trackStyle={[{ backgroundColor: "dodgerblue" }]}
              handleStyle={[{ borderColor: "dodgerblue" }]}
            />
          </div>

          {/* Combo box for Sort */}
          <Select
            defaultValue="name_asc"
            defaultActiveFirstOption
            onChange={handleSort}
            style={{ width: "200px" }}
          >
            <Option value="name_asc">Từ A-Z</Option>
            <Option value="name_desc">Từ Z-A</Option>
            <Option value="rating-asc">Rating từ Cao-Thấp</Option>
            <Option value="rating-desc">Rating từ Thấp-Cao</Option>
            <Option value="old_to_new">Từ Cũ - Mới</Option>
            <Option value="new_to_old">Từ Mới - Cũ</Option>
            <Option value="price_asc">Giá từ Thấp-Cao</Option>
            <Option value="price_desc">Giá từ Cao-Thấp</Option>
            <Option value="sold_asc">Số lượng bán từ Cao-Thấp</Option>
            <Option value="sold_desc">Số lượng bán từ Thấp-Cao</Option>
          </Select>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {filterProducts ? (
            filterProducts?.contents?.map((product, index) => (
              <div
                key={index}
                className="group relative"
                style={{ marginLeft: "-12px", marginRight: "-12px" }}
              >
                <ProductCard data={product} />
              </div>
            ))
          ) : (
            <>Không có sản phẩm</>
          )}
        </div>
        {filterProducts && (
          <Pagination
            total={filterProducts?.totalElements}
            pageSize={filterProducts?.pageSize}
            defaultCurrent={filterProducts?.pageNumber}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  );
}
