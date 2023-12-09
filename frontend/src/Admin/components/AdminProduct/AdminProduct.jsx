import React, { useEffect, useState } from "react";
import { WrapperHeader } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import * as ProductService from "../../../services/ProductService";
import * as CategoryService from "../../../services/CategoryService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal } from "antd";

import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import AdminProductEdit from "./AdminProductEdit";
import { updateProductDetail } from "../../../redux/slides/productSlice";
import { getCategory } from "../../../redux/slides/categorySlice";

const AdminProduct = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);

  const dispatch = useDispatch();

  const getAllProductsAdmin = async () => {
    const res = await ProductService.getProductAdmin(auth.accessToken);
    return res;
  };
  const getAllCatesAdmin = async () => {
    const res = await CategoryService.getAllTreeCategory(auth.accessToken);
    return res;
  };
  const { data: categoriesRes } = useQuery({
    queryKey: ["categoriesRes"],
    queryFn: getAllCatesAdmin,
  });
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProductsAdmin,
  });

  useEffect(() => {
    if (categoriesRes) {
      dispatch(getCategory(categoriesRes));
    }
  }, [categoriesRes]);

  const renderAction = (key) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "80%",
        }}
      >
        <DeleteOutlined
          style={{ color: "red", fontSize: "26px", cursor: "pointer" }}
          onClick={() => inActive(key)}
        />
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
      render: (key) => renderAction(key),
    },
  ];

  const dataTable =
    products?.length &&
    products.map((product) => {
      return { ...product, key: product.id };
    });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const inActive = async (key) => {
    console.log("key delete", key);

    // try {
    //   const deleteProduct = await ProductService.deleteProduct({key}, auth.accessToken);
    //   console.log("Detail Product Data:", deleteProduct);
    //   // Do something with the detailProduct data if needed
    // } catch (error) {
    //   console.error("Error fetching product details:", error);
    // }
  };

  const showModal = async (key) => {
    console.log("key edit", key);

    try {
      const detailProduct = await ProductService.getDetailProductForAdmin(
        key,
        auth.accessToken
      );
      // console.log("Detail Product Data:", detailProduct);
      dispatch(updateProductDetail({}))
      dispatch(updateProductDetail(detailProduct))
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

  const fakeAPI = {
    id: 21,
    name: "Giày Sabo 7299",
    description:
      "Chất liệu quai: da bò cao cấp, đường chỉ may tinh tế, đẹp mắt. Chất liệu đế: TPR có các rãnh chống trơn trượt. \nĐộ cao: 2cm. \nMặt lót  mềm tạo sự thoải mái trong khi di chuyển. \nSabo sẽ trở thành một trợ thủ đắc lực không thể thiếu trong những ngày thời tiết thất thường hay trong những buổi đi chơi, đi du lịch cùng bạn bè và người thân.",
    productImage:
      "https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp",
    categoryId: 10,
    active: true,
    productItems: [
      {
        id: 108,
        price: 299000,
        quantityInStock: 18,
        productImage:
          "https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp",
        active: true,
        size: "39",
        color: "Đỏ",
      },
      {
        id: 112,
        price: 298000,
        quantityInStock: 15,
        productImage:
          "https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp",
        active: true,
        size: "33",
        color: "Đỏ",
      },
    ],
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
        {isModalOpen && <AdminProductEdit setIsModalOpen={setIsModalOpen}/>}
      </Modal>
    </div>
  );
};

export default AdminProduct;
