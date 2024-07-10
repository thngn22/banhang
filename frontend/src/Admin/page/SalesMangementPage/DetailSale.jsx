import React, { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent/TableComponent";
import { formatDateInHisoryOrder } from "../../../utils/untils";

const DetailSale = ({ data }) => {
  const [dataTable, setDataTable] = useState([]);

  useEffect(() => {
    if (data?.productResponses?.length) {
      const value = data.productResponses.map((sale) => {
        return { ...sale, key: sale.id };
      });
      setDataTable(value);
    }
  }, [data]);

  console.log(dataTable);

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
      title: "Hình ảnh",
      dataIndex: "productImage",
      render: (productImage) => (
        <img
          src={productImage}
          alt="productImage"
          className="max-w-[50px] max-h-[50px]"
        />
      ),
    },
    {
      title: "Loại",
      dataIndex: "categoryName",
      render: (text) => <p className="cursor-pointer">{text}</p>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
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
  ];

  return (
    <div className="font-montserrat">
      {data && (
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <strong>ID:</strong>
                <p>{data.id}</p>
              </div>
              <div className="flex gap-2">
                <strong>Tên:</strong>
                <p>{data.name}</p>
              </div>
              <div className="flex gap-2">
                <strong>Mô tả:</strong>
                <p>{data.description}</p>
              </div>
              <div className="flex gap-2">
                <strong>Tỉ lệ giảm:</strong>
                <p>{data.discountRate}%</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <strong>Tình trạng sử dụng:</strong>
                <p
                  className={
                    data.active
                      ? "text-green-500 font-bold"
                      : "text-red-500 font-bold"
                  }
                >
                  {data.active ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="flex gap-2">
                <strong>Ngày bắt đầu:</strong>
                <p>{formatDateInHisoryOrder(data.startDate)}</p>
              </div>
              <div className="flex gap-2">
                <strong>Ngày kết thúc:</strong>
                <p>{formatDateInHisoryOrder(data.endDate)}</p>
              </div>
              <div className="flex gap-2">
                <strong>Ngày tạo:</strong>
                <p>{formatDateInHisoryOrder(data.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <p className="text-xl font-semibold">Danh sách sản phẩm:</p>
            <TableComponent data={dataTable} columns={columns} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailSale;
