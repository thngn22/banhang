import React, { useState } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { RadioGroup } from "@headlessui/react";
import Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
import { jacket } from "../../../Data/jacket";
import { tShirt } from "../../../Data/t-shirt";
import HomeSectionCard from "../../components/HomeSectionCard/HomeSectionCard";
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
const product = {
  name: "Basic Tee 6-Pack",
  price: "$192",
  href: "#",
  breadcrumbs: [
    { id: 1, name: "Men", href: "#" },
    { id: 2, name: "Clothing", href: "#" },
  ],
  images: [
    {
      src: "https://tailwindui.com/img/ecommerce-images/product-page-02-secondary-product-shot.jpg",
      alt: "Two each of gray, white, and black shirts laying flat.",
    },
    {
      src: "https://tailwindui.com/img/ecommerce-images/product-page-02-tertiary-product-shot-01.jpg",
      alt: "Model wearing plain black basic tee.",
    },
    {
      src: "https://tailwindui.com/img/ecommerce-images/product-page-02-tertiary-product-shot-02.jpg",
      alt: "Model wearing plain gray basic tee.",
    },
    {
      src: "https://tailwindui.com/img/ecommerce-images/product-page-02-featured-product-shot.jpg",
      alt: "Model wearing plain white basic tee.",
    },
  ],
  colors: [
    { name: "White", class: "bg-white", selectedClass: "ring-gray-400" },
    { name: "Gray", class: "bg-gray-200", selectedClass: "ring-gray-400" },
    { name: "Black", class: "bg-gray-900", selectedClass: "ring-gray-900" },
  ],
  sizes: [
    { name: "S", inStock: false },
    { name: "M", inStock: true },
    { name: "L", inStock: true },
    { name: "XL", inStock: true },
  ],
  description:
    'The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: "Black". Need to add an extra pop of color to your outfit? Our white tee has you covered.',
  highlights: [
    "Hand cut and sewn locally",
    "Dyed with our proprietary colors",
    "Pre-washed & pre-shrunk",
    "Ultra-soft 100% cotton",
  ],
  details:
    'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
};
const reviews = { href: "#", average: 4, totalCount: 117 };

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

  const simililer_products = [...jacket, ...tShirt];
  const { data: productDetail } = useQuery({
    queryKey: ["category", productId],
    queryFn: () => {
      return ProductService.getProductDetail(productId);
    },
  });

  React.useEffect(() => {
    productDetail &&
      setSelectedColor(productDetail.productItemResponses?.[0].variationColor);
    productDetail &&
      setSelectedSize(
        productDetail.productItemResponses?.[0].listProductItem?.[0]
          .variationSize
      );
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
      <div className="pt-6">
        {/* <nav aria-label="Breadcrumb">
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            {product.breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">
                  <a
                    href={breadcrumb.href}
                    className="mr-2 text-sm font-medium text-gray-900"
                  >
                    {breadcrumb.name}
                  </a>
                  <svg
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))}
            <li className="text-sm">
              <a
                href={product.href}
                aria-current="page"
                className="font-medium text-gray-500 hover:text-gray-600"
              >
                {product.name}
              </a>
            </li>
          </ol>
        </nav> */}

        {/* Information Product */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10 px-4 pb-16 pt-10 lg:px-8 lg:pb-24 lg:pt-16">
          {/* Image gallery */}
          <div className="flex flex-col item-center">
            <div className="mx-auto overflow-hidden rounded-lg max-w-[30rem] max-h-[35rem]">
              <img
                src={productDetail?.productImage}
                alt={productDetail?.productImage}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="flex flex-wrap space-x-5 justify-center">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg max-w-[5rem] max-h-[5rem] mt-4"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="lg:col-span-1 maxt-auto max-w-2x1 px-4 pb-16 sm:px-6 lg:max-w-7x1 lg:px-8 lg:pb-24">
            <div className="lg:col-span-2">
              <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
                local
              </h1>
              <h1 className="text-lg lg:text-x1 text-gray-900 opacity-60 pt-1">
                {productDetail?.name}
              </h1>
            </div>

            {/* Options */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>

              <div className="flex space-x-5 items-center text-lg lg-test-x1 text-gray-900 mt-1">
                <p className="font-semibold">123</p>
                <p className="opacity-50 line-through">211</p>
                <p className="text-green-600 font-semibold">5%</p>
              </div>

              {/* Reviews */}
              <div className="mt-6">
                <div className="flex item-center space-x-3">
                  <Rating name="read-only" value={5.5} readOnly />
                  <p className="opacity-50 text-sm">1234 Ratings</p>
                  <p className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    123 Reviews
                  </p>
                </div>
              </div>

              <form className="mt-10">
                {/* Colors */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Color</h3>

                  <RadioGroup
                    value={selectedColor}
                    onChange={setSelectedColor}
                    className="mt-4"
                  >
                    <RadioGroup.Label className="sr-only">
                      Choose a color
                    </RadioGroup.Label>
                    <div className="flex items-center space-x-3">
                      {productDetail?.productItemResponses.map(
                        (item, index) => {
                          return (
                            <RadioGroup.Option
                              key={index}
                              value={item?.variationColor}
                              className={({ active, checked }) =>
                                classNames(
                                  "ring-green-500",
                                  active && checked ? "ring ring-offset-1" : "",
                                  !active && checked ? "ring-2" : "",
                                  "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none"
                                )
                              }
                            >
                              <RadioGroup.Label as="span" className="sr-only">
                                {item?.variationColor}
                              </RadioGroup.Label>
                              <span
                                aria-hidden="true"
                                style={{
                                  background: `${item?.variationColor.toLowerCase()}`,
                                }}
                                className={
                                  "h-8 w-8 rounded-full border border-black border-opacity-10 "
                                }
                              />
                            </RadioGroup.Option>
                          );
                        }
                      )}
                    </div>
                  </RadioGroup>
                </div>

                {/* Sizes */}
                <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                    <a
                      href="#"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Size guide
                    </a>
                  </div>

                  <RadioGroup
                    value={selectedSize}
                    onChange={setSelectedSize}
                    className="mt-4"
                  >
                    <RadioGroup.Label className="sr-only">
                      Choose a size
                    </RadioGroup.Label>
                    <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
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
                              "group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6"
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
                <div className="mt-10">
                  <div className="flex items-center space-x-2">
                    <IconButton onClick={() => handleSubQuantity()}>
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                    <span className="py-1 px-7 border rounded-sm">
                      {selectedQuantity}
                    </span>
                    <IconButton
                      onClick={() => handlePlusQuantity()}
                      sx={{ color: "RGB(145,85,253)" }}
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </div>
                </div>
                <div className="flex space-x-10 pt-8">
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
                        },
                      });
                      alert("thêm vào giỏ hàng thành công");
                    }}
                  >
                    Add to Cart
                  </Button>

                  <Button
                    variant="contained"
                    sx={{
                      px: "2rem",
                      py: "1rem",
                      bgcolor: "#FFA500",
                      flexGrow: "2",
                      "&:hover": {
                        opacity: 0.8,
                        bgcolor: "#FF0000", // Đặt opacity là 0.8 khi di chuột qua nút
                      },
                    }}
                  >
                    Purchase
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Recent Review & Ratings */}
        <section></section>

        {/* Smililer Products */}
        <div className="mx-4 lg:mx-8">
          <hr class="w-full my-8 border-t border-gray-300" />
        </div>
        <section className="pt-10">
          <h1 className="py-5 text-xl font-bold">Smililer Products</h1>
          <div className="flex flex-wrap justify-center">
            {simililer_products.map((item, index) => (
              <div key={index} className="group relative">
                <ProductCard data={item} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
