import { Rate, Space } from "antd";
import React from "react";
import "./styles.css";
import { formatDateInHisoryOrder } from "../../../utils/untils";

const Review2 = ({ reviewItem }) => {
  console.log(reviewItem);
  return (
    <div className="prduct-details__review flex items-start flex-col px-6 pb-6 pt-4 border-2 border-gray-300 rounded-xl gap-2">
      <Space className="configStar">
        <Rate
          tooltips={reviewItem.desc}
          disabled
          value={reviewItem.rating}
          allowHalf
        />
      </Space>
      <p className="text-lg font-semibold text-gray-900">
        {reviewItem.userEmail}
      </p>
      <div className="text-gray-500">
        <p>{reviewItem.feedback}</p>
      </div>
      <p className="text-gray-400 font-medium">
        Posted on {formatDateInHisoryOrder(reviewItem.updatedAt)}
      </p>
    </div>
  );
};

export default Review2;
