import React, { useState } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { RadioGroup } from "@headlessui/react";
import Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
import ProductCard from "../../components/Product/ProductCard";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../../services/ProductService";
import * as CartService from "../../../services/CartService";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/slides/userSlide";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as AuthService from "../../../services/AuthService";
import { loginSuccess } from "../../../redux/slides/authSlice";
import { Modal, Rate, Space, Table, message } from "antd";
import Review from "../../components/Product/Review";
import MultiCarousel from "../../components/MultiCarousel/MultiCarousel";
// import parse from "html-react-parser";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetailPage() {
  const [selectedColor, setSelectedColor] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { productId } = useParams();
  const queryClient = useQueryClient();
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const desc = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"];
  const [selectedQuantityStock, setSelectedQuantityStock] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const [contentHeight, setContentHeight] = useState(0);
  const pageIntroduction = require(`../../../Data/image/chọn size giày mới.png`);
  const [defaultImage, setDefaultImage] = useState();

  const parse = require("html-react-parser").default;

  const { data: productDetail } = useQuery({
    queryKey: ["category", productId],
    queryFn: () => {
      return ProductService.getProductDetail(productId);
    },
  });

  React.useEffect(() => {
    if (productDetail) {
      // Lấy màu đầu tiên trong danh sách
      const defaultColor =
        productDetail.productItemResponses?.[0]?.variationColor;

      // Đặt màu được chọn ban đầu
      setSelectedColor(defaultColor);
      setDefaultImage(productDetail?.productImage);

      // Tìm phần tử được chọn ban đầu
      const defaultColorElement = productDetail.productItemResponses?.find(
        (item) => item.variationColor === defaultColor
      );

      // Nếu có phần tử được chọn ban đầu, thì lấy danh sách phần tử
      const defaultItems = defaultColorElement?.listProductItem || [];

      // Tìm phần tử đầu tiên có quantityInStock > 0
      const defaultItem = defaultItems.find((item) => item.quantityInStock > 0);

      // Nếu có phần tử, đặt variationSize và giá trị khác
      if (defaultItem) {
        setSelectedSize(defaultItem.variationSize);
        setSelectedQuantityStock(defaultItem.quantityInStock);
        setSelectedPrice(defaultItem.price);
      }
    }
  }, [productDetail]);

  // Find the element with the matching variationColor
  const selectedElement = productDetail?.productItemResponses?.find(
    (item) => item.variationColor === selectedColor
  );

  // If the element is found, map over its listProductItem
  const selectedItems = selectedElement ? selectedElement.listProductItem : [];

  const handlePlusQuantity = () => {
    setSelectedQuantity((prev) => prev + 1);
  };
  const handleSubQuantity = () => {
    setSelectedQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };
  const handleSizeChange = (selectedSize) => {
    const selectedProductItem = selectedItems.find(
      (item) => item.variationSize === selectedSize
    );

    if (selectedProductItem) {
      setSelectedQuantityStock(selectedProductItem.quantityInStock);
      setSelectedPrice(selectedProductItem.price);
      setSelectedQuantity(1);
    }
  };
  const handleColorChange = (selectedColor) => {
    // Tìm phần tử được chọn
    const defaultColorElement = productDetail.productItemResponses?.find(
      (item) => item.variationColor === selectedColor
    );

    // Nếu có phần tử được chọn, thì lấy danh sách phần tử
    const defaultItems = defaultColorElement?.listProductItem || [];

    // Tìm phần tử đầu tiên có quantityInStock > 0
    const defaultItem = defaultItems.find((item) => item.quantityInStock > 0);
    setDefaultImage(defaultItems[0]?.productImage);

    // Nếu có phần tử, đặt variationSize và giá trị khác
    if (defaultItem) {
      setSelectedSize(defaultItem.variationSize);
      setSelectedQuantityStock(defaultItem.quantityInStock);
      setSelectedPrice(defaultItem.price);
      setSelectedQuantity(1);
    } else {
      setSelectedQuantity(0);
    }
  };

  React.useEffect(() => {
    // Lấy chiều cao của nội dung mô tả
    const descriptionElement = document.getElementById("productDescription");
    setContentHeight(descriptionElement.clientHeight);
  }, [productDetail?.description, expanded]);

  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const refreshToken = async () => {
    try {
      const data = await AuthService.refreshToken();
      return data?.accessToken;
    } catch (err) {
      console.log("err", err);
    }
  };
  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      let date = new Date();
      if (auth?.accessToken) {
        const decodAccessToken = jwtDecode(auth?.accessToken);
        if (decodAccessToken.exp < date.getTime() / 1000) {
          const data = await refreshToken();
          const refreshUser = {
            ...auth,
            accessToken: data,
          };

          dispatch(loginSuccess(refreshUser));
          config.headers["Authorization"] = `Bearer ${data}`;
        }
      }

      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const mutation = useMutationHook((data) => {
    const res = CartService.updateCart(data, auth.accessToken, axiosJWT);
    return res;
  });

  console.log("des", productDetail?.description);

  return (
    <div className="bg-white">
      <div className="pt-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        {/* Information Product */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10 pb-10 pt-4 lg:pb-16 lg:pt-6">
          {/* Image gallery */}
          <div className="flex flex-col">
            <div className="overflow-hidden rounded-lg max-w-full max-h-[34.3rem]">
              {defaultImage && (
                <img
                  src={defaultImage}
                  alt={defaultImage}
                  className="h-full w-full object-cover object-center"
                />
              )}
            </div>
          </div>

          {/* Product info */}
          <div className="lg:col-span-1 maxt-auto max-w-2x1 lg:max-w-7x1">
            <div className="lg:col-span-2">
              <h1 className="text-lg lg:text-3xl font-semibold text-gray-900 text-left">
                {productDetail?.name}
              </h1>
            </div>

            {/* Options */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <div className="flex space-x-5 items-center text-lg lg-test-x1 text-gray-900 mt-1">
                <p
                  className="text-red-600 font-semibold"
                  style={{ fontSize: "26px" }}
                >
                  {selectedPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>

              {/* Reviews */}
              <Space
                style={{
                  display: "flex",
                  textAlign: "left",
                }}
              >
                <>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Rate
                      tooltips={desc}
                      disabled
                      value={productDetail?.rating}
                      allowHalf
                    />
                    {productDetail?.rating ? (
                      <span style={{ marginLeft: "8px" }}>
                        {desc[productDetail?.rating - 1]}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </>

                <span style={{ color: "blue" }}>
                  ({productDetail?.reviews?.length} đánh giá)
                </span>
              </Space>

              <form className="mt-5">
                {/* Colors */}
                <span className="text-sm font-semibold text-gray-900 flex items-center">
                  <span className="mr-2">Tình trạng:</span>
                  {selectedQuantityStock > 0 ? (
                    <span className="text-green-600">
                      Còn hàng ({selectedQuantityStock})
                    </span>
                  ) : (
                    <span className="text-red-600">Hết hàng</span>
                  )}
                </span>
                {/* 
                <span className="text-sm font-semibold text-gray-900">
                  Giá: {selectedPrice} VND
                </span> */}
                <div>
                  <RadioGroup
                    value={selectedColor}
                    onChange={(value) => {
                      setSelectedColor(value);
                      handleColorChange(value);
                    }}
                    className="mt-4"
                  >
                    <div className="flex items-center space-x-3">
                      {productDetail?.productItemResponses.map(
                        (item, index) => (
                          <RadioGroup.Option
                            key={index}
                            value={item?.variationColor}
                            style={{ width: "80px" }}
                            className={({ active, checked }) =>
                              classNames(
                                "ring-green-500",
                                active && checked ? "ring ring-offset-1" : "",
                                !active && checked ? "ring-2" : "",
                                "relative -m-0.5 flex flex-col items-center cursor-pointer focus:outline-none"
                              )
                            }
                          >
                            <RadioGroup.Label as="span" className="sr-only">
                              {item?.variationColor}
                            </RadioGroup.Label>
                            <div className="mb-1">
                              <img
                                src={item?.listProductItem[0].productImage}
                                alt={item?.listProductItem[0].productImage}
                              />
                            </div>
                            <span className="text-sm font-semibold">
                              {item?.variationColor}
                            </span>
                          </RadioGroup.Option>
                        )
                      )}
                    </div>
                  </RadioGroup>
                </div>

                {/* Sizes */}
                <div className="mt-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      Kích thước
                    </h3>
                    <p
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      style={{ cursor: "pointer" }}
                      onClick={showModal}
                    >
                      (Cách chọn Kích thước)
                    </p>
                  </div>

                  <RadioGroup
                    value={selectedSize}
                    onChange={(value) => {
                      setSelectedSize(value);
                      handleSizeChange(value);
                    }}
                    className="mt-4"
                  >
                    <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-6">
                      {selectedItems?.map((item, index) => (
                        <RadioGroup.Option
                          key={index}
                          value={item?.variationSize}
                          disabled={item?.quantityInStock < 1 ? true : false}
                          className={({ active }) =>
                            classNames(
                              item?.quantityInStock > 0
                                ? "cursor-pointer bg-white text-gray-900 shadow-sm"
                                : "cursor-not-allowed bg-gray-50 text-gray-200",
                              active ? "ring-2 ring-indigo-500" : "",
                              "group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1"
                            )
                          }
                        >
                          {({ active, checked }) => (
                            <>
                              <RadioGroup.Label as="span">
                                {item?.variationSize}
                              </RadioGroup.Label>
                              {item?.variationSize ? (
                                <span
                                  className={classNames(
                                    active ? "border" : "border-2",
                                    checked
                                      ? "border-indigo-500"
                                      : "border-transparent",
                                    "pointer-events-none absolute -inset-px rounded-md"
                                  )}
                                  aria-hidden="true"
                                />
                              ) : (
                                <span
                                  aria-hidden="true"
                                  className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                >
                                  <svg
                                    className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                    stroke="currentColor"
                                  >
                                    <line
                                      x1={0}
                                      y1={100}
                                      x2={100}
                                      y2={0}
                                      vectorEffect="non-scaling-stroke"
                                    />
                                  </svg>
                                </span>
                              )}
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
                <div className="mt-5">
                  <div className="flex items-center space-x-2">
                    <IconButton
                      onClick={() => handleSubQuantity()}
                      disabled={selectedQuantity < 1}
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                    <span className="py-1 px-7 border rounded-sm">
                      {selectedQuantity}
                    </span>
                    <IconButton
                      onClick={() => handlePlusQuantity()}
                      sx={{ color: "RGB(145,85,253)" }}
                      disabled={selectedQuantity >= selectedQuantityStock}
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </div>
                </div>
                <div className="flex space-x-10 pt-5">
                  <Button
                    variant="contained"
                    sx={{
                      px: "2rem",
                      py: "1rem",
                      bgcolor: "#9155fd",
                      flexGrow: "1",
                    }}
                    onClick={() => {
                      const resultItem =
                        productDetail.productItemResponses.find(
                          (item) =>
                            item.variationColor === selectedColor &&
                            item.listProductItem.some(
                              (subItem) =>
                                subItem.variationSize === selectedSize
                            )
                        );

                      const idProductBuy = resultItem
                        ? resultItem.listProductItem.find(
                            (subItem) => subItem.variationSize === selectedSize
                          ).id
                        : null;
                      const dataToUpdate = {
                        productItemId: idProductBuy,
                        quantity: selectedQuantity,
                      };

                      mutation.mutate([dataToUpdate], {
                        onSuccess: (data) => {
                          queryClient.invalidateQueries({ queryKey: ["cart"] });
                          message.success("Thêm vào giỏ hàng thành công");
                        },
                        onError: (err) => {
                          message.error(`Lỗi ${err}`);
                        },
                      });
                    }}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="text-xl text-left">Mô tả sản phẩm</section>
        <hr class="w-full mt-1 border-t border-gray-300" />
        <section>
          <div
            id="productDescription"
            style={{
              height: expanded ? "100px" : "auto",
              position: "relative",
              overflow: "hidden",
              transition: "height 0.5s ease-in-out", // Thêm hiệu ứng chuyển động
              textAlign: "left",
            }}
          >
            <iframe
              title="productDescription"
              style={{
                border: "none",
                width: "100%",
                height: "100%",
                fontSize: "inherit",
                fontWeight: "inherit",
                // Thêm các thuộc tính CSS khác nếu cần
              }}
              srcDoc={productDetail?.description}
            />
            {contentHeight <= 100 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  paddingTop: "50px",
                  background:
                    "linear-gradient(rgba(255, 255, 255, 0), #FFFFFF)",
                }}
              ></div>
            )}
          </div>

          <Button
            style={{
              backgroundColor: "rgba(0, 119, 204, 0.2)",
              color: "#1f2937",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              transition: "background 0.3s ease-in-out",
              marginTop: "10px",
            }}
            onClick={toggleDescription}
          >
            {expanded ? "Xem thêm" : "Thu gọn"}
          </Button>
        </section>

        {/* Recent Review & Ratings */}
        <section className="mt-4 mb-4">
          <Review dataReviews={productDetail?.reviews} />
        </section>

        {/* Smililer Products */}
        <section className="text-xl text-left ml-8">Sản phẩm bán được nhiều</section>
        <hr class="mb-2 ml-8 mr-8 mt-1 border-t border-gray-300" />
        <MultiCarousel />

        {/* High Rating Products */}
        <section className="text-xl text-left ml-8">Sản phẩm được đánh giá cao</section>
        <hr class=" mb-2 ml-8 mr-8 mt-1 border-t border-gray-300" />
        <MultiCarousel />

        <Modal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okButtonProps={{
            style: { backgroundColor: "red", color: "white" },
          }}
          okText="Update"
          footer={null}
          width={1000}
        >
          <img
            style={{
              width: "100%",
            }}
            src={pageIntroduction}
            alt="Đây là ảnh hướng dẫn chọn size giày"
          />
        </Modal>
      </div>
    </div>
  );
}
