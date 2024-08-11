import React, { useState } from "react";
import Group from "../../components/AdminProduct/Group";
import GroupVariation from "../../components/AdminProduct/GroupVariation";
import { Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as ProductService from "../../../services/ProductService";
import MultilevelDropdown from "../../components/MultilevelDropdown/MultilevelDropdown";
import CustomInput from "../../../Customer/components/CKEditor/customInput";
import createAxiosInstance from "../../../services/createAxiosInstance.js";
import { useNavigate } from "react-router-dom";

const CreateProductPage = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const navigate = useNavigate();

  const [dataNameProduct, setDataNameProduct] = useState("");
  const [dataCategory, setDataCategory] = useState("");
  const [dataDescription, setDataDescription] = useState("");
  const [saveButtonClicked, setSaveButtonClicked] = useState(false);
  const [defaultImage, setDefaultImage] = useState("");
  const [combinedData, setCombinedData] = useState([]);

  const handleDefaultImageChange = (imageData) => {
    setDefaultImage(imageData);
  };

  const handleCombinedDataChange = (data) => {
    setCombinedData(data);
  };

  const mutation = useMutationHook((data) => {
    const res = ProductService.createProduct2(data, auth.accessToken, axiosJWT);
    return res;
  });

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
        const productItems = combinedData.map((item) => ({
          warehousePrice: item?.warehousePrice,
          price: item.price,
          quantityInStock: item.quantity,
          size: item.size,
          color: item.color,
          productItemImage: item.productImage,
        }));

        const productCreateRequest = {
          name: dataNameProduct,
          description: dataDescription,
          categoryId: parseInt(dataCategory.id),
        };

        const formData = new FormData();
        formData.append("name", productCreateRequest.name);
        formData.append("description", productCreateRequest.description);
        formData.append("categoryId", productCreateRequest.categoryId);
        productItems.forEach((item, index) => {
          formData.append(
            `productItems[${index}].warehousePrice`,
            item.warehousePrice
          );
          formData.append(`productItems[${index}].price`, item.price);
          formData.append(
            `productItems[${index}].quantityInStock`,
            item.quantityInStock
          );
          formData.append(`productItems[${index}].size`, item.size);
          formData.append(`productItems[${index}].color`, item.color);
          formData.append(
            `productItems[${index}].productItemImage`,
            item.productItemImage
          );
        });

        // for (let [key, value] of formData.entries()) {
        //   console.log(key, value);
        // }

        // const formDataEntries = [];
        // for (let [key, value] of formData.entries()) {
        //   formDataEntries.push({ key, value });
        // }
        // console.table("tong", formDataEntries);

        mutation.mutate(formData, {
          onSuccess: () => {
            message.success("Thêm mới sản phẩm thành công");
            setTimeout(() => {
              navigate("/admin/products");
            }, 1000);
          },
          onError: (error) => {
            console.log(`Đã có lỗi ${error.message}`);
            message.error(`Thêm không thành công`);
            setTimeout(() => {
              navigate("/admin/products");
            }, 1000);
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
    <div className="p-6">
      <div className="bg-white rounded-xl flex flex-col">
        <p className="ml-6 mt-4 text-2xl font-semibold">Thêm sản phẩm</p>
        <div>
          <div
            style={{
              margin: "16px 20px",
              padding: "10px 16px",
              border: "1px solid",
              borderRadius: "10px",
            }}
          >
            <h1>Thông tin cơ bản</h1>
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
            <h1>Chi tiết sản phẩm</h1>
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
    </div>
  );
};

export default CreateProductPage;
