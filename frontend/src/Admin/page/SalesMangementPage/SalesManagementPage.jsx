import React, { useEffect, useState } from "react";
import { Pagination, Modal, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Option } from "antd/es/mentions";

import { loginSuccess } from "../../../redux/slides/authSlice";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { formatDateInHisoryOrder } from "../../../utils/untils.js";

import * as AuthService from "../../../services/AuthService";
import apiSales from "../../../services/saleApis";

const SalesManagementPage = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const [pageNumber, setPageNumber] = useState(1);
  const [dataTable, setDataTable] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const { data: sales, refetch } = useQuery({
    queryKey: [pageNumber],
    queryFn: () => {
      return apiSales.getSalesAdmin(auth.accessToken, axiosJWT);
    },
    enabled: Boolean(auth?.accessToken),
  });

  useEffect(() => {
    const filterSales =
      sales?.contents?.length &&
      sales?.contents?.map((sale) => {
        return { ...sale, key: sale.id };
      });

    setDataTable(filterSales);
  }, [sales]);

  //   const mutation = useMutationHook((data) => {
  //     const res = ProductService.changeStatusProduct(
  //       data,
  //       auth?.accessToken,
  //       axiosJWT
  //     );
  //     return res;
  //   });

  const renderAction = (key, product) => {
    return (
      <div className="flex justify-between">
        <QuestionCircleOutlined
          style={{ color: "#000", fontSize: "26px", cursor: "pointer" }}
          //   onClick={() => showModal(key)}
        />
        {product.active ? (
          <DeleteOutlined
            style={{ color: "red", fontSize: "26px", cursor: "pointer" }}
            // onClick={() => inActiveORActive(key)}
          />
        ) : (
          <CheckCircleOutlined
            style={{ color: "green", fontSize: "26px", cursor: "pointer" }}
            // onClick={() => inActiveORActive(key)}
          />
        )}
        <EditOutlined
          style={{ color: "blue", fontSize: "26px", cursor: "pointer" }}
          //   onClick={() => showModal(key)}
        />
      </div>
    );
  };

  const columns = [
    {
      title: "Mã khuyến mãi",
      dataIndex: "id",
    },
    {
      title: "Tên",
      dataIndex: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Tỉ lệ",
      dataIndex: "discountRate",
      render: (discountRate) => <p>{discountRate}%</p>,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      render: (startDate) => <p>{formatDateInHisoryOrder(startDate)}</p>,
    },
    {
      title: "HSD",
      dataIndex: "endDate",
      render: (endDate) => <p>{formatDateInHisoryOrder(endDate)}</p>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (createdAt) => <p>{formatDateInHisoryOrder(createdAt)}</p>,
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

  //   const inActiveORActive = async (id) => {
  //     console.log("key delete", id);

  //     mutation.mutate(id, {
  //       onSuccess: () => {
  //         message.success("Chỉnh sửa trạng thái thành công");
  //         refetch({ queryKey: ["products"] });
  //       },
  //       onError: (error) => {
  //         message.error(`Đã xảy ra lỗi: ${error.message}`);
  //         refetch({ queryKey: ["products"] });
  //       },
  //     });
  //   };

  //   const showModal = async (key) => {
  //     console.log("key edit", key);

  //     try {
  //       const detailProduct = await ProductService.getDetailProductForAdmin(
  //         key,
  //         auth?.accessToken,
  //         axiosJWT
  //       );
  //       dispatch(updateProductDetail({}));
  //       dispatch(updateProductDetail(detailProduct));
  //     } catch (error) {
  //       console.error("Error fetching product details:", error);
  //     }
  //     setIsModalOpen(true);
  //   };
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
    navigate("/admin/createSale");
  };

  const handleFilterProduct = () => {
    console.log("onclickFilter");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-extrabold">Quản lý khuyến mãi</p>
        <button
          className="text-white bg-red-600 py-2 px-8 border border-transparent rounded-md font-bold tracking-wide cursor-pointer hover:opacity-70"
          onClick={handleAddProduct}
        >
          Thêm mã khuyến mãi
        </button>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-4">
          <div>
            <label htmlFor="idSale">Mã:</label>
            <input type="text" id="idSale" className="ml-2 py-1 rounded-lg" />
          </div>

          <div>
            <label htmlFor="name">Tên:</label>
            <input type="text" id="name" className="ml-2 py-1 rounded-lg" />
          </div>

          <div>
            <label htmlFor="discountRate">Tỉ lệ:</label>
            <input
              type="text"
              id="discountRate"
              className="ml-2 py-1 rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="status">Tình trạng:</label>
            <Select className="filter__product">
              <Option value="active">Active</Option>
              <Option value="inActive">Inctive</Option>
            </Select>
          </div>
        </div>
        <button
          className="text-white bg-black py-1 px-8 border border-transparent rounded-md font-bold tracking-wide cursor-pointer hover:opacity-70"
          onClick={handleFilterProduct}
        >
          Lọc
        </button>
      </div>

      <TableComponent
        data={dataTable}
        columns={columns}
        onRowClick={handleRowClick}
      />

      <div className="flex justify-center mt-2">
        {sales && (
          <Pagination
            total={sales?.totalElements}
            pageSize={sales?.pageSize}
            defaultCurrent={pageNumber}
            showSizeChanger={false}
            onChange={onChange}
          />
        )}
      </div>

      {/* <Modal
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
      </Modal> */}
    </div>
  );
};

export default SalesManagementPage;
