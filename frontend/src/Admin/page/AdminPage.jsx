import React, { useEffect, useState } from "react";
import {
  SkinOutlined,
  UserOutlined,
  BarChartOutlined,
  PlusCircleOutlined,
  FormOutlined,
  MessageOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { getItem } from "../../utils/untils";
import Navigation from "../../customer/components/Navigation/Navigation";
import AdminUser from "../components/AdminUser/AdminUser";
import AdminProduct from "../components/AdminProduct/AdminProduct";
import AdminProductCreate from "../components/AdminProduct/AdminProductCreate";
import AdminOrder from "../components/AdminOrder/AdminOrder";
import { useQuery } from "@tanstack/react-query";
import * as CategoryService from "../../services/CategoryService";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "../../redux/slides/categorySlice";
import AdminStatistical from "../components/AdminStatistical/AdminStatistical";
import AdminChat from "../components/AdminChat/AdminChat"; // Import AdminChat

function AdminPage(props) {
  const dispatch = useDispatch();

  const items = [
    getItem("Thống kê tổng quan", "statisticalOverview", <BarChartOutlined />), // Changed icon
    getItem("Người dùng", "listUsers", <UserOutlined />),
    getItem("Sản phẩm", "sub2", <SkinOutlined />, [
      getItem("Quản lý sản phẩm", "listProducts", <FormOutlined />),
      getItem("Thêm Sản phẩm", "addProduct", <PlusCircleOutlined />),
    ]),
    getItem("Đơn hàng", "listOrders", <FileDoneOutlined />),
    getItem("Chat", "chatbox", <MessageOutlined />), // Changed icon
  ];
  const rootSubmenuKeys = ["user", "product", "order", "statistical"];

  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const [keySelected, setKeySelected] = useState("statisticalOverview"); // Default selected key

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

  const renderPage = (key) => {
    switch (key) {
      case "listUsers":
        return <AdminUser />;
      case "listProducts":
        return <AdminProduct />;
      case "addProduct":
        return <AdminProductCreate />;
      case "listOrders":
        return <AdminOrder />;
      case "chatbox":
        return <AdminChat />; // Added AdminChat
      default:
        return <AdminStatistical />;
    }
  };

  const handleOnClick = ({ key }) => {
    setKeySelected(key);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navigation isHiddenSearch isHiddenCart isHiddenCate />
      <div
        style={{
          backgroundColor: "rgba(169, 169, 169, 0.2)",
          borderTop: "1px solid",
          height: "100%",
        }}
      >
        <div
          style={{
            borderTop: "1px solid",
            height: "100%",
            display: "flex",
            margin: "0 0",
            backgroundColor: "#fff",
          }}
        >
          <Menu
            mode="inline"
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            style={{
              width: 220,
              minHeight: "100vh",
              borderRight: "1px solid",
            }}
            items={items}
            onClick={handleOnClick}
            selectedKeys={[keySelected]} // Set selected key
            defaultSelectedKeys={["statisticalOverview"]} // Default selected key
          />
          <div
            style={{
              flex: 1,
              backgroundColor: "#fff",
              textAlign: "left",
              padding: "12px 24px",
            }}
          >
            {renderPage(keySelected)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
