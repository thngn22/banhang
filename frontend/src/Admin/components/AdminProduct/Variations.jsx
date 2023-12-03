import React, { useState } from "react";
import InputField from "../../../customer/components/InputField";
import { Button, Input } from "antd";

import { DeleteOutlined } from "@ant-design/icons";
import UploadImage from "../UploadFile/UploadImage";

const Variations = (props) => {
  const { title, name, isHiddenAddPicture = false, data, updateData } = props;
  const [variations, setVariations] = useState([]);

  const addVariation = () => {
    // setVariations([...variations, { id: variations.length + 1 }]);
    setVariations([
      ...variations,
      { id: variations.length + 1, text: "", image: "" },
    ]);
  };

  const deleteVariation = (id) => {
    setVariations(variations.filter((variation) => variation.id !== id));
  };

  const handleInputChange = (id, value) => {
    // const updatedVariations = variations.map((variation) =>
    //   variation.id === id ? { ...variation, text: value } : variation
    // );
    // setVariations(updatedVariations);

    const updatedVariations = variations.map((variation) =>
      variation.id === id ? { ...variation, text: value } : variation
    );
    setVariations(updatedVariations);
  };

  const handleImageChange = (id, image) => {
    const updatedVariations = variations.map((variation) =>
      variation.id === id ? { ...variation, image } : variation
    );
    setVariations(updatedVariations);
  };

  const saveData = () => {
    // const newData = variations.map((variation) => variation.text);
    // updateData(newData);

    // const newData = variations.map((variation) => ({ color: variation.text, image: variation.image }));
    // updateData(newData);

    // const newData = variations.map((variation) => ({
    //   color: variation.text,
    //   image: variation.image,
    // }));
    // updateData(newData);

    const newData = variations.map((variation) => {
      if (name === "color") {
        // Nếu là variation color, chứa cả thuộc tính image
        return { color: variation.text, image: variation.image };
      } else {
        // Nếu là variation size, không chứa thuộc tính image
        return { size: variation.text };
      }
    });
    updateData(newData);
  };

  const styleInputField = {
    width: "100%",
  };

  return (
    <div
      style={{
        backgroundColor: "rgba(169, 169, 169, 0.2)",
        marginTop: "10px",
        padding: "0 16px",
      }}
    >
      <p style={{ fontSize: "14px", fontWeight: "500" }}>{title}</p>
      {variations.map((variation) => (
        <div
          key={variation.id}
          style={{ display: "flex", marginBottom: "10px" }}
        >
          <DeleteOutlined
            onClick={() => deleteVariation(variation.id)}
            style={{
              color: "red",
              fontSize: "26px",
              cursor: "pointer",
              alignItems: "flex-start",
              margin: "12px 20px 0px 0px ",
            }}
          />
          <Input
            style={{
              padding: "6px 20px",
              margin: "8px 50px 8px 0px",
              height: "38px",
            }}
            onChange={(e) => {
              handleInputChange(variation.id, e.target.value);
            }}
          />
          {!isHiddenAddPicture && (
            <UploadImage
              onImageChange={(image) => handleImageChange(variation.id, image)}
            />
          )}
        </div>
      ))}
      <Button
        onClick={addVariation}
        style={{
          marginBottom: "10px",
          backgroundColor: "orange",
          color: "#fff",
          fontWeight: "500",
        }}
      >
        Thêm {title}
      </Button>

      <Button
        onClick={saveData}
        style={{
          marginBottom: "10px",
          backgroundColor: "green",
          color: "#fff",
          fontWeight: "500",
        }}
      >
        Lưu {title}
      </Button>
    </div>
  );
};

export default Variations;
