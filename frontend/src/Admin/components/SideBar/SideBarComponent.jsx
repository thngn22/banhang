import { Menu } from "antd";
import {
  SkinOutlined,
  UserOutlined,
  BarChartOutlined,
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
import pluginIcon from "../../../Data/icon/plugin.png";

const SideBarComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = [
    getItem("Thống kê tổng quan", "statisticalOverview", <BarChartOutlined />),
    getItem("Người dùng", "listUsers", <UserOutlined />),
    getItem("Danh mục", "listCategories", <AppstoreOutlined />),
    getItem("Sản phẩm", "listProducts", <SkinOutlined />),
    getItem("Đơn hàng", "listOrders", <FileDoneOutlined />),
    getItem("Chat", "chatbox", <MessageOutlined />),
    getItem("Khuyến mãi", "listSales", <PercentageOutlined />),
    getItem("Voucher", "listVouchers", <TagsOutlined />),
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
    <div className="sidebar fixed top-0 left-0 h-screen py-4 w-72 overflow-y-auto min-h-screen">
      <div className="flex justify-center items-center mb-4 hover:opacity-70">
        <img
          className="object-cover rounded-full h-[4rem]"
          src={pluginIcon}
          alt="avatar"
        />
      </div>

      <Menu
        defaultSelectedKeys={"statisticalOverview"}
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={items}
        className="custom-menu"
        onClick={handleMenuClick}
      />
    </div>
  );
};

export default SideBarComponent;
