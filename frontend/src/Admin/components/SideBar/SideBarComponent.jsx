import { Menu } from "antd";
import {
  SkinOutlined,
  UserOutlined,
  BarChartOutlined,
  PlusCircleOutlined,
  FormOutlined,
  MessageOutlined,
  FileDoneOutlined,
  AppstoreOutlined,
  EnvironmentOutlined,
  TagsOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getItem } from "../../../utils/untils";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import * as CategoryService from "../../../services/CategoryService";
import { getCategory } from "../../../redux/slides/categorySlice";
import "./styles.css";

const SideBarComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = [
    getItem("Thống kê tổng quan", "statisticalOverview", <BarChartOutlined />),
    getItem("Quản lý Người dùng", "listUsers", <UserOutlined />),
    getItem("Quản lý Danh mục", "sub5", <AppstoreOutlined />, [
      getItem("Danh sách Danh mục", "listCategories", <FormOutlined />),
      getItem("Tạo Danh mục", "addCategory", <PlusCircleOutlined />),
    ]),
    getItem("Quản lý Sản phẩm", "sub2", <SkinOutlined />, [
      getItem("Danh sách sản phẩm", "listProducts", <FormOutlined />),
      getItem("Tạo Sản phẩm", "addProduct", <PlusCircleOutlined />),
    ]),
    getItem("Quản lý Đơn hàng", "listOrders", <FileDoneOutlined />),
    getItem("Chat", "chatbox", <MessageOutlined />),
    getItem("Quản lý Khuyến mãi", "sub3", <PercentageOutlined />, [
      getItem("Danh sách Khuyến mãi", "listSales", <FormOutlined />),
      getItem("Tạo mã Khuyến mãi", "addSale", <PlusCircleOutlined />),
    ]),
    getItem("Quản lý Voucher", "sub4", <TagsOutlined />, [
      getItem("Danh sách Voucher", "listVouchers", <FormOutlined />),
      getItem("Tạo mã Voucher", "addVoucher", <PlusCircleOutlined />),
    ]),
    getItem("Địa chỉ", "address", <EnvironmentOutlined />),
  ];

  const rootSubmenuKeys = ["user", "product", "order", "statistical"];
  const [openKeys, setOpenKeys] = useState(["sub1"]);

  const getAllCatesAdmin = async () => {
    const res = await CategoryService.getAllTreeCategory();
    return res;
  };

  const { data: categoriesRes } = useQuery({
    queryKey: ["categoriesRes"],
    queryFn: getAllCatesAdmin,
  });

  useEffect(() => {
    if (categoriesRes) {
      dispatch(getCategory(categoriesRes));
    }
  }, [categoriesRes]);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const handleMenuClick = (e) => {
    const { key } = e;
    const routes = {
      statisticalOverview: "/admin/dashboard",
      listUsers: "/admin/users",
      listCategories: "/admin/categories",
      addCategory: "/admin/createCategory",
      listProducts: "/admin/products",
      addProduct: "/admin/createProduct",
      listOrders: "/admin/orders",
      chatbox: "/admin/chats",
      listSales: "/admin/sales",
      addSale: "/admin/createSale",
      listVouchers: "/admin/vouchers",
      addVoucher: "/admin/createVoucher",
      address: "/admin/address",
    };
    navigate(routes[key]);
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-72 border-r overflow-y-auto">
      <Menu
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        style={{
          width: "100%",
          minHeight: "100vh",
          borderRight: "1px solid",
        }}
        items={items}
        className="custom-menu"
        onClick={handleMenuClick}
      />
    </div>
  );
};

export default SideBarComponent;
