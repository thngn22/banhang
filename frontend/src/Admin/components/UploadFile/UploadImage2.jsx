import React, { useState } from "react";
import { Upload, Button, message } from "antd";

const UploadImage2 = (props) => {
  const { onImageChange, dataImage, isEdit } = props;

  const [fileList, setFileList] = useState([]);
  const [imageConverted, setImageConverted] = useState("");
  let test = dataImage;
  if (dataImage && dataImage instanceof File){
    test = URL.createObjectURL(dataImage)
  }

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
      convertImage(info.file.originFileObj);
      onImageChange(info.file.originFileObj)
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} tải lên thất bại.`);
    }

    setFileList(info.fileList);
  };
  const convertImage = (file) => {
    const imageURL = URL.createObjectURL(file)
    setImageConverted(imageURL)
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
      if (imageConverted) {
        return (
          <img
            src={imageConverted}
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
    <div>
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

export default UploadImage2;
