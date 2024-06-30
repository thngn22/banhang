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
import { useDispatch, useSelector } from "react-redux";
import * as CategoryService from "../../../services/CategoryService";
import { getCategory } from "../../../redux/slides/categorySlice";
import "./styles.css";
import Loading from "../../../Customer/components/LoadingComponent/Loading";

const SideBarComponent = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  console.log(auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  const items = [
    getItem("Thống kê tổng quan", "statisticalOverview", <BarChartOutlined />),
    getItem("Người dùng", "listUsers", <UserOutlined />),
    getItem("Danh mục", "sub5", <AppstoreOutlined />, [
      getItem("Danh sách", "listCategories", <FormOutlined />),
      getItem("Tạo Danh mục", "addCategory", <PlusCircleOutlined />),
    ]),
    getItem("Sản phẩm", "sub2", <SkinOutlined />, [
      getItem("Danh sách", "listProducts", <FormOutlined />),
      getItem("Tạo Sản phẩm", "addProduct", <PlusCircleOutlined />),
    ]),
    getItem("Đơn hàng", "listOrders", <FileDoneOutlined />),
    getItem("Chat", "chatbox", <MessageOutlined />),
    getItem("Khuyến mãi", "sub3", <PercentageOutlined />, [
      getItem("Danh sách", "listSales", <FormOutlined />),
      getItem("Tạo mã Khuyến mãi", "addSale", <PlusCircleOutlined />),
    ]),
    getItem("Voucher", "sub4", <TagsOutlined />, [
      getItem("Danh sách", "listVouchers", <FormOutlined />),
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
    if (auth) {
      setIsLoading(false);
    }
  }, [auth]);

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
    <div className="sidebar fixed top-0 left-0 h-screen w-72 overflow-y-auto min-h-screen">
      <Loading isLoading={isLoading}>
        <div className="px-12 py-4 flex flex-col">
          <div className="aspect-w-1 aspect-h-1">
            <img
              className="object-cover rounded-full"
              src={auth.avatar}
              alt="avatar"
            />
          </div>

          <div className="flex mx-8 justify-center">
            <p className="text-xl font-semibold mr-2">{auth.firstName}</p>
            <p className="text-xl font-semibold">{auth.lastName}</p>
          </div>
        </div>
      </Loading>

      <Menu
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
