import Cart from "../Customer/components/Cart/Cart";
import HomePage from "../Customer/pages/HomePage/HomePage";
import ProductDetailPage from "../Customer/pages/ProductDetail/ProductDetailPage";
import ProductPage from "../Customer/pages/ProductPage/ProductPage";
import NotFoundPage from "../Customer/pages/NotFoundPage/NotFoundPage";

import ForgotPassword from "../Customer/components/Auth/ForgotPassword";
import ConfirmOTP from "../Customer/components/Auth/confirmOTP";
import AdminPage from "../Admin/page/AdminPage";
import { Routes, Route } from "react-router-dom";
import DefaultComponent from "../Customer/components/DefaultComponent/DefaultComponent";
import ProfilePage from "../Customer/pages/ProfilePage/ProfilePage";
import HistotyOrderPage from "../Customer/pages/HistoryOrderPage/HistotyOrderPage";
import ConfirmOTPChange from "../Customer/components/Auth/confirmOTPChange";
import CheckoutPage from "../Customer/pages/CheckoutPage/CheckoutPage";
import Auth from "../Customer/components/Auth/Auth";

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DefaultComponent>
            <HomePage />
          </DefaultComponent>
        }
      />
      <Route path="/auth" element={<Auth />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/otp/:email" element={<ConfirmOTP />} />
      <Route path="/otp/change/:forwhat" element={<ConfirmOTPChange />} />
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
      <Route path="/checkout" element={<CheckoutPage />} />
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
  );
}
