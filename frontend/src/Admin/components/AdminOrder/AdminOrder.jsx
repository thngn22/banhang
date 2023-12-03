import React from "react";
import { WrapperHeader } from "./style";
import TableComponent from "../TableComponent/TableComponent";

const AdminOrder = () => {
  return (
    <div>
      <WrapperHeader>Quản lý Đơn hàng</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <TableComponent />
      </div>
    </div>
  );
};

export default AdminOrder;
