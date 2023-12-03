import Cart from "../customer/components/Cart/Cart";
import HomePage from "../customer/pages/HomePage/HomePage";
import ProductDetailPage from "../customer/pages/ProductDetail/ProductDetailPage";
import ProductPage from "../customer/pages/ProductPage/ProductPage";
import NotFoundPage from "../customer/pages/NotFoundPage/NotFoundPage";

import SignIn from "../customer/components/Auth/SignIn";
import SignUp from "../customer/components/Auth/SignUp";
import ForgotPassword from "../customer/components/Auth/ForgotPassword";
import ConfirmOTP from "../customer/components/Auth/confirmOTP";
import AdminPage from "../Admin/page/AdminPage";
import { Routes, Route, useNavigate } from "react-router-dom";
import DefaultComponent from "../customer/components/DefaultComponent/DefaultComponent";

export default function AppRouter() {
  <Routes>
    <Route
      path="/"
      element={
          <HomePage />

      }
    />
    <Route path="/login" element={<SignIn />} />
    <Route path="/forgot" element={<ForgotPassword />} />
    <Route path="/register" element={<SignUp />} />
    <Route path="/otp" element={<ConfirmOTP />} />
    <Route
      path="/productDetail"
      element={
        <DefaultComponent>
          <ProductDetailPage />
        </DefaultComponent>
      }
    />
    <Route
      path="/products"
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
    <Route
      path="/admin"
      element={
        <DefaultComponent>
          <AdminPage />
        </DefaultComponent>
      }
    />
  </Routes>;
}
