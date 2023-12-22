import "./App.css";

import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import AppRouter from "./routes/index.js";
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
import ProfilePage from "./customer/pages/ProfilePage/ProfilePage.jsx";
import HistoryOrderPage from "./customer/pages/HistoryOrderPage/HistotyOrderPage.jsx";

function App() {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.login.currentUser);
  // console.log(auth);

  const location = useLocation(); // Sử dụng hook useLocation để lấy thông tin về địa chỉ hiện tại
  const currentPath = location.pathname;
  useEffect(() => {
    if (currentPath === "/admin" && (!auth || !auth.isAdmin)) {
      navigate("/");
    }
  }, [currentPath]);

  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
