import React, { useEffect, useState } from "react";
import { WrapperHeader } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import * as ProductService from "../../../services/ProductService";
import * as CategoryService from "../../../services/CategoryService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal, message } from "antd";

import {
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import AdminProductEdit from "./AdminProductEdit";
import { updateProductDetail } from "../../../redux/slides/productSlice";
import { getCategory } from "../../../redux/slides/categorySlice";
import { useMutationHook } from "../../../hooks/useMutationHook";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../../../redux/slides/authSlice";
import * as AuthService from "../../../services/AuthService";

const AdminProduct = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);

  const dispatch = useDispatch();

  const refreshToken = async () => {
    try {
      const data = await AuthService.refreshToken();
      return data?.accessToken;
    } catch (err) {
      console.log("err", err);
    }
  };

  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      let date = new Date();
      if (auth?.accessToken) {
        const decodAccessToken = jwtDecode(auth?.accessToken);
        if (decodAccessToken.exp < date.getTime() / 1000) {
          const data = await refreshToken();
          const refreshUser = {
            ...auth,
            accessToken: data,
          };

          dispatch(loginSuccess(refreshUser));
          config.headers["Authorization"] = `Bearer ${data}`;
        }
      }

      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const getAllProductsAdmin = async () => {
    const res = await ProductService.getProductAdmin(
      auth.accessToken,
      axiosJWT
    );
    return res;
  };

  const { data: products, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProductsAdmin,
    enabled: Boolean(auth?.accessToken),
  });
  const mutation = useMutationHook((data) => {
    const res = ProductService.changeStatusProduct(
      data,
      auth?.accessToken,
      axiosJWT
    );
    return res;
  });
  const { data, status, isSuccess, isError } = mutation;

  const renderAction = (key, product) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "80%",
        }}
      >
        {product.active ? (
          <DeleteOutlined
            style={{ color: "red", fontSize: "26px", cursor: "pointer" }}
            onClick={() => inActiveORActive(key)}
          />
        ) : (
          <CheckCircleOutlined
            style={{ color: "green", fontSize: "26px", cursor: "pointer" }}
            onClick={() => inActiveORActive(key)}
          />
        )}
        <EditOutlined
          style={{ color: "blue", fontSize: "26px", cursor: "pointer" }}
          onClick={() => showModal(key)}
        />
      </div>
    );
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Hình ảnh",
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
      title: "Loại",
      dataIndex: "categoryName",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Tình trạng",
      dataIndex: "active",
      render: (active) => (
        <span style={{ color: active ? "green" : "red", fontWeight: "bold" }}>
          {active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "key",
      render: (key, product) => renderAction(key, product),
    },
  ];

  const dataTable =
    products?.length &&
    products.map((product) => {
      return { ...product, key: product.id };
    });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const inActiveORActive = async (id) => {
    console.log("key delete", id);

    mutation.mutate(id, {
      onSuccess: () => {
        // Hiển thị thông báo thành công
        message.success("Chỉnh sửa trạng thái thành công");
        refetch({ queryKey: ["products"] });
      },
      onError: (error) => {
        // Hiển thị thông báo lỗi
        message.error(`Đã xảy ra lỗi: ${error.message}`);
        refetch({ queryKey: ["products"] });
      },
    });
  };

  const showModal = async (key) => {
    console.log("key edit", key);

    try {
      const detailProduct = await ProductService.getDetailProductForAdmin(
        key,
        auth?.accessToken,
        axiosJWT
      );
      // console.log("Detail Product Data:", detailProduct);
      dispatch(updateProductDetail({}));
      dispatch(updateProductDetail(detailProduct));
    } catch (error) {
      console.error("Error fetching product details:", error);
    }

    // dispatch(updateProductDetail(fakeAPI));
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleRowClick = async (productId) => {};

  return (
    <div>
      <WrapperHeader>Quản lý Sản phẩm</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          data={dataTable}
          columns={columns}
          onRowClick={handleRowClick}
        />
      </div>

      <Modal
        title="Chi tiết sản phẩm"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          style: { backgroundColor: "red", color: "white" },
        }}
        okText="Update"
        footer={null}
        width={1000}
      >
        {isModalOpen && (
          <AdminProductEdit
            setIsModalOpen={setIsModalOpen}
            refetchProducts={refetch}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdminProduct;
