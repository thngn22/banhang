import { Rate, Space, Table } from "antd";
import React from "react";
import "./Review.css";

const Review = (props) => {
  const desc = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"];

  const renderReview = (user, rating, content) => {
    return (
      <>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="user text-sm font-semibold text-gray-900">
            {user}
          </span>
          <Space className="configStar" style={{ marginLeft: "8px" }}>
            <>
              <Rate tooltips={desc} disabled value={rating} allowHalf />
            </>
          </Space>
        </div>
        <div className="content text-sm ">{content}</div>
      </>
    );
  };

  const renderDate = (date) => {
    return <div style={{ fontSize: "16px", textAlign: "center" }}>{date}</div>;
  };

  const columns = [
    {
      title: "Đánh giá sản phẩm",
      dataIndex: "rating", // Đổi từ "math" thành "rating"
      sorter: {
        compare: (a, b) => a.rating - b.rating, // Sắp xếp theo rating
        multiple: 2,
      },
      render: (text, record) =>
        renderReview(record.userEmail, record.rating, record.feedback),
    },
    {
      title: "Ngày tạo",
      dataIndex: "date",
      sorter: {
        compare: (a, b) => new Date(a.createdAt) - new Date(b.createdAt), // Sắp xếp theo thời gian ngày
        multiple: 1,
      },
      render: (text, record) => renderDate(record.createdAt),
    },
  ];
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={props.dataReviews}
        onChange={onChange}
        className="review"
      />
    </div>
  );
};

export default Review;
