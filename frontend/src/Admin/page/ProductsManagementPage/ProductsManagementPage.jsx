import React, { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent/TableComponent";
import * as ProductService from "../../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import { Modal, Pagination, Select, message } from "antd";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import AdminProductEdit from "../../components/AdminProduct/AdminProductEdit";
import { updateProductDetail } from "../../../redux/slides/productSlice";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { Option } from "antd/es/mentions";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import createAxiosInstance from "../../../services/createAxiosInstance.js";
import MultilevelDropdown from "../../components/MultilevelDropdown/MultilevelDropdown.jsx";

const ProductsManagementPage = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const [pageNumber, setPageNumber] = useState(1);
  const [dataTable, setDataTable] = useState([]);
  const dispatch = useDispatch();
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const navigate = useNavigate();

  const [idSearch, setidSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [categoryIdSearch, setCategoryIdSearch] = useState("");
  const [minPriceSearch, setMinPriceSearch] = useState("");
  const [maxPriceSearch, setMaxPriceSearch] = useState("");

  const { data: products, refetch } = useQuery({
    queryKey: [
      pageNumber,
      idSearch,
      nameSearch,
      categoryIdSearch,
      minPriceSearch,
      maxPriceSearch,
    ],
    queryFn: () => {
      return ProductService.getProductAdmin(
        {
          page_number: pageNumber,
          category_id: categoryIdSearch?.id,
          name: nameSearch,
          min_price: minPriceSearch,
          max_price: maxPriceSearch,
          product_id: idSearch,
        },
        auth.accessToken,
        axiosJWT
      );
    },
    enabled: Boolean(auth?.accessToken),
  });

  useEffect(() => {
    const filterProducts =
      products?.contents?.length &&
      products?.contents?.map((product) => {
        return { ...product, key: product.id };
      });

    setDataTable(filterProducts);
  }, [products]);

  const mutation = useMutationHook((data) => {
    const res = ProductService.changeStatusProduct(
      data,
      auth?.accessToken,
      axiosJWT
    );
    return res;
  });

  const renderAction = (key, product) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "80%",
        }}
      >
        {product.active && (
          <DeleteOutlined
            style={{ color: "red", fontSize: "26px", cursor: "pointer" }}
            onClick={() => confirmInActive(key)}
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
      title: "Mã",
      dataIndex: "id",
      render: (text) => <a>{text}</a>,
    },
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const inActiveORActive = async (id) => {
    console.log("key delete", id);

    mutation.mutate(id, {
      onSuccess: () => {
        message.success("Chỉnh sửa trạng thái thành công");
        refetch({ queryKey: ["products"] });
      },
      onError: (error) => {
        message.error(`Đã xảy ra lỗi: ${error.message}`);
        refetch({ queryKey: ["products"] });
      },
    });
  };

  const confirmInActive = (id) => {
    Modal.confirm({
      title:
        "Thao tác này sẽ không thể thay đổi. Bạn có chắc chắn với quyết định này?",
      okText: "OK",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => inActiveORActive(id),
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
      dispatch(updateProductDetail({}));
      dispatch(updateProductDetail(detailProduct));
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChange = (pageNumber) => {
    setPageNumber(pageNumber);
  };

  const handleRowClick = async (productId) => {};

  const handleAddProduct = () => {
    navigate("/admin/createProduct");
  };

  const handleMenuItemClick = (id, name) => {
    setCategoryIdSearch({ id, name });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-extrabold">Quản lý sản phẩm</p>

        <button
          className="text-white bg-red-600 py-2 px-8 border border-transparent rounded-md font-bold tracking-wide cursor-pointer hover:opacity-70"
          onClick={handleAddProduct}
        >
          Thêm sản phẩm
        </button>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-4 flex-wrap">
          <div>
            <label htmlFor="idSale">Id:</label>
            <input
              type="text"
              id="idSale"
              className="ml-2 py-1 px-2 rounded-lg"
              onChange={(e) => setidSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 items-center">
            <label htmlFor="cate">Loại:</label>
            <MultilevelDropdown onMenuItemClick={handleMenuItemClick} />
            <input
              type="text"
              id="cate"
              disabled
              className="py-1 px-2 rounded-lg bg-white"
              value={categoryIdSearch?.name}
            />
          </div>

          <div>
            <label htmlFor="nameSearch">Tên:</label>
            <input
              type="text"
              id="nameSearch"
              className="ml-2 py-1 px-2 rounded-lg"
              onChange={(e) => setNameSearch(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="minPrice">Giá trị từ:</label>
            <input
              type="text"
              id="minPrice"
              className="ml-2 py-1 px-2 rounded-lg"
              onChange={(e) => setMinPriceSearch(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="maxPrice">Giá trị đến:</label>
            <input
              type="text"
              id="maxPrice"
              className="ml-2 py-1 px-2 rounded-lg"
              onChange={(e) => setMaxPriceSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <TableComponent
        data={dataTable}
        columns={columns}
        onRowClick={handleRowClick}
      />

      <div className="flex justify-center mt-2">
        {products && (
          <Pagination
            total={products?.totalElements}
            pageSize={products?.pageSize}
            defaultCurrent={pageNumber}
            showSizeChanger={false}
            onChange={onChange}
          />
        )}
      </div>

      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          style: { backgroundColor: "red", color: "white" },
        }}
        okText="Cập nhật"
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

export default ProductsManagementPage;
