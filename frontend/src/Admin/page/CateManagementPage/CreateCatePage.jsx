import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { message } from "antd";
import createAxiosInstance from "../../../services/createAxiosInstance";
import { useNavigate } from "react-router-dom";
import categorySchema from "../../../validator/categoryValidator";
import FormCategoryCreate from "./FormCategoryCreate";
import * as CategoryServices from "../../../services/CategoryService";
import { useQuery } from "@tanstack/react-query";
import { updateCategory } from "../../../redux/slides/categorySlice";

const CreateCatePage = () => {
  const {
    control,
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
    setValue: setValueCreate,
  } = useForm({
    resolver: zodResolver(categorySchema.createSchema),
  });

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.login.currentUser);
  const fatherCategories = useSelector(
    (state) => state.category.multilevelCate.currentCate
  );
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const navigate = useNavigate();

  const mutationCreate = useMutationHook((data) => {
    const res = CategoryServices.createCate(data, auth.accessToken, axiosJWT);
    return res;
  });

  const { data: listCategories, refetch } = useQuery({
    queryKey: ["listCategories"],
    queryFn: () => {
      return CategoryServices.getAllTreeCategory();
    },
  });
  useEffect(() => {
    if (listCategories) {
      dispatch(updateCategory(listCategories));
    }
  }, [listCategories]);

  const onSubmitCreate = (data) => {
    const formData = { ...data };
    if (formData.parentCategoryId === "") {
      delete formData.parentCategoryId;
    }
    console.log(formData);
    mutationCreate.mutate(formData, {
      onSuccess: () => {
        message.success("Thêm mới danh mục thành công");
        refetch({ queryKey: ["listCategories"] });
        setTimeout(() => {
          navigate("/admin/categories");
        }, 500);
      },
      onError: (error) => {
        console.log(`Đã xảy ra lỗi: ${error.message}`);
        message.error("Thêm mới không thành công");
        refetch({ queryKey: ["listCategories"] });
        setTimeout(() => {
          navigate("/admin/categories");
        }, 500);
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full m-8 p-6 bg-white rounded shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold">Tạo Danh Mục</h2>
        </div>
        <form onSubmit={handleSubmitCreate(onSubmitCreate)}>
          <FormCategoryCreate
            registerCreate={registerCreate}
            control={control}
            errors={errorsCreate}
            setValueCreate={setValueCreate}
            navigate={navigate}
            fatherCategories={fatherCategories}
          />
        </form>
      </div>
    </div>
  );
};

export default CreateCatePage;
