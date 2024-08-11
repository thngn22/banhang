import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Input, message } from "antd";
import StarRating from "../../components/StarRating/StarRating";
import UploadImage from "../../../Admin/components/UploadFile/UploadImage";
import { Button } from "antd";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as OrderService from "../../../services/OrderService";
import { useQuery } from "@tanstack/react-query";

const OrderItemFix = (props) => {
  const detailOrder = useSelector(
    (state) => state.order.detailOrder.currentOrder
  );
  const auth = useSelector((state) => state.auth.login.currentUser);
  //   console.log(detailOrder);
  const [countStar, setCountStar] = React.useState(0);
  const [image, setImage] = React.useState();
  const [feedbackText, setFeedbackText] = React.useState("");
  const [reviewed, setReviewed] = useState(false);

  const onSelectedStar = (stars) => {
    setCountStar(stars);
  };

  const handleImageChange = (imageData) => {
    setImage(imageData);
  };
  const mutationRating = useMutationHook((data) => {
    const res = OrderService.ratingProductOrdered(
      detailOrder?.id,
      data,
      auth.accessToken
    );
    return res;
  });
  const getRating = async () => {
    const res = await OrderService.getRatingProductOrdered(
      detailOrder?.id,
      auth.accessToken
    );
    return res;
  };

  const { data: rating, refetch } = useQuery({
    queryKey: ["rating"],
    queryFn: getRating,
  });
  const matching = rating?.find(
    (x) => x?.productId === props.orderItem?.productId
  );
  //   console.log("rating", rating);
  //   console.log("matching", matching);

  return (
    <div className="p-3 border rounded-md mb-3">
      <div className="flex items-center">
        <div className="w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem]">
          <img
            className="w-full h-full object-cover object-top"
            src={props.orderItem.productItemImage}
            alt={props.orderItem.productItemImage}
          />
        </div>
        <div className="ml-5 space-y-1">
          <p className="font-semibold">Windbreaker Black White AK077</p>
          <p className="opavity-70">
            Size: {props.orderItem.size}, Color: {props.orderItem.color}
          </p>

          <div className="flex flex-col items-start justify-center space-y-2 text-gray-900 pt-6">
            <div className="flex items-center space-x-2">
              <p className="font-semibold">Giá sản phẩm:</p>
              <p>
                {props.orderItem.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <p className="font-semibold">Số lượng:</p>
              <p>{props.orderItem.quantity}</p>
            </div>
            <div className="flex items-center space-x-2">
              <p className="font-semibold">Tổng giá sản phẩm:</p>
              <p className="text-green-600 font-semibold">
                {props.orderItem.totalPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
      {detailOrder?.statusOrder === "HOAN_TAT" && matching === undefined && (
        <div>
          <h1 className="text-[16px] font-semibold">Đánh giá sản phẩm</h1>
          <div className="mt-2">
            <StarRating
              notSelect={true}
              onSelectedStar={onSelectedStar}
              ratingStar={0}
            ></StarRating>
          </div>
          <div className="my-2">
            <Input
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Đánh giá của bạn"
            />
          </div>
          <div className="flex justify-end">
            <Button
              style={{
                backgroundColor: "yellowgreen",
                height: "42px",
              }}
              disabled={reviewed}
              onClick={() => {
                mutationRating.mutate(
                  [
                    {
                      orderItemId: props.orderItem?.id,
                      productId: props.orderItem?.productId,
                      ratingStars: countStar,
                      feedback: feedbackText,
                      imageFeedback: null,
                    },
                  ],
                  {
                    onSuccess: () => {
                      message.success("Đánh giá thành công");
                      setReviewed(true);
                      //   props.setIsModalOpen(false);
                    },
                    onError: (err) => {
                      message.error(`Lỗi ${err}`);
                    },
                  }
                );
              }}
            >
              <span className="text-white font-semibold">Đánh giá</span>
            </Button>
          </div>
        </div>
      )}
      {detailOrder?.statusOrder === "HOAN_TAT" && matching !== undefined && (
        <div>
          <h1 className="text-[16px] font-semibold">Đánh giá sản phẩm </h1>

          <div className="mt-2">
            <StarRating
              className="cursor-none"
              onSelectedStar={onSelectedStar}
              notSelect={false}
              ratingStar={matching?.rating}
            ></StarRating>
          </div>
          <div className="my-2">
            <Input value={matching?.feedback} />
          </div>
          <div>
            <img
              src={`${rating?.imageFeedback ?? ""}`}
              alt={`${rating?.imageFeedback ?? ""}`}
            />
          </div>
        </div>
      )}
      <br />
    </div>
  );
};

export default OrderItemFix;
