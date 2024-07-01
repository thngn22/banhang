import React, { useState, useEffect } from "react";
import { Table } from "antd";
import "./styleTableAdmin.css";

const TableComponent = (props) => {
  const { selection = "checkbox", data = [], columns = [], onRowClick } = props;
  const [selectedProductId, setSelectedProductId] = useState(null);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const handleRowClick = (record) => {
    setSelectedProductId(record.key);
    if (onRowClick) {
      onRowClick(record.key);
    }
  };

  const getRowClassName = (record) => {
    return record.key === selectedProductId ? "selected-row" : "";
  };

  return (
    <Table
      // rowSelection={{
      //   ...rowSelection,
      // }}
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
