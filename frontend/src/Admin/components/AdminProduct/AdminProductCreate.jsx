import React, { useState } from "react";
import { WrapperHeader, WrapperSubHeader } from "./style";
import InputField from "../../../Customer/components/InputField";
import Group from "./Group";
import GroupVariation from "./GroupVariation";
import { Button, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as ProductService from "../../../services/ProductService";
import MultilevelDropdown from "../MultilevelDropdown/MultilevelDropdown";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as AuthService from "../../../services/AuthService";
import { loginSuccess } from "../../../redux/slides/authSlice";
import CustomInput from "../../../Customer/components/CKEditor/customInput";
import { contextType } from "react-quill";

const AdminProductCreate = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();

  const [dataNameProduct, setDataNameProduct] = useState("");
  const [dataCategory, setDataCategory] = useState("");
  const [dataDescription, setDataDescription] = useState("");
  const [saveButtonClicked, setSaveButtonClicked] = useState(false);
  const [defaultImage, setDefaultImage] = useState("");
  const [combinedData, setCombinedData] = useState([]);
  console.log("combinedData", combinedData);

  const [dataAPICreate, setDataAPICreate] = useState(null);

  const handleDefaultImageChange = (imageData) => {
    setDefaultImage(imageData);
  };

  const handleCombinedDataChange = (data) => {
    setCombinedData(data);
  };

  const refreshToken = async () => {
    try {
      const data = await AuthService.refreshToken();
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
    const res = ProductService.createProduct2(data, auth.accessToken, axiosJWT);
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
      if (specialCharacterRegex.test(dataNameProduct)) {
        message.error("Không được nhập các ký tự đặc biệt");
      } else {


        const productItems = combinedData.map((item) => ({
          warehousePrice: item?.warehousePrice,
          price: item.price,
          quantityInStock: item.quantity,
          size: item.size,
          color: item.color,
          productItemImage: item.productImage 
        }));

        const productCreateRequest = {
          name: dataNameProduct,
          description: dataDescription,
          categoryId: parseInt(dataCategory.id),
        };


        const formData = new FormData()
        formData.append('name', productCreateRequest.name)
        formData.append('description', productCreateRequest.description)
        formData.append('categoryId', productCreateRequest.categoryId)
        productItems.forEach((item, index) => {
          formData.append(`productItems[${index}].warehousePrice`, item.warehousePrice);
          formData.append(`productItems[${index}].price`, item.price);
          formData.append(`productItems[${index}].quantityInStock`, item.quantityInStock);
          formData.append(`productItems[${index}].size`, item.size);
          formData.append(`productItems[${index}].color`, item.color);
          formData.append(`productItems[${index}].productItemImage`, item.productItemImage);

        });


        mutation.mutate(formData, {
          onSuccess: () => {
            message.success("Thêm mới sản phẩm thành công");
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },
          onError: (error) => {
            message.error(`Đã xảy ra lỗi: ${error.message}`);
            setTimeout(() => {
              window.location.reload();
            }, 1000000);
          },
        });
      }
    } else {
      message.warning(
        "Hãy nhập đầy đủ thông tin địa chỉ trước khi Tạo sản phẩm"
      );
    }
  };

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
          <Group title={"Tên sản phẩm"} onDataChange={setDataNameProduct} />
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
          {/* <Group title={"Mô tả sản phẩm"} onDataChange={setDataDescription} /> */}
          <CustomInput onDataChange={setDataDescription} />
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
          />
        </div>
      </div>

      <Button
        style={{
          alignSelf: "flex-end",
          margin: "0 20px 10px 0",
          backgroundColor: "red",
          color: "#fff",
          fontWeight: "bold",
          height: "56px",
        }}
        disabled={!saveButtonClicked}
        onClick={handleCreateProductClick}
      >
        <p>Tiến hành tạo Sản phẩm</p>
      </Button>
    </div>
  );
};

export default AdminProductCreate;
