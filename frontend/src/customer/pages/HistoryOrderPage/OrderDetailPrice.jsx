import { Col, Row } from "antd";
import React from "react";

const OrderDetailPrice = (props) => {
  const { detailOrder } = props;

  return (
    <div>
      <Row className="border-t border-l border-r border-gray-300 text-right">
        <Col
          span={16}
          className="border-l pr-4 font-semibold"
          style={{ height: "32px", lineHeight: "32px" }}
        >
          Số lượng sản phẩm
        </Col>
        <Col
          span={8}
          className="border-l pr-4"
          style={{ height: "32px", lineHeight: "32px" }}
        >
          {detailOrder.totalItem}
        </Col>
      </Row>
      <Row className="border-t border-l border-r border-gray-300 text-right">
        <Col
          span={16}
          className="border-l pr-4 font-semibold"
          style={{ height: "32px", lineHeight: "32px" }}
        >
          Tổng tiền sản phẩm
        </Col>
        <Col
          span={8}
          className="border-l pr-4"
          style={{ height: "32px", lineHeight: "32px" }}
        >
          {detailOrder.totalPayment.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Col>
      </Row>
      <Row className="border-t border-l border-r border-gray-300 text-right">
        <Col
          span={16}
          className="border-l pr-4 font-semibold"
          style={{ height: "32px", lineHeight: "32px" }}
        >
          Dịch vụ chuyển phát
        </Col>
        <Col
          span={8}
          className="border-l pr-4"
          style={{ height: "32px", lineHeight: "32px" }}
        >
          {detailOrder.delivery.name} +
          {detailOrder.delivery.price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Col>
      </Row>
      <Row className="border-t border-l border-r border-gray-300 text-right">
        <Col
          span={16}
          className="border-l pr-4 font-semibold"
          style={{ height: "32px", lineHeight: "32px" }}
        >
          Thành tiền
        </Col>
        <Col
          span={8}
          className="border-l pr-4 font-semibold text-red-600"
          style={{ height: "32px", lineHeight: "32px" }}
        >
          {detailOrder.finalPayment.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Col>
      </Row>
      <Row className="border-t border-l border-r border-b border-gray-300 text-right">
        <Col
          span={16}
          className="border-l pr-4 font-semibold"
          style={{ height: "32px", lineHeight: "32px" }}
        >
          Phương thức thanh toán
        </Col>
        <Col
          span={8}
          className="border-l pr-4 font-semibold"
          style={{
            height: "32px",
            lineHeight: "32px",
            color:
              detailOrder.userPaymentMethod.nameMethod === "COD"
                ? "blue"
                : "red",
          }}
        >
          {detailOrder.userPaymentMethod.nameMethod}
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetailPrice;
