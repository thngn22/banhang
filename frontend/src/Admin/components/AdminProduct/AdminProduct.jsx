import React from "react";
import { WrapperHeader } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import * as ProductService from "../../../services/ProductService";
import { useQuery } from "@tanstack/react-query";

import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const AdminProduct = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);

  const getAllProductsAdmin = async () => {
    const res = await ProductService.getProductAdmin(auth.accessToken);
    return res;
  };

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProductsAdmin,
  });


  const renderAction = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "80%",
        }}
      >
        <QuestionCircleOutlined
          style={{ color: "#000", fontSize: "26px", cursor: "pointer" }}
        />
        <DeleteOutlined
          style={{ color: "red", fontSize: "26px", cursor: "pointer" }}
        />
        <EditOutlined
          style={{ color: "blue", fontSize: "26px", cursor: "pointer" }}
        />
      </div>
    );
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Product Image",
      dataIndex: "productImage",
      render: (productImage) => (
        <img
          src={productImage}
          alt="productImage"
          style={{ maxWidth: "50px", maxHeight: "50px" }}
        />
      ),
    },
    {
      title: "Category",
      dataIndex: "categoryName",
    },
    {
      title: "Variations",
      dataIndex: "",
    },
    {
      title: "Status",
      dataIndex: "active",
      render: (active) => (
        <span style={{ color: active ? "green" : "red", fontWeight: "bold" }}>
          {active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const dataTable =
    products?.length &&
    products.map((product) => {
      return { ...product, key: product.id };
    });

  return (
    <div>
      <WrapperHeader>Quản lý Sản phẩm</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <TableComponent data={dataTable} columns={columns} />
      </div>
    </div>
  );
};

export default AdminProduct;
