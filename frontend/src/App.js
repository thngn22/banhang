import "./App.css";

import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import AppRouter, { routes } from "./routes/index.js";
import { Fragment, useEffect, useState } from "react";
import DefaultComponent from "./customer/components/DefaultComponent/DefaultComponent";

import { useDispatch, useSelector } from "react-redux";
import * as UserSerVice from "./services/UserService.js";
import { updateUser } from "./redux/slides/userSlide.js";
import { jwtDecode } from "jwt-decode";
import Loading from "./customer/components/LoadingComponent/Loading.jsx";
import { loginSuccess } from "./redux/slides/authSlice.js";
import HomePage from "./customer/pages/HomePage/HomePage.jsx";
import SignIn from "./customer/components/Auth/SignIn.jsx";
import ForgotPassword from "./customer/components/Auth/ForgotPassword.jsx";
import SignUp from "./customer/components/Auth/SignUp.jsx";
import ConfirmOTP from "./customer/components/Auth/confirmOTP.jsx";
import ProductDetailPage from "./customer/pages/ProductDetail/ProductDetailPage.jsx";
import ProductPage from "./customer/pages/ProductPage/ProductPage.jsx";
import Cart from "./customer/components/Cart/Cart.jsx";
import NotFoundPage from "./customer/pages/NotFoundPage/NotFoundPage.jsx";
import AdminPage from "./Admin/page/AdminPage.jsx";

function App() {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.login.currentUser);
  console.log(auth);

  // useEffect(() => {
  //   if (auth.isAdmin) {
  //     navigate("/admin");
  //   }
  // }, []);

  // useEffect(() => {
  //   let storageData = localStorage.getItem("token");
  //   if (storageData) {
  //     handleGetProfileUser(storageData);
  //   }
  // }, []);

  // const handleGetProfileUser = async (accessToken) => {
  //   const res = await UserSerVice.getProfileUser(accessToken);
  //   const decode = jwtDecode(accessToken);
  //   const isAdmin = decode.role[0] === "ROLE_ADMINISTRATOR";
  //   // console.log("isAdmin in handle", isAdmin);
  //   dispatch(loginSuccess({ ...res, accessToken, isAdmin }));
  // };

  const location = useLocation(); // Sử dụng hook useLocation để lấy thông tin về địa chỉ hiện tại
  const currentPath = location.pathname;
  useEffect(() => {
    if (currentPath === "/admin" && (!auth || !auth.isAdmin)) {
      navigate("/");
    }
  }, [currentPath]);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <DefaultComponent>
              <HomePage />
            </DefaultComponent>
          }
        />
        <Route path="/login" element={<SignIn />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/otp" element={<ConfirmOTP />} />
        <Route
          path="/product/:productId"
          element={
            <DefaultComponent>
              <ProductDetailPage />
            </DefaultComponent>
          }
        />
        <Route
          path="/products/category/:categoryId"
          element={
            <DefaultComponent>
              <ProductPage />
            </DefaultComponent>
          }
        />
        <Route
          path="/carts"
          element={
            <DefaultComponent>
              <Cart />
            </DefaultComponent>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

export default App;
