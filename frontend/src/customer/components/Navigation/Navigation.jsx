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

const navigation = {
  categories: [
    {
      id: "women",
      name: "Women",
      featured: [
        {
          name: "New Arrivals",
          href: "#",
          imageSrc:
            "https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg",
          imageAlt:
            "Models sitting back to back, wearing Basic Tee in black and bone.",
        },
        {
          name: "Basic Tees",
          href: "#",
          imageSrc:
            "https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg",
          imageAlt:
            "Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.",
        },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            { name: "Tops", href: "#" },
            { name: "Dresses", href: "#" },
            { name: "Pants", href: "#" },
            { name: "Denim", href: "#" },
            { name: "Sweaters", href: "#" },
            { name: "T-Shirts", href: "#" },
            { name: "Jackets", href: "#" },
            { name: "Activewear", href: "#" },
            { name: "Browse All", href: "#" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Watches", href: "#" },
            { name: "Wallets", href: "#" },
            { name: "Bags", href: "#" },
            { name: "Sunglasses", href: "#" },
            { name: "Hats", href: "#" },
            { name: "Belts", href: "#" },
          ],
        },
        {
          id: "brands",
          name: "Brands",
          items: [
            { name: "Full Nelson", href: "#" },
            { name: "My Way", href: "#" },
            { name: "Re-Arranged", href: "#" },
            { name: "Counterfeit", href: "#" },
            { name: "Significant Other", href: "#" },
          ],
        },
      ],
    },
    {
      id: "men",
      name: "Men",
      featured: [
        {
          name: "New Arrivals",
          href: "#",
          imageSrc:
            "https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg",
          imageAlt:
            "Drawstring top with elastic loop closure and textured interior padding.",
        },
        {
          name: "Artwork Tees",
          href: "#",
          imageSrc:
            "https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-06.jpg",
          imageAlt:
            "Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.",
        },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            { name: "Tops", href: "#" },
            { name: "Pants", href: "#" },
            { name: "Sweaters", href: "#" },
            { name: "T-Shirts", href: "#" },
            { name: "Jackets", href: "#" },
            { name: "Activewear", href: "#" },
            { name: "Browse All", href: "#" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Watches", href: "#" },
            { name: "Wallets", href: "#" },
            { name: "Bags", href: "#" },
            { name: "Sunglasses", href: "#" },
            { name: "Hats", href: "#" },
            { name: "Belts", href: "#" },
          ],
        },
        {
          id: "brands",
          name: "Brands",
          items: [
            { name: "Re-Arranged", href: "#" },
            { name: "Counterfeit", href: "#" },
            { name: "Full Nelson", href: "#" },
            { name: "My Way", href: "#" },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: "Company", href: "#" },
    { name: "Stores", href: "#" },
  ],
};

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
    console.log("vao dc");
    setIsSearchVisible(!isSearchVisible);
  };

  const performSearch = () => {
    // Thực hiện các công việc liên quan đến tìm kiếm ở đây
    console.log("Performing search...");
  };

  const handleLogin = () => {
    navigate("/login");
  };
  const handleSignUp = () => {
    navigate("/register");
  };

  const handleProfile = () => {
    navigate("/profile");
  };
  const handleOrder = () => {
    navigate("/history-order");
  };
  const handleComeToAdmin = () => {
    navigate("/admin")
  };
  const handleLogout = async () => {
    setIsLoading(true);

    const res = await AuthService.logout(auth?.accessToken, axiosJWT);
    dispatch(logoutSuccess());
    dispatch(resetUser());

    setIsLoading(false);

    setTimeout(() => {
      window.location.reload();
    });
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

  return (
    <div className="bg-white border-b border-solid border-gray-300">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                <Tab.Group as="div" className="mt-2">
                  <div className="">
                    <Tab.List className="-mb-px flex space-x-8 px-4">
                      {listCategories.map((listCategory) => (
                        <Tab
                          key={listCategory.name}
                          className={({ selected }) =>
                            classNames(
                              selected
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-gray-900",
                              "flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium"
                            )
                          }
                        >
                          {listCategory.name}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                  <Tab.Panels as={Fragment}>
                    {listCategories.map((listCategory) => (
                      <Tab.Panel key={listCategory.name} className="space-y-10">
                        <ul
                          role="list"
                          aria-labelledby={`${listCategory.id}--heading-mobile`}
                          className="mt-6 flex flex-col space-y-6"
                        >
                          {listCategory.categories.map((item, index) => (
                            <li
                              key={item.name}
                              className={`flow-root ${
                                index === listCategory.categories.length - 1
                                  ? ""
                                  : "border-b-[1px]"
                              } px-4`}
                            >
                              <a
                                href={"1123"}
                                className="-m-2 block p-2 text-gray-500"
                              >
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  <div className="flow-root">
                    <a
                      href="#"
                      className="-m-2 block p-2 font-medium text-gray-900"
                    >
                      Sign in
                    </a>
                  </div>
                  <div className="flow-root">
                    <a
                      href="#"
                      className="-m-2 block p-2 font-medium text-gray-900"
                    >
                      Create account
                    </a>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6">
                  <a href="#" className="-m-2 flex items-center p-2">
                    <img
                      src="https://tailwindui.com/img/flags/flag-canada.svg"
                      alt=""
                      className="block h-auto w-5 flex-shrink-0"
                    />
                    <span className="ml-3 block text-base font-medium text-gray-900">
                      CAD
                    </span>
                    <span className="sr-only">, change currency</span>
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Welcome to THE BEST SHOES SHOP
        </p>

        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="">
            <div className="flex h-16 items-center">
              <button
                type="button"
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                onClick={() => setOpen(true)}
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <p onClick={handleLogo}>
                  <span className="sr-only">Your Company</span>
                  <img
                    className="h-[64px] w-auto"
                    src="https://cdn.printgo.vn/uploads/media/772948/thiet-ke-logo-shop-giay-10_1583990006.jpg"
                    alt="https://cdn.printgo.vn/uploads/media/772948/thiet-ke-logo-shop-giay-10_1583990006.jpg"
                  />
                </p>
              </div>

              {/* Flyout menus */}
              {!isHiddenCate && (
                <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch z-50">
                  <div className="flex h-full space-x-8">
                    {listCategories.map((listCategory) => (
                      <Popover key={listCategory.name} className="flex">
                        {({ open, close }) => (
                          <>
                            <div className="relative flex">
                              <Popover.Button
                                onClose={() => close()}
                                className={classNames(
                                  open
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-transparent text-gray-700 hover:text-gray-800",
                                  "relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out outline-[0px]"
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
                              <Popover.Panel className="absolute  top-full text-sm text-gray-500">
                                <div
                                  className="absolute inset-0 top-1/2 bg-white shadow"
                                  aria-hidden="true"
                                />

                                <div className="relative bg-white shadow-lg">
                                  <div className="mx-auto max-w-7xl ">
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
                                            to={`/products/category/${item.id}/${encodeURIComponent(item.name)}`}
                                            onClick={() => close()}
                                            className=" my-3"
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
                  </div>
                </Popover.Group>
              )}

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {/* Thông tin người dùng với Popover từ headlessui/react */}
                  <Loading isLoading={isLoading}>
                    <Popover style={{ position: "relative" }}>
                      {({ open }) => (
                        <>
                          <Popover.Button>
                            {auth?.email ? (
                              <div
                                className={classNames(
                                  "text-sm font-medium text-gray-700 hover:text-gray-800 cursor-pointer flex items-center space-x-1",
                                  { "text-indigo-600": open }
                                )}
                              >
                                <FontAwesomeIcon icon={faCircleUser} />
                                <div>{auth.email}</div>
                              </div>
                            ) : (
                              <div
                                className={classNames(
                                  "text-sm font-medium text-gray-700 hover:text-gray-800 cursor-pointer flex items-center space-x-1",
                                  { "text-indigo-600": open }
                                )}
                              >
                                Bạn chưa đăng nhập? Hãy Click vào đây
                              </div>
                            )}
                          </Popover.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                          >
                            <Popover.Panel
                              static
                              className="absolute z-10 top-[36px] right-[-22px] mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg"
                            >
                              <div className="py-1">
                                {auth?.email ? (
                                  <>
                                    <p
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                      onClick={handleProfile}
                                    >
                                      Thông tin tài khoản
                                    </p>
                                    <p
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                      onClick={handleOrder}
                                    >
                                      Đơn hàng
                                    </p>
                                    {auth.isAdmin && (
                                      <p
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        onClick={handleComeToAdmin}
                                      >
                                        Vào trang quản lý
                                      </p>
                                    )}
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
                                      onClick={handleLogin}
                                    >
                                      Đăng nhập
                                    </p>
                                    <p
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      onClick={handleSignUp}
                                    >
                                      Đăng ký
                                    </p>
                                  </>
                                )}
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  </Loading>
                </div>

                <div className="hidden lg:ml-8 lg:flex">
                  <a
                    href="#"
                    className="flex items-center text-gray-700 hover:text-gray-800"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg"
                      alt=""
                      className="block h-auto w-5 flex-shrink-0"
                    />
                    <span className="ml-3 block text-sm font-medium">VND</span>
                    <span className="sr-only">, change currency</span>
                  </a>
                </div>

                {/* Search */}
                {!isHiddenSearch && (
                  <div className="flex lg:ml-6 relative">
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
                {/* {!isHiddenCart && (
                  <div className="ml-4 flow-root lg:ml-6">
                    <a href="#" className="group -m-2 flex items-center p-2">
                      <ShoppingBagIcon
                        className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                        0
                      </span>
                      <span className="sr-only">items in cart, view bag</span>
                    </a>
                  </div>
                )} */}
                {!isHiddenCart && (
                  <PopoverAntd
                    placement="bottom"
                    content={
                      <>
                        <div className="dropdown-cart_content p-5 overflow-hidden lg:w-[420px]">
                          <div>
                            <p className="text-center uppercase font-bold border-b-[1px] pb-2">
                              Giỏ hàng
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
                                            {/* <p>{item?.colorBuy} / {item?.sizeBuy}</p> */}
                                          </div>
                                          <div className="flex mt-2 justify-between">
                                            <div>{item.quantity}</div>
                                            <div>{item.totalPrice}đ</div>
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
                                  <p className="uppercase">Tổng tiền</p>
                                  <p className="text-red-500">
                                    {cart?.totalPrice}đ
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
                    <div className="ml-4 flow-root lg:ml-6">
                      <a href="#" className="group -m-2 flex items-center p-2">
                        <ShoppingBagIcon
                          className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
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
          </div>
        </nav>
      </header>
    </div>
  );
}
