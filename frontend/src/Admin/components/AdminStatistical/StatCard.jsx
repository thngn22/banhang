import React from "react";
import { Col } from "antd";

const StatCard = ({ title, value, icon, bgColor, textColor, borderColor }) => {
  return (
    <Col span={4}>
      <div
        style={{
          padding: "8px 8px",
          backgroundColor: bgColor,
          borderRadius: "10px",
          fontWeight: "600",
          fontSize: "1.2em",
          margin: "8px 0",
          height: "88px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          border: `2px solid ${borderColor}`,
          color: textColor,
        }}
      >
        <p>{title}</p>
        <p>
          {React.cloneElement(icon, { style: { marginRight: "4px" } })} {value}
        </p>
      </div>
    </Col>
  );
};

export default StatCard;
