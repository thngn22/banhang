import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TableComponent from "../../components/TableComponent/TableComponent";

const DetailAddressList = () => {
  const detailAddressList = useSelector(
    (state) => state.address.detailAddress.currentAddress
  );
  const [dataTable, setDataTable] = useState([]);

  useEffect(() => {
    const value =
      detailAddressList?.length &&
      detailAddressList?.map((address) => {
        return { ...address, key: address.addressInfor.id };
      });

    setDataTable(value);
  }, [detailAddressList]);

  const columns = [
    {
      title: "ID",
      dataIndex: "addressInfor",
      render: (addressInfor) => (
        <p className="cursor-pointer">{addressInfor.id}</p>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "addressInfor",
      render: (addressInfor) => (
        <p>
          {addressInfor.address}/{addressInfor.ward}/{addressInfor.district}/
          {addressInfor.city}
        </p>
      ),
    },
    {
      title: "Default",
      dataIndex: "_default",
      render: (_default) => (
        <span style={{ fontWeight: "bold" }}>{_default ? "Yes" : "No"}</span>
      ),
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
    <div>
      <TableComponent columns={columns} data={dataTable} />
    </div>
  );
};

export default DetailAddressList;
