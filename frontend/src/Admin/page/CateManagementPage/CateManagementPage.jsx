import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Modal, Table, Pagination, message } from "antd";
import * as CategoryServices from "../../../services/CategoryService";
import {
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import DetailCategory from "./DetailCategory";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { useDispatch, useSelector } from "react-redux";
import createAxiosInstance from "../../../services/createAxiosInstance";
import {
  updateCategoriesFather,
  updateCategory,
} from "../../../redux/slides/categorySlice";

const CateManagementPage = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  const { data: listCategories, refetch } = useQuery({
    queryKey: ["listCategories"],
    queryFn: () => {
      return CategoryServices.getAllTreeCategory();
    },
  });
  useEffect(() => {
    if (listCategories) {
      dispatch(updateCategory(listCategories));
    }
  }, [listCategories]);

  useEffect(() => {
    if (listCategories?.length) {
      // Lọc danh mục cha
      const filterCategories = listCategories
        .filter((cate) => cate.parentCategoryId === null)
        .map((cate) => {
          return { ...cate, key: cate.id };
        });

      // Cập nhật dữ liệu bảng
      setDataTable(filterCategories);
    }
  }, [listCategories]);

  const mutationDetail = useMutationHook((id) => {
    return CategoryServices.getChildCate(id, auth?.accessToken, axiosJWT);
  });
  const { data: dataDetail } = mutationDetail;

  const handleRowClick = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "Mã",
      dataIndex: "id",
      render: (text, record) => (
        <p onClick={() => handleRowClick(record)}>{text}</p>
      ),
    },
    {
      title: "Tên Danh Mục",
      dataIndex: "name",
      render: (text, record) => (
        <p onClick={() => handleRowClick(record)}>{text}</p>
      ),
    },
    {
      title: "Trạng Thái",
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

  const renderAction = (key, record) => {
    return (
      <div className={classNames("flex justify-center gap-4")}>
        <QuestionCircleOutlined
          style={{ color: "#000", fontSize: "24px", cursor: "pointer" }}
          onClick={() => showModal(key)}
        />
        {record.active && (
          <>
            <DeleteOutlined
              style={{ color: "red", fontSize: "24px", cursor: "pointer" }}
              onClick={() => confirmInActive(key)}
            />
            <EditOutlined
              style={{ color: "blue", fontSize: "24px", cursor: "pointer" }}
              onClick={() => navigate(`/admin/updateCategory/${key}`)}
            />
          </>
        )}
      </div>
    );
  };

  const inActive = async (id) => {
    // mutationDeActive.mutate(id, {
    //   onSuccess: () => {
    //     message.success("Chỉnh sửa trạng thái thành công");
    //     refetch({ queryKey: ["vouchers"] });
    //   },
    //   onError: (error) => {
    //     message.error(`Đã xảy ra lỗi: ${error.message}`);
    //     refetch({ queryKey: ["vouchers"] });
    //   },
    // });
  };

  const confirmInActive = (id) => {
    Modal.confirm({
      title:
        "Thao tác này sẽ không thể thay đổi. Bạn có chắc chắn với quyết định này?",
      okText: "OK",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => inActive(id),
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

  const handleAddCate = () => {
    navigate("/admin/createCategory");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-extrabold">Quản lý danh mục</p>
        <button
          className="text-white bg-red-600 py-2 px-8 border border-transparent rounded-md font-bold tracking-wide cursor-pointer hover:opacity-70"
          onClick={handleAddCate}
        >
          Thêm danh mục
        </button>
      </div>

      <Table
        dataSource={dataTable}
        columns={columns}
        rowKey="id"
        pagination={false}
      />

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
        {isModalOpen && <DetailCategory data={dataDetail} />}
      </Modal>
    </div>
  );
};

export default CateManagementPage;
