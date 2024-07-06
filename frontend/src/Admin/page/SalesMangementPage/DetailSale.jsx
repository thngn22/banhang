import React, { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useSelector } from "react-redux";
import { formatDateInHisoryOrder } from "../../../utils/untils";

const DetailSale = () => {
  const [dataTable, setDataTable] = useState([]);
  const detailSale = useSelector((state) => state.sale.detailSale.currentSale);

  useEffect(() => {
    const value =
      detailSale?.productResponses?.length &&
      detailSale?.productResponses?.map((sale) => {
        return { ...sale, key: sale.id };
      });

    setDataTable(value);
  }, [detailSale]);

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
      {detailSale && (
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex gap-2">
              <strong>ID:</strong>
              <p>{detailSale.id}</p>
            </div>
            <div className="flex gap-2">
              <strong>Tên:</strong>
              <p>{detailSale.name}</p>
            </div>
            <div className="flex gap-2">
              <strong>Mô tả:</strong>
              <p>{detailSale.description}</p>
            </div>
            <div className="flex gap-2">
              <strong>Tỉ lệ giảm:</strong>
              <p>{detailSale.discountRate}%</p>
            </div>
            <div className="flex gap-2">
              <strong>Ngày bắt đầu:</strong>
              <p>{formatDateInHisoryOrder(detailSale.startDate)}</p>
            </div>
            <div className="flex gap-2">
              <strong>Ngày kết thúc:</strong>
              <p>{formatDateInHisoryOrder(detailSale.endDate)}</p>
            </div>
            <div className="flex gap-2">
              <strong>Ngày tạo:</strong>
              <p>{formatDateInHisoryOrder(detailSale.createdAt)}</p>
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
