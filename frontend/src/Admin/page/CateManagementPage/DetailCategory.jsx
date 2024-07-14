import React, { useEffect, useState } from "react";
import { Modal, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DetailCategory = ({ data }) => {
  const fatherCategories = useSelector(
    (state) => state.category.fatherCate.categories
  );
  const [dataTable, setDataTable] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.length) {
      const value = data.map((cate) => {
        return { ...cate, key: cate.id };
      });
      setDataTable(value);
    }
  }, [data]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text) => <p className="cursor-pointer">{text}</p>,
    },
    {
      title: "Tên",
      dataIndex: "name",
      render: (text) => <p className="cursor-pointer">{text}</p>,
    },
    {
      title: "Tình trạng",
      dataIndex: "active",
      render: (active) => (
        <span
          className={`font-bold cursor-pointer ${
            active ? "text-green-500" : "text-red-500"
          }`}
        >
          {active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "CategoryId cha",
      dataIndex: "parentCategoryId",
      render: (text) => <p className="cursor-pointer">{text}</p>,
    },
    {
      title: "Hành động",
      dataIndex: "key",
      render: (key, product) => renderAction(key, product),
    },
  ];

  const renderAction = (key, record) => {
    return (
      <div className={"flex justify-center gap-4"}>
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

  return (
    <div className="font-montserrat">
      {data && (
        <div className="mt-4">
          <p className="text-xl font-semibold">Danh sách danh mục con:</p>
          <Table dataSource={dataTable} columns={columns} pagination={false} />
        </div>
      )}
    </div>
  );
};

export default DetailCategory;
