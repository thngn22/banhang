import React, { useEffect, useState } from "react";
import { Pagination, Modal, Select, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Option } from "antd/es/mentions";

import TableComponent from "../../components/TableComponent/TableComponent";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { formatDateInHisoryOrder } from "../../../utils/untils.js";

import apiVouchers from "../../../services/voucherApis.js";
import createAxiosInstance from "../../../services/createAxiosInstance.js";
import { detailVoucher } from "../../../redux/slides/voucherSlice.js";
import DetailVoucher from "./DetailVoucher.jsx";

const VouchersManagementPage = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const [pageNumber, setPageNumber] = useState(1);
  const [dataTable, setDataTable] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosJWT = createAxiosInstance(auth, dispatch);

  const { data: vouchers, refetch } = useQuery({
    queryKey: [pageNumber],
    queryFn: () => {
      return apiVouchers.getVoucherssAdmin(
        {
          page_number: pageNumber,
        },
        auth.accessToken,
        axiosJWT
      );
    },
    enabled: Boolean(auth?.accessToken),
  });
  useEffect(() => {
    const filterVouchers =
      vouchers?.contents?.length &&
      vouchers?.contents?.map((voucher) => {
        return { ...voucher, key: voucher.id };
      });

    setDataTable(filterVouchers);
  }, [vouchers]);

  const mutationDetail = useMutationHook((data) => {
    return apiVouchers.getDetailVouchers(data, axiosJWT);
  });
  const { data: dataDetail } = mutationDetail;
  useEffect(() => {
    if (dataDetail) dispatch(detailVoucher(dataDetail));
  }, [dataDetail]);

  const mutationDeActive = useMutationHook((data) => {
    return apiVouchers.deleteVoucherAdmin(data, auth?.accessToken, axiosJWT);
  });

  const renderAction = (key, record) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "80%",
        }}
      >
        <QuestionCircleOutlined
          style={{ color: "#000", fontSize: "20px", cursor: "pointer" }}
          onClick={() => showModal(key)}
        />
        {record.active ? (
          <DeleteOutlined
            style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
            onClick={() => inActiveORActive(key)}
          />
        ) : (
          <CheckCircleOutlined
            style={{ color: "green", fontSize: "20px", cursor: "pointer" }}
            onClick={() => inActiveORActive(key)}
          />
        )}
        <EditOutlined
          style={{ color: "blue", fontSize: "20px", cursor: "pointer" }}
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
      title: "Code",
      dataIndex: "voucherCode",
    },
    {
      title: "Tên",
      dataIndex: "name",
    },
    {
      title: "Tỉ lệ",
      dataIndex: "discountRate",
      render: (discountRate) => <p>{discountRate}%</p>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (quantity) => <p>{quantity}</p>,
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

  const inActiveORActive = async (id) => {
    mutationDeActive.mutate(id, {
      onSuccess: () => {
        message.success("Chỉnh sửa trạng thái thành công");
        refetch({ queryKey: ["vouchers"] });
      },
      onError: (error) => {
        message.error(`Đã xảy ra lỗi: ${error.message}`);
        refetch({ queryKey: ["vouchers"] });
      },
    });
  };

  const showModal = async (key) => {
    mutationDetail.mutate(key);
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
    navigate("/admin/createVoucher");
  };

  const handleFilterProduct = () => {
    console.log("onclickFilter");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-extrabold">Quản lý Voucher</p>
        <button
          className="text-white bg-red-600 py-2 px-8 border border-transparent rounded-md font-bold tracking-wide cursor-pointer hover:opacity-70"
          onClick={handleAddProduct}
        >
          Thêm mã voucher
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
        {vouchers && (
          <Pagination
            total={vouchers?.totalElements}
            pageSize={vouchers?.pageSize}
            defaultCurrent={pageNumber}
            showSizeChanger={false}
            onChange={onChange}
          />
        )}
      </div>

      <Modal
        title="Chi tiết Voucher"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          style: { backgroundColor: "red", color: "white" },
        }}
        okText="Update"
        footer={null}
        width={700}
      >
        {isModalOpen && <DetailVoucher />}
      </Modal>
    </div>
  );
};

export default VouchersManagementPage;
