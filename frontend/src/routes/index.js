import { Routes, Route } from "react-router-dom";

import Auth from "../Customer/components/Auth/Auth";
import NotFoundPage from "../Customer/pages/NotFoundPage/NotFoundPage";
import ForgotPassword from "../Customer/components/Auth/ForgotPassword";
import ConfirmOTP from "../Customer/components/Auth/confirmOTP";
import ConfirmOTPChange from "../Customer/components/Auth/confirmOTPChange";

import DefaultComponent from "../Customer/components/DefaultComponent/DefaultComponent";
import HomePage from "../Customer/pages/HomePage/HomePage";
import ProductPage from "../Customer/pages/ProductPage/ProductPage";
import ProductDetailPage from "../Customer/pages/ProductDetail/ProductDetailPage";
import Cart from "../Customer/components/Cart/Cart";
import CheckoutPage from "../Customer/pages/CheckoutPage/CheckoutPage";
import ProfilePage from "../Customer/pages/ProfilePage/ProfilePage";
import HistotyOrderPage from "../Customer/pages/HistoryOrderPage/HistotyOrderPage";

import AdminPage from "../Admin/page/AdminPage";
import DefaultPageAdmin from "../Admin/components/DefaultPageAdmin/DefaultPageAdmin";
import DashBoardPage from "../Admin/page/DashboardPage/DashboardPage";
import UsersManagementPage from "../Admin/page/UsersMangementPage/UsersManagementPage";
import AddressManagementPage from "../Admin/page/AddressManagementPage/AddressManagementPage";
import CateManagementPage from "../Admin/page/CateManagementPage/CateManagementPage";
import CreateCatePage from "../Admin/page/CateManagementPage/CreateCatePage";
import ChatsManagementPage from "../Admin/page/ChatsManagementPage/ChatsManagementPage";
import OrdersManagementPage from "../Admin/page/OrdersManagementPage/OrdersManagementPage";
import ProductsManagementPage from "../Admin/page/ProductsManagementPage/ProductsManagementPage";
import CreateProductPage from "../Admin/page/ProductsManagementPage/CreateProductPage";
import SalesMangementPage from "../Admin/page/SalesMangementPage/SalesManagementPage";
import CreateSalePage from "../Admin/page/SalesMangementPage/CreateSalePage";
import VouchersManagementPage from "../Admin/page/VouchersManagementPage/VouchersManagemetnPage";
import CreateVoucherPage from "../Admin/page/VouchersManagementPage/CreateVoucherPage";
import UpdateSalePage from "../Admin/page/SalesMangementPage/UpdateSalePage";
import UpdateVoucherPage from "../Admin/page/VouchersManagementPage/UpdateVoucherPage";

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

      {/* Admin here */}
      <Route path="/admin" element={<AdminPage />} />

      <Route
        path="/admin/dashboard"
        element={
          <DefaultPageAdmin>
            <DashBoardPage />
          </DefaultPageAdmin>
        }
      />
      <Route
        path="/admin/users"
        element={
          <DefaultPageAdmin>
            <UsersManagementPage />
          </DefaultPageAdmin>
        }
      />
      <Route
        path="/admin/products"
        element={
          <DefaultPageAdmin>
            <ProductsManagementPage />
          </DefaultPageAdmin>
        }
      />
      <Route
        path="/admin/createProduct"
        element={
          <DefaultPageAdmin>
            <CreateProductPage />
          </DefaultPageAdmin>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <DefaultPageAdmin>
            <OrdersManagementPage />
          </DefaultPageAdmin>
        }
      />
      <Route
        path="/admin/chats"
        element={
          <DefaultPageAdmin>
            <ChatsManagementPage />
          </DefaultPageAdmin>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <DefaultPageAdmin>
            <CateManagementPage />
          </DefaultPageAdmin>
        }
      />
      <Route
        path="/admin/createCategory"
        element={
          <DefaultPageAdmin>
            <CreateCatePage />
          </DefaultPageAdmin>
        }
      />
      <Route
        path="/admin/updateCategory/:idCate"
        element={
          <DefaultPageAdmin>
            <CreateCatePage />
          </DefaultPageAdmin>
        }
      />
      <Route
        path="/admin/vouchers"
        element={
          <DefaultPageAdmin>
            <VouchersManagementPage />
          </DefaultPageAdmin>
        }
      />
      <Route
        path="/admin/createVoucher"
        element={
          <DefaultPageAdmin>
            <CreateVoucherPage />
          </DefaultPageAdmin>
        }
      />
      <Route
        path="/admin/updateVoucher/:idVoucher"
        element={
          <DefaultPageAdmin>
            <UpdateVoucherPage />
          </DefaultPageAdmin>
        }
      />
      <Route
        path="/admin/sales"
        element={
          <DefaultPageAdmin>
            <SalesMangementPage />
          </DefaultPageAdmin>
        }
      />
      <Route
        path="/admin/createSale"
        element={
          <DefaultPageAdmin>
            <CreateSalePage />
          </DefaultPageAdmin>
        }
      />

      <Route
        path="/admin/updateSale/:idSale"
        element={
          <DefaultPageAdmin>
            <UpdateSalePage />
          </DefaultPageAdmin>
        }
      />
      <Route
        path="/admin/address"
        element={
          <DefaultPageAdmin>
            <AddressManagementPage />
          </DefaultPageAdmin>
        }
      />
    </Routes>
  );
}
