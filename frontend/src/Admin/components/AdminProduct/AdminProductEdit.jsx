import React, { useEffect, useState } from "react";
import { WrapperHeader, WrapperSubHeader } from "./style";
import InputField from "../../../customer/components/InputField";
import Group from "./Group";
import GroupVariation from "./GroupVariation";
import { Button, message } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as ProductService from "../../../services/ProductService";
import { updateProductDetail } from "../../../redux/slides/productSlice";

import MultilevelDropdown from "../MultilevelDropdown/MultilevelDropdown";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../../../redux/slides/authSlice";
import axios from "axios";
import * as AuthService from "../../../services/AuthService";
import CustomInput from "../../../customer/components/CKEditor/customInput";

const AdminProductEdit = (props) => {
  // console.log("key", props.idDetailProduct);
  const dispatch = useDispatch();

  let productDetail = useSelector(
    (state) => state.product.productDetail.currentProduct
  );
  let cateInEdit = useSelector(
    (state) => state.category.multilevelCate.currentCate
  );
  const auth = useSelector((state) => state.auth.login.currentUser);

  const [dataNameProduct, setDataNameProduct] = useState("");
  const [dataCategory, setDataCategory] = useState("");
  const [dataDescription, setDataDescription] = useState("");
  const [saveButtonClicked, setSaveButtonClicked] = useState(false);
  const [defaultImage, setDefaultImage] = useState("");
  const [combinedData, setCombinedData] = useState([]);
  const [isEdit, setIsEdit] = useState(true);

  console.log("defaultImage", defaultImage);

  const [dataAPICreate, setDataAPICreate] = useState(null);

  useEffect(() => {
    setDataCategory(productDetail.categoryId);
    setDataDescription(productDetail.description);
    setDataNameProduct(productDetail.name);
    setDefaultImage(productDetail.productImage);
    setCombinedData(productDetail.productItems);
  }, [productDetail]);

  const handleDefaultImageChange = (imageData) => {
    setDefaultImage(imageData);
  };
  const handleCombinedDataChange = (data) => {
    setCombinedData(data);
  };

  const refreshToken = async () => {
    try {
      const data = await AuthService.refreshToken();
      // console.log("data", data);
      return data?.accessToken;
    } catch (err) {
      console.log("err", err);
    }
  };

  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      let date = new Date();
      if (auth?.accessToken) {
        const decodAccessToken = jwtDecode(auth?.accessToken);
        if (decodAccessToken.exp < date.getTime() / 1000) {
          const data = await refreshToken();
          const refreshUser = {
            ...auth,
            accessToken: data,
          };

          // console.log("data in axiosJWT", data);
          // console.log("refreshUser", refreshUser);

          dispatch(loginSuccess(refreshUser));
          config.headers["Authorization"] = `Bearer ${data}`;
        }
      }

      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const mutation = useMutationHook((data) => {
    const res = ProductService.editProduct(data, auth.accessToken, axiosJWT);
    return res;
  });
  const { data, status, isSuccess, isError } = mutation;

  const handleCreateProductClick = () => {
    if (
      dataNameProduct !== "" &&
      dataDescription !== "" &&
      defaultImage !== "" &&
      parseInt(dataCategory.id) !== null
    ) {
      const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (
        specialCharacterRegex.test(dataNameProduct) ||
        specialCharacterRegex.test(dataDescription)
      ) {
        message.error("Không được nhập các ký tự đặc biệt");
      } else {
        const productCreateRequest = {
          id: productDetail?.id,
          active: productDetail?.active,
          name: dataNameProduct,
          description: dataDescription,
          productImage: defaultImage,
          categoryId: parseInt(dataCategory?.id),
        };

        const productItems = combinedData?.map((item) => ({
          id: item?.id,
          price: item?.price,
          quantityInStock: item?.quantity,
          productImage: item?.productImage,
          active: item?.active,
          size: item?.size,
          color: item?.color,
        }));

        const apiPayload = {
          ...productCreateRequest,
          productItems,
        };

        console.log("apiPayload", apiPayload);
        setDataAPICreate(apiPayload);

        mutation.mutate(apiPayload, {
          onSuccess: () => {
            message.success("Chỉnh sửa sản phẩm thành công");
            props.setIsModalOpen(false);

            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },
          onError: (error) => {
            message.error(`Đã xảy ra lỗi: ${error.message}`);
            props.setIsModalOpen(false);
          },
        });
      }
    } else {
      message.warning(
        "Hãy nhập đầy đủ thông tin địa chỉ trước khi Chỉnh sửa sản phẩm"
      );
    }
  };

  // if (isSuccess || isError) {
  //   window.location.reload();
  // }

  const handleMenuItemClick = (id, name) => {
    setDataCategory({ id, name });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <WrapperHeader style={{ paddingLeft: "20px" }}>
        Thêm Sản phẩm
      </WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <div
          style={{
            margin: "16px 20px",
            padding: "10px 16px",
            border: "1px solid",
            borderRadius: "10px",
          }}
        >
          <WrapperSubHeader>Thông tin cơ bản</WrapperSubHeader>
          <Group
            title={"Tên sản phẩm"}
            onDataChange={setDataNameProduct}
            dataDetail={dataNameProduct}
          />
          <Group
            title={"Hạng mục"}
            onDataChange={setDataCategory}
            dataCate={dataCategory}
            isCategory={true}
          />
          <MultilevelDropdown onMenuItemClick={handleMenuItemClick} />
        </div>

        <div
          style={{
            margin: "16px 20px",
            padding: "10px 16px",
            border: "1px solid",
            borderRadius: "10px",
          }}
        >
          <WrapperSubHeader>Chi tiết sản phẩm</WrapperSubHeader>
          {/* <Group
            title={"Mô tả sản phẩm"}
            onDataChange={setDataDescription}
            dataDetail={dataDescription}
          /> */}
          <CustomInput
            dataDetail={dataDescription}
            onDataChange={setDataDescription}
          />
        </div>

        <div
          style={{
            margin: "16px 20px",
            padding: "10px 16px",
            border: "1px solid",
            borderRadius: "10px",
          }}
        >
          <WrapperSubHeader>Thông tin bán hàng</WrapperSubHeader>
          <GroupVariation
            title={"Thông tín bán hàng"}
            saveButtonClicked={saveButtonClicked}
            setSaveButtonClicked={setSaveButtonClicked}
            onDefaultImageChange={handleDefaultImageChange}
            onCombinedDataChange={handleCombinedDataChange}
            dataDefaultImage={defaultImage}
            isEdit={isEdit}
            test={defaultImage}
            productItemsDetail={productDetail.productItems}
          />
        </div>
      </div>

      <Button
        style={{
          alignSelf: "flex-end", // Đặt nút ở phía bên phải
          margin: "0 20px 10px 0",
          backgroundColor: "red",
          color: "#fff",
          fontWeight: "bold",
          height: "56px",
        }}
        disabled={!saveButtonClicked}
        onClick={handleCreateProductClick}
      >
        <p>Tiến hành chỉnh sửa</p>
      </Button>
    </div>
  );
};

export default AdminProductEdit;
