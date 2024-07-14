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
import { Modal, Pagination, Rate, Space, message } from "antd";
import { descReviewStart } from "../../../utils/constants";
import "./styles.css";
import ProductCard from "../../components/Product/ProductCard";
import Review2 from "../../components/Review/Review2";
import pageIntroduction from "../../../Data/image/chọn size giày mới.png";
import createAxiosInstance from "../../../services/createAxiosInstance";

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
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const [selectedQuantityStock, setSelectedQuantityStock] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [defaultImage, setDefaultImage] = useState();
  const iframeRef = useRef(null);
  const [pageNumber, setPageNumber] = useState(1);

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
  const { data: productsRS } = useQuery({
    queryKey: [pageNumber],
    queryFn: () => {
      return ProductService.getProductsRS(
        {
          page_number: pageNumber,
        },
        auth.accessToken,
        axiosJWT
      );
    },
    enabled: Boolean(auth?.accessToken),
  });

  const onChange = (pageNumber) => {
    setPageNumber(pageNumber);
  };

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
        setSelectedPrice({
          estimatedPrice: defaultItem.price,
          salePrice: defaultItem.salePrice,
          discountRate: defaultItem.discountRate,
        });
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
      setSelectedPrice({
        estimatedPrice: selectedProductItem.price,
        salePrice: selectedProductItem.salePrice,
        discountRate: selectedProductItem.discountRate,
      });
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
      setSelectedPrice({
        estimatedPrice: defaultItem.price,
        salePrice: defaultItem.salePrice,
        discountRate: defaultItem.discountRate,
      });
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
                    ({productDetail?.reviews?.length} Đánh giá)
                  </span>
                </Space>
              ) : (
                <></>
              )}
              {selectedPrice?.discountRate > 0 &&
              selectedPrice?.discountRate !== null ? (
                <div className="flex items-center space-x-2">
                  <p className="text-red-600 font-bold text-3xl">
                    {Number(selectedPrice?.salePrice).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                  <p className="line-through text-gray-500 text-sm">
                    {Number(selectedPrice?.estimatedPrice).toLocaleString(
                      "vi-VN",
                      {
                        style: "currency",
                        currency: "VND",
                      }
                    )}
                  </p>
                  <p className="bg-red-500 text-white text-sm font-semibold px-2 rounded">
                    -{selectedPrice?.discountRate}%
                  </p>
                </div>
              ) : (
                <p className="text-red-600 font-bold text-3xl">
                  {Number(selectedPrice?.estimatedPrice).toLocaleString(
                    "vi-VN",
                    {
                      style: "currency",
                      currency: "VND",
                    }
                  )}
                </p>
              )}

              <hr className="border-solid bg-gray-400 h-[1px] mt-4" />

              <form className="mt-4">
                {/* Colors */}
                <div className="text-xl font-semibold text-gray-900 flex items-center">
                  <span className="mr-2">Trạng thái:</span>
                  {selectedQuantityStock > 0 ? (
                    <span className="text-green-600">
                      Còn hàng ({selectedQuantityStock})
                    </span>
                  ) : (
                    <span className="text-red-600">Hết hàng</span>
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
                      Chọn Size giày
                    </p>
                    <p
                      className="text-sm font-medium text-red-500 hover:opacity-80"
                      style={{ cursor: "pointer" }}
                      onClick={showModal}
                    >
                      (Cách chọn size)
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
                          message.success("Thêm sản phẩm vào giỏ thành công");
                        },
                        onError: (err) => {
                          console.log(err.message);
                          if (
                            err.message ===
                            "Cannot read properties of null (reading 'accessToken')"
                          ) {
                            message.error("Bạn chưa năng nhập");
                          } else {
                            message.error(`${err.message}`);
                          }
                        },
                      });
                    }}
                  >
                    Thêm sản phẩm vào Giỏ hàng
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="pb-2 text-xl font-extrabold">Chi tiết sản phẩm</p>
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
          <p className="pb-2 text-xl font-extrabold">Review và đánh giá</p>
          <div className="grid grid-cols-2 gap-x-20 gap-y-4">
            {productDetail?.reviews &&
              productDetail.reviews.map((reviewItem) => (
                <Review2 reviewItem={reviewItem} />
              ))}
          </div>
        </div>

        <hr className="border-solid bg-gray-400 h-[1px] mt-4" />

        {/* High Rating Products */}
        <div className="my-8">
          <p className="text-center text-4xl font-extrabold uppercase">
            sản phẩm được đánh giá cao
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

        {/* PRODUCTS RECOMMENDATION */}
        {auth && (
          <div className="mb-4">
            <hr className="border bg-gray-400 mx-5 my-10" />
            <p className="text-4xl text-center font-extrabold pt-10 pb-6 uppercase">
              Những sản phẩm có thể bạn thích
            </p>
            <div className="grid grid-cols-4 justify-items-center">
              {productsRS &&
                productsRS.contents.map((product, index) => (
                  <div key={index} className="group relative w-[16rem]">
                    <ProductCard data={product} />
                  </div>
                ))}
            </div>
            <div className="flex justify-center mt-2">
              {productsRS && (
                <Pagination
                  total={productsRS?.totalElements}
                  pageSize={productsRS?.pageSize}
                  defaultCurrent={pageNumber}
                  showSizeChanger={false}
                  onChange={onChange}
                />
              )}
            </div>
          </div>
        )}

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
