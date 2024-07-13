import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Modal, Table, Pagination, message } from "antd";
import * as CategoryServices from "../../../services/CategoryService";

const CateManagementPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const { data: categories, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return CategoryServices.getAllTreeCategory();
    },
  });

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
  ];

  const renderModalContent = () => {
    if (!selectedCategory) return null;
    return (
      <div>
        <h3>Các danh mục con:</h3>
        <ul>
          {selectedCategory.categories.map((subCategory) => (
            <li key={subCategory.id}>{subCategory.name}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-extrabold">Quản lý Danh Mục</h2>
      <Table
        dataSource={
          categories?.filter((cat) => cat.parentCategoryId === null) || []
        }
        columns={columns}
        rowKey="id"
      />

      <Modal
        title="Chi tiết Danh Mục"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {renderModalContent()}
      </Modal>

      {/* Pagination can be added here if needed */}
    </div>
  );
};

export default CateManagementPage;
