import React, { useEffect, useState } from "react";
import { DatePicker, Pagination, Modal, Select, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Option } from "antd/es/mentions";
import classNames from "classnames";

import TableComponent from "../../components/TableComponent/TableComponent";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { formatDateInHisoryOrder } from "../../../utils/untils.js";

import apiSales from "../../../services/saleApis";
import createAxiosInstance from "../../../services/createAxiosInstance.js";
import DetailSale from "./DetailSale.jsx";
import { detailSale } from "../../../redux/slides/saleSlice.js";
import "./styles.css";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

const SalesManagementPage = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const [pageNumber, setPageNumber] = useState(1);
  const [dataTable, setDataTable] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [idSearch, setIdSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [discountRateSearch, setDiscountRateSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [startDateSearch, setStartDateSearch] = useState("");
  const [endtDateSearch, setEndDateSearch] = useState("");

  const { data: sales, refetch } = useQuery({
    queryKey: [
      pageNumber,
      idSearch,
      nameSearch,
      discountRateSearch,
      activeSearch,
      startDateSearch,
      endtDateSearch,
    ],
    queryFn: () => {
      return apiSales.getSalesAdmin(
        {
          page_number: pageNumber,
          sale_id: idSearch,
          name: nameSearch,
          discount_rate: discountRateSearch,
          state: activeSearch,
          start_date: startDateSearch,
          end_date: endtDateSearch,
        },
        auth.accessToken,
        axiosJWT
      );
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

  const mutationDetail = useMutationHook((data) => {
    return apiSales.getSaleDetailAdmin(data, auth?.accessToken, axiosJWT);
  });
  const { data: dataDetail } = mutationDetail;

  const mutationDelete = useMutationHook((data) => {
    return apiSales.deleteSaleAdmin(data, auth?.accessToken, axiosJWT);
  });

  const inActiveORActive = async (id) => {
    mutationDelete.mutate(id, {
      onSuccess: () => {
        message.success("Chỉnh sửa trạng thái thành công");
        refetch({ queryKey: ["sales"] });
      },
      onError: (error) => {
        message.error(`Đã xảy ra lỗi: ${error.message}`);
        refetch({ queryKey: ["sales"] });
      },
    });
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title:
        "Thao tác xóa sẽ không thể thay đổi. Bạn có chắc chắn với quyết định này?",
      okText: "OK",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => inActiveORActive(id),
    });
  };

  const renderAction = (key, record) => {
    return (
      <div
        className={classNames("flex", {
          "justify-between": record.active,
          "justify-center": !record.active,
        })}
      >
        <QuestionCircleOutlined
          style={{ color: "#000", fontSize: "26px", cursor: "pointer" }}
          onClick={() => showModal(key)}
        />
        {record.active && (
          <>
            <DeleteOutlined
              style={{ color: "red", fontSize: "26px", cursor: "pointer" }}
              onClick={() => confirmDelete(key)}
            />
            <EditOutlined
              style={{ color: "blue", fontSize: "26px", cursor: "pointer" }}
              onClick={() => navigate(`/admin/updateSale/${key}`)}
            />
          </>
        )}
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

  const showModal = async (key) => {
    mutationDetail.mutate(key);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    dispatch(detailSale(null));
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    dispatch(detailSale(null));
    setIsModalOpen(false);
  };

  const onChange = (pageNumber) => {
    setPageNumber(pageNumber);
  };

  const handleRowClick = async (productId) => {};

  const handleAddProduct = () => {
    navigate("/admin/createSale");
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
        <div className="flex gap-4 flex-wrap">
          <div>
            <label htmlFor="idSale">Id:</label>
            <input
              type="text"
              id="idSale"
              className="ml-2 py-1 rounded-lg"
              onChange={(e) => setIdSearch(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="name">Tên:</label>
            <input
              type="text"
              id="name"
              className="ml-2 py-1 rounded-lg"
              onChange={(e) => setNameSearch(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="discountRate">Tỉ lệ:</label>
            <input
              type="text"
              id="discountRate"
              className="ml-2 py-1 rounded-lg"
              onChange={(e) => setDiscountRateSearch(e.target.value)}
            />
          </div>

          <RangePicker
            format="DD/MM/YYYY"
            onChange={(dates, dateStrings) => {
              if (dates) {
                const formattedStartDate = dayjs(dates[0]).format(
                  "DD/MM/YYYY 00:00:00"
                );
                const formattedEndDate = dayjs(dates[1]).format(
                  "DD/MM/YYYY 00:00:00"
                );
                setStartDateSearch(formattedStartDate);
                setEndDateSearch(formattedEndDate);
              } else {
                setStartDateSearch("");
                setEndDateSearch("");
              }
            }}
          />

          <div>
            <label htmlFor="status">Tình trạng:</label>
            <Select
              className="filter__product"
              defaultValue={""}
              onChange={(value) => setActiveSearch(value)}
            >
              <Option value="">Không lọc</Option>
              <Option value="true">Active</Option>
              <Option value="false">Inactive</Option>
            </Select>
          </div>
        </div>
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

      <Modal
        title="Chi tiết khuyến mãi"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          style: { backgroundColor: "red", color: "white" },
        }}
        okText="Update"
        footer={null}
        width={1000}
        className="custom-modal-title"
      >
        {isModalOpen && <DetailSale data={dataDetail} />}
      </Modal>
    </div>
  );
};

export default SalesManagementPage;
