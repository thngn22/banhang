import React, { useEffect, useState } from "react";
import { Switch } from "antd";
import { Button } from "antd";
import Price_Quantity from "./Price_Quantity";
import Variations from "./Variations";
import UploadImage from "../UploadFile/UploadImage";

const GroupVariation = (props) => {
  const { title, saveButtonClicked, setSaveButtonClicked } = props;

  const [dataSize, setDataSize] = useState([]);
  const [dataColor, setDataColor] = useState([]);
  const [showPriceQuantity, setShowPriceQuantity] = useState(false);
  const [combinedData, setCombinedData] = useState([]);
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const [errorText, setErrorText] = useState(
    "Bạn cần nhập ít nhất một color và một size. Thì nút Xong mới hoạt động được"
  );
  const [defaultImage, setDefaultImage] = useState("");

  const updateData = (name, newData) => {
    if (name === "color") {
      setDataColor(newData);
    } else if (name === "size") {
      setDataSize(newData);
    }
  };
  //   console.log("color", dataColor);
  //   console.log("size", dataSize);

  const combineData = () => {
    // // Combine dataColor and dataSize into a single array
    // const combined = dataColor.map((color) =>
    //   dataSize.map((size) => ({ color, size }))
    // );
    // setCombinedData(combined.flat()); // Use flat to flatten the nested arrays

    let combined = [];

    dataColor.forEach((colorItem) => {
      dataSize.forEach((sizeItem) => {
        combined.push({ ...colorItem, ...sizeItem });
      });
    });

    setCombinedData(combined);
  };

  const handleDoneClick = () => {
    // if (dataColor.length > 0 && dataSize.length > 0) {
    //   combineData();
    //   setShowPriceQuantity(true);
    // }

    if (dataColor.length > 0 && dataSize.length > 0) {
      combineData();
      setShowPriceQuantity(true);
    }
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
    props.onDefaultImageChange(imageData);
  };

  //   console.log("defaultImage", defaultImage);

  const updateCombinedData = (updatedData) => {
    // Logic xử lý khi có dữ liệu được cập nhật từ Price_Quantity
    // ...
    // Ở đây có thể setState hoặc thực hiện các bước cần thiết
    setCombinedData(updatedData);
    props.onCombinedDataChange(updatedData);
  };

//   console.log("combinedData", combinedData);

  return (
    <div>
      <p style={{ fontSize: "14px", fontWeight: "500", marginBottom: "10px" }}>
        {title}
      </p>

      {/* Add Default picture */}
      <UploadImage onImageChange={handleDefaultImageChange} />

      {/* Variations */}
      <Variations
        data={dataColor}
        title={"Màu sắc"}
        name={"color"}
        updateData={(newData) => updateData("color", newData)}
      />
      <Variations
        data={dataSize}
        title={"Size"}
        name={"size"}
        updateData={(newData) => updateData("size", newData)}
        isHiddenAddPicture
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
        />
      )}
    </div>
  );
};

export default GroupVariation;
