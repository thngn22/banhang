import React, { useState } from "react";
import { Table } from "antd";
import "./styleTableAdmin.css";

const TableComponent = (props) => {
  const { data = [], columns = [], onRowClick } = props;
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleRowClick = (record) => {
    setSelectedProductId(record.key);
    if (onRowClick) {
      onRowClick(record.key, record);
    }
  };

  const getRowClassName = (record) => {
    return record.key === selectedProductId ? "selected-row" : "";
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      onRow={(record) => ({
        onClick: () => handleRowClick(record),
        className: getRowClassName(record),
      })}
      pagination={false}
    />
  );
};

export default TableComponent;
