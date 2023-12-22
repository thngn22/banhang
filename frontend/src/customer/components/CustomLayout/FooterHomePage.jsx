import React from "react";
import { Col, Row } from "antd";
import { dataFooter } from "./DataFooterHome";
import "./styleFooterHome.css";

const FooterHomePage = () => {
  const items = dataFooter.map((item, index) => (
    <div key={index} className="carousel-item__customFooter">
      <img
        className="cursor-pointer"
        src={item.image}
        path={item.path}
        role="presentation"
        alt="item-presentation"
        style={{ width: "100%" }}
      />
    </div>
  ));
  return (
    <div>
      <>
        <Row>
          <Col
            span={4}
            xs={{
              order: 1,
            }}
            sm={{
              order: 2,
            }}
            md={{
              order: 3,
            }}
            lg={{
              order: 4,
            }}
          >
            {items[0]}
          </Col>
          <Col
            span={4}
            xs={{
              order: 2,
            }}
            sm={{
              order: 1,
            }}
            md={{
              order: 4,
            }}
            lg={{
              order: 3,
            }}
          >
            {items[1]}
          </Col>
          <Col
            span={4}
            xs={{
              order: 3,
            }}
            sm={{
              order: 4,
            }}
            md={{
              order: 2,
            }}
            lg={{
              order: 1,
            }}
          >
            {items[2]}
          </Col>
          <Col
            span={4}
            xs={{
              order: 4,
            }}
            sm={{
              order: 3,
            }}
            md={{
              order: 1,
            }}
            lg={{
              order: 2,
            }}
          >
            {items[3]}
          </Col>
          <Col
            span={4}
            xs={{
              order: 5,
            }}
            sm={{
              order: 6,
            }}
            md={{
              order: 5,
            }}
            lg={{
              order: 6,
            }}
          >
            {items[4]}
          </Col>
          <Col
            span={4}
            xs={{
              order: 6,
            }}
            sm={{
              order: 5,
            }}
            md={{
              order: 6,
            }}
            lg={{
              order: 5,
            }}
          >
            {items[5]}
          </Col>
        </Row>
      </>
    </div>
  );
};

export default FooterHomePage;
