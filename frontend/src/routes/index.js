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
import ProfilePage from "../customer/pages/ProfilePage/ProfilePage";
import HistotyOrderPage from "../customer/pages/HistoryOrderPage/HistotyOrderPage";

export default function AppRouter() {
  return (
    <>
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
        <Route path="/otp/:email" element={<ConfirmOTP />} />
        <Route
          path="/product/:productId"
          element={
            <DefaultComponent>
              <ProductDetailPage />
            </DefaultComponent>
          }
        />
        <Route
          path="/products/category/:categoryId/:categoryName"
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
        <Route
          path="/profile"
          element={
            <DefaultComponent>
              <ProfilePage />
            </DefaultComponent>
          }
        />
        <Route
          path="/history-order"
          element={
            <DefaultComponent>
              <HistotyOrderPage />
            </DefaultComponent>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
}
