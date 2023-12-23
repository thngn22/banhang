import { Table, InputNumber, Button, Checkbox, message } from "antd";
import React, { useEffect, useState } from "react";

const Price_Quantity = (props) => {
  const {
    combinedData,
    updateCombinedData,
    saveButtonClicked,
    setSaveButtonClicked,
    isEdit,
  } = props;
  const [data, setData] = useState([]);
  const [values, setValues] = useState([]);

  console.log("combinedData in Price_Quantity", combinedData);
  console.log("values in Price_Quantity", values);

  useEffect(() => {
    if (isEdit) {
      // Khởi tạo giá trị mặc định cho values khi combinedData thay đổi lần đầu
      if (combinedData.length > 0 && values.length === 0) {
        const defaultValues = combinedData.reduce((acc, item, index) => {
          console.log("item", item);
          acc[index] = {
            warehousePrice: item?.warehousePrice,
            price: item?.price,
            numberQuantity: item?.numberQuantity,
            quantity: item?.quantityInStock,
            active: item?.active,
            id: item?.id,
          };
          return acc;
        }, {});

        setValues(defaultValues);
      }
      // Chuyển đổi combinedData thành dữ liệu hiển thị trong bảng
      const tableData = combinedData.map(
        (
          {
            color,
            size,
            warehousePrice,
            price,
            numberQuantity,
            quantityInStock,
            active,
          },
          index
        ) => {
          return {
            key: index,
            color: <span>{color}</span>,
            size: <span>{size}</span>,
            warehousePrice: (
              <InputNumber
                disabled
                addonAfter="VNĐ"
                defaultValue={0}
                value={values[index]?.warehousePrice ?? warehousePrice}
                onChange={(value) =>
                  handleValueChange(index, "warehousePrice", value)
                }
              />
            ),
            price: (
              <InputNumber
                addonAfter="VNĐ"
                defaultValue={0}
                value={values[index]?.price ?? price}
                onChange={(value) => handleValueChange(index, "price", value)}
              />
            ),
            numberQuantity: (
              <InputNumber
                defaultValue={0}
                value={values[index]?.numberQuantity ?? numberQuantity}
                onChange={(value) =>
                  handleValueChange(index, "numberQuantity", value)
                }
              />
            ),
            quantity: (
              <InputNumber
                disabled
                defaultValue={0}
                value={values[index]?.quantity ?? quantityInStock}
                onChange={(value) =>
                  handleValueChange(index, "quantity", value)
                }
              />
            ),
            active: (
              <Checkbox
                checked={values[index]?.active ?? active}
                onChange={(e) =>
                  handleValueChange(index, "active", e.target.checked)
                }
              >
                Active
              </Checkbox>
            ),
          };
        }
      );

      setData(tableData);
    } else {
      // Khởi tạo giá trị mặc định cho values khi combinedData thay đổi lần đầu
      if (combinedData.length > 0 && values.length === 0) {
        const defaultValues = combinedData.reduce((acc, _, index) => {
          acc[index] = { warehousePrice: 0, price: 0, quantity: 0 };
          return acc;
        }, {});
        setValues(defaultValues);
      }

      // Chuyển đổi combinedData thành dữ liệu hiển thị trong bảng
      const tableData = combinedData.map(({ color, size }, index) => {
        return {
          key: index,
          color: <span>{color}</span>,
          size: <span>{size}</span>,
          warehousePrice: (
            <InputNumber
              addonAfter="VNĐ"
              defaultValue={0}
              value={values[index]?.warehousePrice ?? 0}
              onChange={(value) =>
                handleValueChange(index, "warehousePrice", value)
              }
            />
          ),
          price: (
            <InputNumber
              addonAfter="VNĐ"
              defaultValue={0}
              value={values[index]?.price ?? 0}
              onChange={(value) => handleValueChange(index, "price", value)}
            />
          ),
          quantity: (
            <InputNumber
              defaultValue={0}
              value={values[index]?.quantity ?? 0}
              onChange={(value) => handleValueChange(index, "quantity", value)}
            />
          ),
        };
      });

      // Cập nhật state data
      // console.log("tableData", tableData);
      setData(tableData);
    }
  }, [combinedData, values]);

  const handleValueChange = (index, field, value) => {
    // Kiểm tra nếu giá trị là undefined hoặc null, gán giá trị mặc định là 0
    const newValue = value === undefined || value === null ? 0 : value;

    // Sao lưu giá trị mới vào state values
    setValues((prevValues) => ({
      ...prevValues,
      [index]: {
        ...prevValues[index],
        [field]: newValue,
      },
    }));
  };

  const handleSaveClick = () => {
    // Tạo một array chứa giá trị price và quantity từ state values
    const updatedData = combinedData.map(
      ({ color, size, productImage }, index) => ({
        ...values[index],
        color,
        size,
        productImage,
      })
    );

    console.log("updatedData", updatedData);
    message.success("Lưu biến thể thành công");

    // Gọi hàm updateCombinedData để cập nhật combinedData trong GroupVariation
    updateCombinedData(updatedData);
    setSaveButtonClicked(true);
  };

  let columns = [
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Giá nhập",
      dataIndex: "warehousePrice",
      key: "warehousePrice",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Giá bán lẻ",
      dataIndex: "price",
      key: "price",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];
  if (isEdit) {
    columns = [
      ...columns,
      {
        title: "Số lượng nhập thêm",
        dataIndex: "numberQuantity",
        key: "numberQuantity",
      },
      { title: "Trạng thái", dataIndex: "active", key: "active" },
    ];
  }

  return (
    <div>
      <Table
        style={{ marginTop: "4px" }}
        columns={columns}
        dataSource={data}
        pagination={false}
      />

      <Button
        style={{
          marginBottom: "10px",
          backgroundColor: "green",
          color: "#fff",
          fontWeight: "500",
        }}
        onClick={handleSaveClick}
      >
        Lưu biến thể
      </Button>
    </div>
  );
};

export default Price_Quantity;
