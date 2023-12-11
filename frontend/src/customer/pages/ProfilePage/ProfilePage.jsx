import React from "react";
import { WrapperHeader } from "./style";
import UploadImage from "../../../Admin/components/UploadFile/UploadImage";
import InputField from "../../../customer/components/InputField";
import { Button } from "antd";

const ProfilePage = () => {
  const styleInputField = {
    width: "388px",
  };
  const titleSpanStyle = {
    textAlign: "left",
    width: "100px", // Độ dài cố định của các span "Tiêu đề"
    marginRight: "10px", // Khoảng cách 10px giữa span "Tiêu đề" và InputField
    fontWeight: "bold",
  };

  return (
    <div
      style={{ minHeight: "70vh", backgroundColor: "rgba(169, 169, 169, 0.2)" }}
    >
      <div
        style={{
          height: "100%",
          padding: "10px 120px",
          margin: "0 10rem",
          backgroundColor: "#fff",
          position: "relative",
        }}
      >
        <WrapperHeader>Thông tin cá nhân</WrapperHeader>
        <img
          style={{ height: "480px", position: "absolute", right: "25px" }}
          src="https://cdn.printgo.vn/uploads/media/774255/logo-giay-1_1586510617.jpg"
          alt="https://cdn.printgo.vn/uploads/media/774255/logo-giay-1_1586510617.jpg"
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <UploadImage />
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={titleSpanStyle}>Họ:</span>
              <InputField style={styleInputField} />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={titleSpanStyle}>Tên:</span>
              <InputField style={styleInputField} />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={titleSpanStyle}>Email:</span>
              <InputField style={styleInputField} />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={titleSpanStyle}>SĐT:</span>
              <InputField style={styleInputField} />
            </div>
          </div>
        </div>

        <Button
          style={{
            display: "flex",
            alignItems: "flex-start",
            marginTop: "16px",
            backgroundColor: "blue",
            color: "white",
            fontWeight: "600",
            fontSize: "18px",
            height: "50px",
            padding: "10px",
          }}
        >
          <span>Cập nhập thông tin tài khoản</span>
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
