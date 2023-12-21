import React, { useEffect, useState } from "react";
import { Switch, message } from "antd";
import { Button } from "antd";
import Price_Quantity from "./Price_Quantity";
import Variations from "./Variations";
import UploadImage from "../UploadFile/UploadImage";
import { useSelector } from "react-redux";

const GroupVariation = (props) => {
  const {
    title,
    saveButtonClicked,
    setSaveButtonClicked,
    onDefaultImageChange,
    dataDefaultImage,
    isEdit,
    test,
    productItemsDetail,
  } = props;

  console.log("productItemsDetail", productItemsDetail);

  let colorArray = [];
  let sizeArray = [];
  let priceQuantityActiveIDArray = [];
  if (isEdit) {
    const uniqueColors = Array.from(
      new Set(productItemsDetail.map((item) => item.color))
    );
    const uniqueSizes = Array.from(
      new Set(productItemsDetail.map((item) => item.size))
    );
    colorArray = uniqueColors.map((color) => ({
      color,
      productImage: productItemsDetail.find((item) => item.color === color)
        .productImage,
    }));
    sizeArray = uniqueSizes.map((size) => ({ size }));

    priceQuantityActiveIDArray = productItemsDetail.map(
      ({ price, quantityInStock, active, id }) => ({
        price,
        quantityInStock,
        active,
        id,
      })
    );
  } else {
    // test = null;
    // productItemsDetail = null;
  }

  console.log("sizeArray", sizeArray);
  console.log("colorArray", colorArray);

  const [dataSize, setDataSize] = useState(sizeArray);
  const [dataColor, setDataColor] = useState(colorArray);
  const [showPriceQuantity, setShowPriceQuantity] = useState(false);
  const [combinedData, setCombinedData] = useState([]);
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const [errorText, setErrorText] = useState(
    "Bạn cần nhập ít nhất một color và một size. Thì nút Xong mới hoạt động được"
  );
  const [defaultImage, setDefaultImage] = useState(test);

  useEffect(() => {
    if (isEdit && colorArray) {
      setDataColor(colorArray);
    }
    if (isEdit && sizeArray) {
      setDataSize(sizeArray);
    }
  }, [productItemsDetail]);

  useEffect(() => {
    if (test) {
      setDefaultImage(test);
    }
  }, [test]);

  const updateData = (name, newData) => {
    if (name === "color") {
      setDataColor(newData);
    } else if (name === "size") {
      setDataSize(newData);
    }
  };

  const combineData = () => {
    let combined = [];

    dataColor.forEach((colorItem) => {
      dataSize.forEach((sizeItem) => {
        combined.push({ ...colorItem, ...sizeItem });
      });
    });

    let newCombined = [];

    if (isEdit) {
      console.log("priceQuantityActiveIDArray", priceQuantityActiveIDArray);
      newCombined = combined.map((item, index) => {
        // console.log(`item`, {...item});
        return {
          ...item,
          price: priceQuantityActiveIDArray[index]?.price,
          quantityInStock: priceQuantityActiveIDArray[index]?.quantityInStock,
          active: priceQuantityActiveIDArray[index]?.active,
          id: priceQuantityActiveIDArray[index]?.id,
        };
      });
    } else {
      newCombined = combined.map((item, index) => {
        return {
          ...item,
        };
      });
    }

    console.log("newCombined", newCombined);

    setCombinedData(newCombined);
  };

  const handleDoneClick = () => {
    if (dataColor.length > 0 && dataSize.length > 0) {
      const duplicateColor = hasDuplicates(dataColor, "color");
      const duplicateSize = hasDuplicates(dataSize, "size");
      if (duplicateColor.length > 0 || duplicateSize.length > 0) {
        // Display duplicate message
        if (duplicateColor.length > 0) {
          message.warning("Có màu trùng lặp trong danh sách!");
        }
        if (duplicateSize.length > 0) {
          message.warning("Có kích thước trùng lặp trong danh sách!");
        }
      } else {
        combineData();
        setShowPriceQuantity(true);
      }
    }
  };
  const hasDuplicates = (array, property) => {
    const values = array.map((item) => item[property]);
    const uniqueValues = [...new Set(values)];
    const duplicates = values.filter(
      (value, index) => values.indexOf(value) !== index
    );
    return [...new Set(duplicates)];
  };

  useEffect(() => {
    // Kiểm tra xem có đủ dữ liệu để kích hoạt nút "Xong" hay không
    if (dataColor.length > 0 && dataSize.length > 0) {
      setErrorText("");
    }
    setButtonDisabled(!(dataColor.length > 0 && dataSize.length > 0));
  }, [dataColor, dataSize]);

  const handleDefaultImageChange = (imageData) => {
    setDefaultImage(imageData);
    onDefaultImageChange(imageData);
  };

  const updateCombinedData = (updatedData) => {
    setCombinedData(updatedData);
    props.onCombinedDataChange(updatedData);
  };

  return (
    <div>
      <p style={{ fontSize: "14px", fontWeight: "500", marginBottom: "10px" }}>
        {title}
      </p>

      {/* Add Default picture */}
      <UploadImage
        onImageChange={handleDefaultImageChange}
        dataImage={defaultImage}
        isEdit={isEdit}
      />

      {/* Variations */}
      <Variations
        data={dataColor}
        title={"Màu sắc"}
        name={"color"}
        updateData={(newData) => updateData("color", newData)}
        isEdit={isEdit}
      />
      <Variations
        data={dataSize}
        title={"Size"}
        name={"size"}
        updateData={(newData) => updateData("size", newData)}
        isHiddenAddPicture
        isEdit={isEdit}
      />

      {/* Button render Price_Quantity */}
      {errorText && (
        <p style={{ color: "red", marginBottom: "10px" }}>{errorText}</p>
      )}
      <Button
        style={{
          margin: "10px 0",
          backgroundColor: "blue",
          color: "#fff",
          fontWeight: "500",
        }}
        onClick={handleDoneClick}
        disabled={isButtonDisabled}
      >
        Tiến hành tạo biến thể
      </Button>

      {showPriceQuantity && (
        <Price_Quantity
          combinedData={combinedData}
          updateCombinedData={updateCombinedData}
          saveButtonClicked={saveButtonClicked}
          setSaveButtonClicked={setSaveButtonClicked}
          isEdit={isEdit}
        />
      )}
    </div>
  );
};

export default GroupVariation;
