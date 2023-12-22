import React, { useEffect, useState } from "react";
import InputField from "../../../customer/components/InputField";
import { Button, Input, message } from "antd";

import { DeleteOutlined } from "@ant-design/icons";
import UploadImage from "../UploadFile/UploadImage";
import { useSelector } from "react-redux";

const Variations = (props) => {
  const { title, name, isHiddenAddPicture = false, data, updateData } = props;

  let variationsArray = [];
  const [variations, setVariations] = useState(variationsArray);

  useEffect(() => {
    if (props.isEdit) {
      data.map((item) => variationsArray.push(item));
      setVariations(variationsArray);
    }
  }, [data]);

  const addVariation = () => {
    setVariations((prevVariations) => [
      ...prevVariations,
      { id: prevVariations.length, text: "", image: "" },
    ]);
  };
  const deleteVariation = (id) => {
    setVariations((prevVariations) =>
      prevVariations.filter((variation) => variation.id !== id)
    );
  };
  const handleInputChange = (id, value) => {
    const updatedVariations = variations.map((variation) =>
      variation.id === id ? { ...variation, text: value } : variation
    );
    setVariations(updatedVariations);
  };
  const handleInputChangeEdit = (id, value) => {
    if (props.isEdit) {
      const updatedVariations = variations.map((variation, index) => {
        if (id === index) {
          if (name === "color") {
            return { ...variation, color: value };
          } else {
            return { ...variation, size: value };
          }
        } else {
          return variation;
        }
      });
      setVariations(updatedVariations);
    }
  };
  const handleImageChange = (id, image) => {
    const updatedVariations = variations.map((variation) =>
      variation.id === id ? { ...variation, image } : variation
    );
    setVariations(updatedVariations);
  };
  const handleImageChangeEdit = (id, image) => {
    // console.log("imageChange", image);
    if (props.isEdit) {
      const updatedVariations = variations.map((variation, index) => {
        if (id === index) {
          return { ...variation, productImage: image };
        } else {
          return variation;
        }
      });
      setVariations(updatedVariations);
    }
  };
  const saveData = () => {
    console.log("variations", variations);
    const newData = variations.map((variation) => {
      if (name === "color") {
        if (variation.text !== "" && variation.image !== "") {
          const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
          if (specialCharacterRegex.test(variation.text)) {
            message.error("Không được nhập các ký tự đặc biệt");
          } else {
            console.log("variations color", variations);
            return { color: variation.text, productImage: variation.image };
          }
        } else {
          message.warning("Hãy nhập đầy đủ Màu và hình ảnh");
        }
      } else {
        if (variation.text !== "") {
          // Sử dụng biểu thức chính quy để kiểm tra xem chuỗi chỉ chứa số hay không
          const numericRegex = /^\d+$/;

          if (numericRegex.test(variation.text)) {
            console.log("variations size", variations);
            return { size: variation.text };
          } else {
            message.error("Hãy nhập chỉ số, không nhập ký tự khác");
          }
        } else {
          message.warning("Hãy nhập đầy đủ Size");
        }
      }
    });

    if (newData.length > 0) {
      let check = false;
      newData.forEach((item) => {
        if (item === undefined) {
          check = true;
        }
      });
      if (!check) {
        console.log("newData", newData);
        updateData(newData);
      } else {
        check = !check;
      }
    }
  };
  const saveDataDetail = () => {
    const newData = variations.map((variation) => {
      if (name === "color") {
        if (variation.color !== "" && variation.productImage !== "") {
          const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
          if (specialCharacterRegex.test(variation.color)) {
            message.error("Không được nhập các ký tự đặc biệt");
          } else {
            console.log("variations color", variation);
            return {
              color: variation.color,
              productImage: variation.productImage,
            };
          }
        } else {
          message.warning("Hãy nhập đầy đủ Màu và hình ảnh");
        }
      } else {
        if (variation.text !== "") {
          // Sử dụng biểu thức chính quy để kiểm tra xem chuỗi chỉ chứa số hay không
          const numericRegex = /^\d+$/;

          if (numericRegex.test(variation.text)) {
            console.log("variations size", variations);
            return { size: variation.size };
          } else {
            message.error("Hãy nhập chỉ số, không nhập ký tự khác");
          }
        } else {
          message.warning("Hãy nhập đầy đủ Size");
        }
      }
    });

    if (newData.length > 0) {
      let check = false;
      newData.forEach((item) => {
        if (item === undefined) {
          check = true;
        }
      });
      if (!check) {
        console.log(`newData ${name}`, newData);
        updateData(newData);
      } else {
        check = !check;
      }
    }
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
      {variations.map((variation, index) => (
        <div key={index} style={{ display: "flex", marginBottom: "10px" }}>
          {!props.isEdit && (
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
          )}
          {props.isEdit ? (
            <Input
              style={{
                padding: "6px 20px",
                margin: "8px 50px 8px 0px",
                height: "38px",
              }}
              value={name === "color" ? variation.color : variation.size}
              onChange={(e) => {
                handleInputChangeEdit(index, e.target.value);
              }}
            />
          ) : (
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
          )}

          {!isHiddenAddPicture ? (
            <UploadImage
              onImageChange={(image) =>
                props.isEdit
                  ? handleImageChangeEdit(index, image)
                  : handleImageChange(variation.id, image)
              }
              dataImage={variation.productImage}
              isEdit={props.isEdit}
            />
          ) : (
            <></>
          )}
        </div>
      ))}
      {props.isEdit ? (
        <></>
      ) : (
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
      )}

      {props.isEdit ? (
        <Button
          onClick={saveDataDetail}
          style={{
            marginBottom: "10px",
            backgroundColor: "green",
            color: "#fff",
            fontWeight: "500",
          }}
        >
          Lưu {title}
        </Button>
      ) : (
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
      )}
    </div>
  );
};

export default Variations;
