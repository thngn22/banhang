import React, { useEffect, useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const UploadImage = (props) => {
  const { onImageChange, dataImage, isEdit } = props;

  const [fileList, setFileList] = useState([]);
  const [base64Image, setBase64Image] = useState("");
  let test = dataImage;
  if (dataImage && dataImage.startsWith("/9j/")) {
    test = `data:image/jpeg;base64,${dataImage}`;
  }

  console.log("base64Image", base64Image);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Bạn chỉ có thể tải lên tệp hình ảnh!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ảnh phải nhỏ hơn 2MB!");
    }
    return isImage && isLt2M;
  };
  const handleChange = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} tải lên thành công`);
      convertToBase64(info.file.originFileObj);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} tải lên thất bại.`);
    }

    setFileList(info.fileList);
  };
  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const processedBase64Data = reader.result.split(
        "data:image/jpeg;base64,"
      )[1];
      setBase64Image(reader.result);
      console.log("processedBase64Data", processedBase64Data);
      onImageChange(processedBase64Data);
    };
  };
  const customRequest = ({ onSuccess, onError, file }) => {
    const fakeRequest = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });

    fakeRequest
      .then(() => {
        onSuccess();
      })
      .catch(() => {
        onError();
      });
  };

  const renderImage = () => {
    if (test && isEdit) {
      return (
        <img
          src={test}
          alt="ErrorImage"
          style={{ width: "150px", height: "150px", objectFit: "cover" }}
        />
      );
    } else {
      if (base64Image) {
        return (
          <img
            src={base64Image}
            alt="ErrorImage"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
        );
      } else {
        return (
          <Button
            type="dashed"
            style={{
              display: "block",
              height: "150px",
              width: "150px",
              position: "relative",
            }}
          >
            <p
              style={{
                fontWeight: "300",
                fontSize: "80px",
                position: "absolute",
                top: 0,
                left: "34%",
              }}
            >
              +
            </p>
          </Button>
        );
      }
    }
  };

  return (
    <div style={{ display: "block", backgroundColor: "#fff" }}>
      <Upload
        customRequest={customRequest}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        fileList={fileList}
        maxCount={1}
        showUploadList={false}
      >
        {renderImage(fileList)}
      </Upload>
    </div>
  );
};

export default UploadImage;
