import React, { useEffect, useState } from "react";
import { message, Popover as PopoverAntd } from "antd";
import {
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import * as CategoryService from "../../../services/CategoryService";
import * as CartService from "../../../services/CartService";
import { loginSuccess, logoutSuccess } from "../../../redux/slides/authSlice";
import {
  resetUser,
  updateCart,
  updateUser,
} from "../../../redux/slides/userSlide";
import Loading from "../LoadingComponent/Loading";
import * as AuthService from "../../../services/AuthService";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation({
  isHiddenSearch = false,
  isHiddenCart = false,
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showSubCates, setShowSubCates] = useState(false);
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();

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
        const decodedAccessToken = jwtDecode(auth?.accessToken);
        if (decodedAccessToken.exp < date.getTime() / 1000) {
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

  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: () => {
      return CartService.getCartItems(auth?.accessToken, axiosJWT);
    },
    enabled: Boolean(auth?.accessToken),
  });

  const { data: listCategories } = useQuery({
    queryKey: ["listCategories"],
    queryFn: () => {
      return CategoryService.getAllTreeCategory();
    },
  });

  useEffect(() => {
    if (cart && auth) {
      dispatch(updateCart(cart));
      dispatch(updateUser(auth));
    }
  }, [cart, auth]);

  const performSearch = () => {
    console.log("Performing search...");
  };

  const handleNavigate = (url) => {
    navigate(`/${url}`);
  };

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const res = await AuthService.logout(auth?.accessToken, axiosJWT);
      if (res) {
        dispatch(resetUser());
        dispatch(logoutSuccess());
        setIsLoading(false);
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      message.error(`Đã xảy ra lỗi: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleLogo = () => {
    navigate("/");
  };

  const handleClickCate = (index) => {
    setShowSubCates(index + 1);
  };
  const handleCloseCategories = () => {
    setShowCategories(!showCategories);
    setShowSubCates(false);
  };

  return (
    <div className="bg-white border-b border-solid border-gray-300 fixed z-[2000] right-0 left-0 top-0">
      <header className="relative bg-white">
        <nav aria-label="Top" className="py-2 px-8">
          <div className="flex items-center h-16">
            {/* Logo */}
            <div
              className="flex items-center justify-start flex-none cursor-pointer"
              onClick={handleLogo}
            >
              <h1 className="ml-1 text-4xl font-extrabold text-gray-800">
                SHOES.CO
              </h1>
            </div>

            {/* Flyout menus */}
            <div className="flex justify-between ml-20 gap-10">
              <div className="relative">
                <p
                  className="border-transparent hover:text-gray-800 relative z-10 -mb-px flex items-center border-b-2 pt-px text-xl font-medium transition-colors duration-200 ease-out cursor-pointer"
                  onClick={() => {
                    setShowCategories(!showCategories);
                    setShowSubCates(false);
                  }}
                >
                  Shop
                  <svg
                    className="ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </p>
                {showCategories && (
                  <div className="absolute z-10 mt-3">
                    <div className="rounded-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                      <div className="relative grid gap-6 bg-white px-5 py-4">
                        {listCategories.map((parentCategory, index) => (
                          <div
                            key={parentCategory.name}
                            className="relative group w-14 cursor-pointer"
                            onClick={() => handleClickCate(index)}
                          >
                            <p
                              className={classNames(
                                "text-gray-900 flex items-center w-full text-left font-medium transition-colors duration-150 ease-in-out"
                              )}
                            >
                              {parentCategory.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {showSubCates ? (
                  <div
                    className="absolute left-full top-0 mt-10 z-20"
                    style={{ marginLeft: "15.5px" }}
                  >
                    <div className="rounded-lg ring-1 ring-black ring-opacity-5 overflow-hidden w-44">
                      <div className="relative grid gap-6 bg-white px-5 py-4">
                        {listCategories[showSubCates - 1].categories.map(
                          (childCategory) => (
                            <Link
                              key={childCategory.name}
                              to={`/products/category/${
                                childCategory.id
                              }/${encodeURIComponent(childCategory.name)}`}
                              className="flex items-center text-gray-900"
                              onClick={handleCloseCategories}
                            >
                              {childCategory.name}
                            </Link>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <Link
                to="/contact-us"
                className="border-transparent hover:text-gray-800 relative z-10 -mb-px flex items-center border-b-2 pt-px text-xl font-medium transition-colors duration-200 ease-out"
              >
                Khuyến mãi
              </Link>
            </div>

            {/* Search */}
            <div className="flex-1 flex justify-center mx-4">
              <div className="relative w-full max-w-xl">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full rounded-full bg-gray-100 border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2"
                />
                <button
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                  onClick={performSearch}
                >
                  <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Right section */}
            <div className="flex justify-end items-center space-x-6">
              <div className="hidden lg:flex lg:items-center lg:space-x-6">
                <Loading isLoading={isLoading}>
                  <PopoverAntd
                    placement="bottomRight"
                    content={
                      <div className="py-1">
                        {auth?.email && (
                          <>
                            <p
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleNavigate("profile")}
                            >
                              Tài khoản cá nhân
                            </p>
                            <p
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleNavigate("history-order")}
                            >
                              Đơn hàng
                            </p>
                            <p
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                              onClick={handleLogout}
                            >
                              Đăng xuất
                            </p>
                          </>
                        )}
                      </div>
                    }
                    trigger="click"
                  >
                    <div className="focus:outline-none active:shadow-none">
                      {auth?.email ? (
                        <div
                          className={classNames(
                            "text-sm font-medium text-gray-700 hover:text-gray-800 cursor-pointer flex items-center space-x-1",
                            { "text-indigo-600": open }
                          )}
                        >
                          <div className="relative">
                            <img
                              className="w-10 h-10 rounded-full border border-gray-300"
                              src={auth?.avatar}
                              alt="avatar"
                            />
                          </div>
                          <p>{auth.email.split("@gmail.com")}</p>
                        </div>
                      ) : (
                        <div
                          className={
                            "text-sm font-medium text-gray-700 hover:text-gray-800 cursor-pointer flex items-center space-x-1 transition duration-200 transform hover:scale-105 active:scale-95"
                          }
                          onClick={() => handleNavigate("auth")}
                        >
                          Đăng nhập/ Đăng ký
                        </div>
                      )}
                    </div>
                  </PopoverAntd>
                </Loading>
              </div>

              {/* Cart */}
              {!isHiddenCart && (
                <PopoverAntd
                  placement="bottom"
                  content={
                    <>
                      <div className="dropdown-cart_content p-4 overflow-hidden w-[420px]">
                        <div>
                          <p className="text-center text-lg uppercase font-extrabold border-b-[1px] pb-1">
                            sản phẩm đã được thêm vào Giỏ
                          </p>
                          <div className="content-cart">
                            <div className="list-cart py-4">
                              {cart?.cartItems?.length > 0 ? (
                                cart?.cartItems?.map((item, index) => {
                                  return (
                                    <div key={index} className="flex mb-4">
                                      <div className="flex-shrink-0">
                                        <img
                                          src={`${item?.productItem?.productImage}`}
                                          className="w-24 h-24 mr-2 object-cover rounded-xl"
                                          alt="giaybitis"
                                        />
                                      </div>
                                      <div className="flex-grow">
                                        <div>
                                          <p className="text-sm font-bold">
                                            {item?.productItem?.name}
                                          </p>
                                          <div className="flex gap-2">
                                            <p>Color:</p>
                                            <p className="text-gray-400 font-medium">
                                              {item?.productItem?.color}
                                            </p>
                                          </div>
                                          <div className="flex gap-2">
                                            <p>Size:</p>
                                            <p className="text-gray-400 font-medium">
                                              {item?.productItem?.size}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex mt-2 justify-between">
                                          <p className="text-red-400 text-sm font-medium">
                                            {item.totalPrice.toLocaleString(
                                              "vi-VN",
                                              {
                                                style: "currency",
                                                currency: "VND",
                                              }
                                            )}
                                          </p>
                                          <div className="flex gap-2">
                                            <p>Số lượng:</p>
                                            <p className="font-medium">
                                              {item.quantity}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="text-center">
                                  Hiện tại không có sản phẩm nào
                                </div>
                              )}
                            </div>
                            <div className="line border-b-[1px] w-full mb-1"></div>
                            <div className="cart-total">
                              <div className="flex justify-between items-center py-3">
                                <p className="uppercase font-medium">
                                  Tổng tiền
                                </p>
                                <p className="text-red-500 font-bold text-lg">
                                  {cart?.totalPrice.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  })}
                                </p>
                              </div>
                              <Link
                                to="/carts"
                                className="uppercase p-2 w-full block text-white bg-black text-center font-medium hover:text-white hover:opacity-80"
                              >
                                Xem giỏ hàng
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  }
                >
                  <div className="relative ml-4 flow-root lg:ml-6 cursor-pointer">
                    <a className="group -m-2 flex items-center p-2 relative">
                      <ShoppingBagIcon
                        className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="absolute top-2 right-2 transform translate-x-1/2 -translate-y-1/2 bg-slate-900 text-white rounded-full px-2 py-1 text-xs font-bold">
                        {cart?.cartItems?.length > 0
                          ? cart.cartItems.length
                          : 0}
                      </span>
                      <span className="sr-only">items in cart, view bag</span>
                    </a>
                  </div>
                </PopoverAntd>
              )}
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
