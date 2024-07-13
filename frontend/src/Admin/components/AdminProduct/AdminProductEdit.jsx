import React, { useEffect, useState } from "react";
import { WrapperHeader, WrapperSubHeader } from "./style";
import InputField from "../../../Customer/components/InputField";
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
import CustomInput from "../../../Customer/components/CKEditor/customInput";
import createAxiosInstance from "../../../services/createAxiosInstance";
import { useNavigate } from "react-router-dom";

const AdminProductEdit = (props) => {
  const dispatch = useDispatch();

  let productDetail = useSelector(
    (state) => state.product.productDetail.currentProduct
  );
  let cateInEdit = useSelector(
    (state) => state.category.multilevelCate.currentCate
  );
  const auth = useSelector((state) => state.auth.login.currentUser);
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const navigate = useNavigate();

  const [dataNameProduct, setDataNameProduct] = useState("");
  const [dataCategory, setDataCategory] = useState("");
  const [dataDescription, setDataDescription] = useState("");
  const [saveButtonClicked, setSaveButtonClicked] = useState(false);
  const [defaultImage, setDefaultImage] = useState("");
  const [combinedData, setCombinedData] = useState([]);
  const [isEdit, setIsEdit] = useState(true);

  // console.log("defaultImage", defaultImage);

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
  console.log("combinedData in admin create", combinedData);

  const mutation = useMutationHook((data) => {
    const res = ProductService.editProduct(data, auth.accessToken, axiosJWT);
    return res;
  });
  const { data, status, isSuccess, isError } = mutation;

  const handleCreateProductClick = () => {
    if (
      dataNameProduct !== "" &&
      dataDescription !== "" &&
      // defaultImage !== "" &&
      parseInt(dataCategory.id) !== null
    ) {
      const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (specialCharacterRegex.test(dataNameProduct)) {
        message.error("Không được nhập các ký tự đặc biệt");
      } else {
        const productCreateRequest = {
          id: productDetail?.id,
          active: productDetail?.active,
          name: dataNameProduct,
          description: dataDescription,
          // productImage: defaultImage,
          categoryId: parseInt(dataCategory?.id),
        };
        console.log("combinedData", combinedData);
        const productItems = combinedData?.map((item) => ({
          id: item?.id,
          warehousePrice: item?.warehousePrice,
          price: item?.price,
          numberQuantity: item?.numberQuantity,
          quantityInStock: item?.quantity,
          productImage: item?.productImage,
          active: item?.active,
          size: item?.size,
          color: item?.color,
        }));

        const formData = new FormData();
        formData.append("id", productCreateRequest.id);
        formData.append("active", productCreateRequest.active);
        formData.append("name", productCreateRequest.name);
        formData.append("description", productCreateRequest.description);
        formData.append("categoryId", productCreateRequest.categoryId);
        productItems.forEach((item, index) => {
          formData.append(`productItems[${index}].id`, item.id);
          formData.append(
            `productItems[${index}].warehousePrice`,
            item.warehousePrice
          );
          formData.append(`productItems[${index}].price`, item.price);
          formData.append(
            `productItems[${index}].quantityInStock`,
            item.quantityInStock
          );
          formData.append(
            `productItems[${index}].numberQuantity`,
            item.numberQuantity
          );
          formData.append(`productItems[${index}].size`, item.size);
          formData.append(`productItems[${index}].color`, item.color);
          if (item.productImage instanceof File) {
            formData.append(
              `productItems[${index}].productImage`,
              item.productImage
            );
          }
          formData.append(`productItems[${index}].active`, item.active);
        });

        // for (let [key, value] of formData.entries()) {
        //     console.log(key, value);
        //   }

        const formDataEntries = [];
        for (let [key, value] of formData.entries()) {
          formDataEntries.push({ key, value });
        }
        console.table("tong", formDataEntries);

        mutation.mutate(formData, {
          onSuccess: () => {
            message.success("Chỉnh sửa sản phẩm thành công");
            props.setIsModalOpen(false);

            setTimeout(() => {
              navigate("/admin/products");
            }, 1000);
          },
          onError: (error) => {
            console.log(`Đã xảy ra lỗi: ${error.message}`);
            message.error("Chỉnh sửa không thành công");
            props.setIsModalOpen(false);

            setTimeout(() => {
              navigate("/admin/products");
            }, 1000);
          },
        });
      }
    } else {
      message.warning(
        "Hãy nhập đầy đủ thông tin địa chỉ trước khi Chỉnh sửa sản phẩm"
      );
    }
  };

  const handleMenuItemClick = (id, name) => {
    setDataCategory({ id, name });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <WrapperHeader style={{ paddingLeft: "20px" }}>
        Chỉnh sửa Sản phẩm
      </WrapperHeader>
      <div>
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
