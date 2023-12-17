import { Rate, Space, Table } from "antd";
import React from "react";
import "./Review.css";

const Review = (props) => {
  const desc = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"];

  const renderReview = (user, rating, content) => {
    return (
      <>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="user text-lg font-semibold text-gray-900">
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
        renderReview(record.user, record.rating, record.content),
    },
    {
      title: "Ngày tạo",
      dataIndex: "date",
      sorter: {
        compare: (a, b) => new Date(a.date) - new Date(b.date), // Sắp xếp theo thời gian ngày
        multiple: 1,
      },
      render: (text, record) => renderDate(record.date),
    },
  ];
  const data = [
    {
      key: "1",
      user: "user1",
      rating: 5,
      content: "this is content for review",
      date: "1/12/2023 13:03:54",
    },
    {
      key: "2",
      user: "user2",
      rating: 4.5,
      content: "this is content for review",
      date: "12/10/2023 13:03:54",
    },
    {
      key: "3",
      user: "user3",
      rating: 3,
      content: "this is content for review",
      date: "12/3/2023 13:03:54",
    },
    {
      key: "4",
      user: "user4",
      rating: 2.5,
      content: "this is content for review",
      date: "12/12/2023 13:03:54",
    },
  ];
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div>
      <Table columns={columns} dataSource={data} onChange={onChange} />
    </div>
  );
};

export default Review;
