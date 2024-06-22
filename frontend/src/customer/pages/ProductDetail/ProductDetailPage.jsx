import React, { useEffect, useRef, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../../services/ProductService";
import * as CartService from "../../../services/CartService";
import { useDispatch, useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as AuthService from "../../../services/AuthService";
import { loginSuccess } from "../../../redux/slides/authSlice";
import { Modal, Rate, Space, message } from "antd";
import { descReviewStart } from "../../../utils/constants";
import "./styles.css";
import ProductCard from "../../components/Product/ProductCard";
import Review2 from "../../components/Review/Review2";
import pageIntroduction from "../../../Data/image/chọn size giày mới.png";

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
  const [selectedQuantityStock, setSelectedQuantityStock] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [defaultImage, setDefaultImage] = useState();
  const iframeRef = useRef(null);

  const { data: productDetail } = useQuery({
    queryKey: ["category", productId],
    queryFn: () => {
      return ProductService.getProductDetail(productId);
    },
  });
  const { data: topInDetail } = useQuery({
    queryKey: [productDetail?.categoryId?.id],
    queryFn: () => {
      return ProductService.getProductTopInDetail({
        category_id: productDetail?.categoryId?.id,
      });
    },
  });

  useEffect(() => {
    const iframe = iframeRef.current;
    const adjustHeight = () => {
      if (
        iframe &&
        iframe.contentWindow &&
        iframe.contentWindow.document.body
      ) {
        iframe.style.height = `${
          iframe.contentWindow.document.body.scrollHeight + 16
        }px`;
      }
    };

    if (iframe) {
      iframe.addEventListener("load", adjustHeight);
      // Xóa bỏ event listener khi component bị hủy
      return () => {
        iframe.removeEventListener("load", adjustHeight);
      };
    }
  }, [productDetail?.description]);

  useEffect(() => {
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

  return (
    <div className="bg-white">
      <div className="pt-6 mx-auto max-w-7xl ">
        {/* Information Product */}
        <div className="grid grid-cols-2 gap-16 pb-16 pt-6">
          <div className="flex flex-col">
            <div className="overflow-hidden rounded-3xl max-w-full max-h-[34.3rem]">
              {defaultImage && (
                <img
                  src={defaultImage}
                  alt="defaultImage"
                  className="h-full w-full object-cover object-center"
                />
              )}
            </div>
          </div>

          {/* Product info */}
          <div className="col-span-1 maxt-auto max-w-7x1">
            <div className="col-span-2">
              <p className="text-4xl font-extrabold text-gray-900 text-left">
                {productDetail?.name}
              </p>
            </div>

            {/* Options */}
            <div className="row-span-3">
              {productDetail?.rating ? (
                <Space
                  style={{
                    display: "flex",
                    textAlign: "left",
                  }}
                  className="pt-1"
                >
                  <Rate
                    tooltips={descReviewStart}
                    disabled
                    value={productDetail?.rating}
                    allowHalf
                  />

                  <span className="cursor-pointer text-blue-400 text-lg">
                    ({productDetail?.reviews?.length} Review)
                  </span>
                </Space>
              ) : (
                <></>
              )}

              <p className="text-red-600 font-bold text-3xl">
                {selectedPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>

              <hr className="border-solid bg-gray-400 h-[1px] mt-4" />

              <form className="mt-4">
                {/* Colors */}
                <div className="text-xl font-semibold text-gray-900 flex items-center">
                  <span className="mr-2">Status:</span>
                  {selectedQuantityStock > 0 ? (
                    <span className="text-green-600">
                      In Stock ({selectedQuantityStock})
                    </span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </div>

                <RadioGroup
                  value={selectedColor}
                  onChange={(value) => {
                    setSelectedColor(value);
                    handleColorChange(value);
                  }}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-3">
                    {productDetail?.productItemResponses.map((item, index) => (
                      <RadioGroup.Option
                        key={index}
                        value={item?.variationColor}
                        style={{ width: "100px" }}
                        className={({ active, checked }) =>
                          classNames(
                            "ring-black",
                            active && checked ? "ring-1" : "",
                            !active && checked ? "ring-1" : "",
                            "relative -m-0.5 flex flex-col items-center cursor-pointer focus:outline-none rounded-lg p-2"
                          )
                        }
                      >
                        <RadioGroup.Label as="span" className="sr-only">
                          {item?.variationColor}
                        </RadioGroup.Label>
                        <div className="mb-1">
                          <img
                            src={item?.listProductItem[0].productImage}
                            alt="colorItem"
                            className="rounded-lg"
                          />
                        </div>
                        <span className="text-sm font-semibold">
                          {item?.variationColor}
                        </span>
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>

                <hr className="border-solid bg-gray-100 h-[1px] my-4" />

                {/* Sizes */}
                <div className="">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-light text-gray-500">
                      Choose Size
                    </p>
                    <p
                      className="text-sm font-medium text-red-500 hover:opacity-80"
                      style={{ cursor: "pointer" }}
                      onClick={showModal}
                    >
                      (How to choose Size)
                    </p>
                  </div>

                  <RadioGroup
                    value={selectedSize}
                    onChange={(value) => {
                      setSelectedSize(value);
                      handleSizeChange(value);
                    }}
                    className="mt-2"
                  >
                    <div className="grid grid-cols-4 gap-x-10 gap-y-4">
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
                              active ? "" : "",
                              "group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium hover:bg-gray-50 focus:outline-none"
                            )
                          }
                        >
                          {({ active, checked }) => (
                            <>
                              <RadioGroup.Label as="span">
                                {item?.variationSize}
                              </RadioGroup.Label>
                              {item?.variationSize ? (
                                <p
                                  className={classNames(
                                    active
                                      ? "border-2"
                                      : "border-2 border-black",
                                    checked
                                      ? "border-black"
                                      : "border-transparent",
                                    "pointer-events-none absolute -inset-px rounded-md"
                                  )}
                                  aria-hidden="true"
                                />
                              ) : (
                                <p
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
                                </p>
                              )}
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center gap-6 pt-5">
                  <div className="flex justify-center">
                    <div className="flex items-center bg-gray-100 gap-2 py-2 px-4 rounded-full">
                      <IconButton
                        onClick={() => handleSubQuantity()}
                        disabled={selectedQuantity < 1}
                        className="disabled:opacity-50"
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                      <div className="px-4 flex items-center justify-center">
                        <p className="text-lg font-semibold">
                          {selectedQuantity}
                        </p>
                      </div>
                      <IconButton
                        onClick={() => handlePlusQuantity()}
                        sx={{ color: "red" }}
                        disabled={selectedQuantity >= selectedQuantityStock}
                        className="disabled:opacity-50"
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </div>
                  </div>

                  <Button
                    variant="contained"
                    className="btn__custom-add-cart"
                    sx={{
                      py: "1rem",
                      bgcolor: "black",
                      flexGrow: "1",
                      borderRadius: "100px",
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
                          message.success("Successfully Add Cart");
                        },
                        onError: (err) => {
                          console.log(err.message);
                          if (
                            err.message ===
                            "Cannot read properties of null (reading 'accessToken')"
                          ) {
                            message.error("Sign in not yet");
                          } else {
                            message.error(`${err.message}`);
                          }
                        },
                      });
                    }}
                  >
                    Add Cart
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="pb-2 text-xl font-extrabold">Detail Product</p>
          <div id="productDescription">
            <iframe
              ref={iframeRef}
              title="productDescription"
              style={{
                border: "none",
                width: "100%",
                fontSize: "inherit",
                fontWeight: "inherit",
              }}
              srcDoc={productDetail?.description}
            />
          </div>
        </div>

        {/* Recent Review & Ratings */}
        <div className="mt-8">
          <p className="pb-2 text-xl font-extrabold">Reviews & Ratings</p>
          <div className="grid grid-cols-2 gap-x-20 gap-y-4">
            {productDetail?.reviews &&
              productDetail.reviews.map((reviewItem) => (
                <Review2 reviewItem={reviewItem} />
              ))}
          </div>
        </div>

        {/* PRODUCTS RECOMMENDATION */}
        <div className="my-6">
          <p className="text-center text-4xl font-extrabold uppercase">
            You might also like
          </p>
          <div className="mt-6 grid grid-cols-4 gap-20">
            {topInDetail &&
              topInDetail.map((product, index) => (
                <div key={index} className="group relative w-[16rem]">
                  <ProductCard data={product} />
                </div>
              ))}
          </div>
        </div>

        <hr className="border-solid bg-gray-400 h-[1px] mt-4" />

        {/* High Rating Products */}
        <div className="my-8">
          <p className="text-center text-4xl font-extrabold uppercase">
            Highly rated product
          </p>
          <div className="mt-6 grid grid-cols-4 gap-20">
            {topInDetail &&
              topInDetail.map((product, index) => (
                <div key={index} className="group relative w-[16rem]">
                  <ProductCard data={product} />
                </div>
              ))}
          </div>
        </div>

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
            alt="How to choose size"
          />
        </Modal>
      </div>
    </div>
  );
}
