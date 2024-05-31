/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/
import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import { Button, Popover as PopoverAntd } from "antd";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faEnvelope, faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import * as CategoryService from "../../../services/CategoryService";
import * as CartService from "../../../services/CartService";
import * as UserService from "../../../services/UserService";
import { loginSuccess, logoutSuccess } from "../../../redux/slides/authSlice";
import { resetUser } from "../../../redux/slides/userSlide";
import Loading from "../LoadingComponent/Loading";
import * as AuthService from "../../../services/AuthService";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import logo from "../../../Data/image/logo.png";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation({
  isHiddenSearch = false,
  isHiddenCart = false,
  isHiddenCate = false,
}) {
  const [open, setOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: () => {
      return CartService.getCartItems(auth?.accessToken, axiosJWT);
    },
    enabled: Boolean(auth?.accessToken),
  });

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const performSearch = () => {
    // Thực hiện các công việc liên quan đến tìm kiếm ở đây
    console.log("Performing search...");
  };

  const handleNavigate = (url) => {
    navigate(`/${url}`);
  };

  const handleLogout = async () => {
    setIsLoading(true);

    const res = await AuthService.logout(auth?.accessToken, axiosJWT);
    if (res) {
      dispatch(logoutSuccess());
      dispatch(resetUser());

      setIsLoading(false);

      setTimeout(() => {
        window.location.reload();
      });
    }
  };
  const handleLogo = () => {
    navigate("/");
  };

  const fetchAllCategory = async () => {
    const res = await CategoryService.getAllTreeCategory();
    setListCategories(res);

    return res;
  };

  const [listCategories, setListCategories] = React.useState([]);
  React.useEffect(() => {
    fetchAllCategory();
  }, []);

  console.log(cart?.cartItems);

  return (
    <div className="bg-white border-b border-solid border-gray-300">
      <header className="relative bg-white">
        <nav aria-label="Top" className="px-4 py-2 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-40 h-16 items-center">
            {/* Phần 1: Logo và Tên trang web */}
            <div className="flex items-center justify-start">
              <div className="flex cursor-pointer" onClick={handleLogo}>
                <img className="h-[36px] w-auto" src={logo} alt="Logo" />
                <h1 className="ml-1 text-4xl font-semibold text-gray-800">
                  ShoeSizzle
                </h1>
              </div>
            </div>

            {/* Phần 2: Flyout menus */}
            <div className="flex justify-center">
              {!isHiddenCate && (
                <Popover.Group className="flex space-x-6 w-full max-w-screen-lg">
                  {listCategories.map((listCategory) => (
                    <Popover
                      key={listCategory.name}
                      className="flex flex-1 justify-center"
                    >
                      {({ open, close }) => (
                        <>
                          <div className="relative flex">
                            <Popover.Button
                              onClose={() => close()}
                              className={classNames(
                                open
                                  ? "border-indigo-600 text-indigo-600"
                                  : "border-transparent hover:text-gray-800",
                                "relative z-10 -mb-px flex items-center border-b-2 pt-px text-xl font-medium transition-colors duration-200 ease-out outline-[0px]"
                              )}
                            >
                              {listCategory.name}
                            </Popover.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Popover.Panel className="absolute z-10 top-full text-sm text-gray-500">
                              <div
                                className="absolute inset-0 top-1/2 bg-white shadow"
                                aria-hidden="true"
                              />
                              <div className="relative bg-white shadow-lg">
                                <div className="mx-auto max-w-7xl">
                                  <ul
                                    role="list"
                                    aria-labelledby={`${listCategory.name}-heading`}
                                    className=""
                                  >
                                    {listCategory.categories.map((item) => (
                                      <li
                                        key={item.name}
                                        className="flex border-b-[1px] hover:text-gray-800 px-8"
                                      >
                                        <Link
                                          to={`/products/category/${
                                            item.id
                                          }/${encodeURIComponent(item.name)}`}
                                          onClick={() => close()}
                                          className="my-3 text-sm font-medium"
                                        >
                                          {item.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  ))}
                </Popover.Group>
              )}
            </div>

            {/* Phần 3: Right section, lệch về bên phải */}
            <div className="flex justify-end items-center space-x-6">
              <div className="hidden lg:flex lg:items-center lg:space-x-6">
                <Loading isLoading={isLoading}>
                  <PopoverAntd
                    placement="bottomRight"
                    content={
                      <div className="py-1">
                        {auth?.email ? (
                          <>
                            <p
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleNavigate("profile")}
                            >
                              Thông tin tài khoản
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
                        ) : (
                          <>
                            <p
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => handleNavigate("login")}
                            >
                              Đăng nhập
                            </p>
                            <p
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => handleNavigate("register")}
                            >
                              Đăng ký
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
                          className={classNames(
                            "text-sm font-medium text-gray-700 hover:text-gray-800 cursor-pointer flex items-center space-x-1",
                            { "text-indigo-600": open }
                          )}
                        >
                          Đăng nhập/ Đăng ký
                        </div>
                      )}
                    </div>
                  </PopoverAntd>
                </Loading>
              </div>

              <div className="hidden lg:ml-8 lg:flex cursor-pointer">
                <div className="flex items-center text-gray-700 hover:text-gray-800">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg"
                    alt="flag"
                    className="block h-auto w-5 flex-shrink-0"
                  />
                  <span className="ml-3 block text-sm font-medium">VND</span>
                  <span className="sr-only">, change currency</span>
                </div>
              </div>

              {/* Search */}
              {!isHiddenSearch && (
                <div className="flex relative">
                  <a className="p-2 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                      onClick={toggleSearch}
                    />
                  </a>

                  {/* Search Input and Button (Initially Hidden) */}
                  {isSearchVisible && (
                    <div
                      className="absolute top-full left-0 mt-2 bg-white border rounded-md shadow-lg py-2 px-4"
                      style={{
                        zIndex: 1,
                        left: "-266px",
                        display: "flex",
                        marginTop: "12px",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Search..."
                        className="border-2 border-gray-300 rounded-md p-2 mr-2"
                      />
                      <button
                        className="bg-gray-800 text-white rounded-md p-2"
                        onClick={performSearch}
                      >
                        Search
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Cart */}
              {!isHiddenCart && (
                <PopoverAntd
                  placement="bottom"
                  content={
                    <>
                      <div className="dropdown-cart_content p-5 overflow-hidden lg:w-[420px]">
                        <div>
                          <p className="text-center uppercase font-bold border-b-[1px] pb-1">
                            sản phẩm mới thêm vào giỏ hàng
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
                                          className="w-20 h-20 mr-2 object-cover"
                                          alt="giaybitis"
                                        />
                                      </div>
                                      <div className="flex-grow">
                                        <div>
                                          <p>{item?.productItem?.name}</p>
                                          <div>
                                            <strong>Size: </strong>
                                            {item?.productItem?.size}
                                          </div>
                                          <div>
                                            <strong>Color: </strong>
                                            {item?.productItem?.color}
                                          </div>
                                        </div>
                                        <div className="flex mt-2 justify-between">
                                          <div>{item.quantity}</div>
                                          <div>
                                            {item.totalPrice.toLocaleString(
                                              "vi-VN",
                                              {
                                                style: "currency",
                                                currency: "VND",
                                              }
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="text-center">
                                  HIện chưa có sản phẩm
                                </div>
                              )}
                            </div>
                            <div className="line border-b-[1px] w-full mb-1"></div>
                            <div className="cart-total">
                              <div className="flex justify-between items-center py-3">
                                <p className="uppercase font-semibold">
                                  Tổng tiền
                                </p>
                                <p className="text-red-500 font-semibold">
                                  {cart?.totalPrice.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  })}
                                </p>
                              </div>
                              <Link
                                to="/carts"
                                className="uppercase p-2 w-full block text-white bg-black text-center"
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
                      <span className="absolute top-2 right-2 transform translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full px-2 py-1 text-xs font-bold">
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
