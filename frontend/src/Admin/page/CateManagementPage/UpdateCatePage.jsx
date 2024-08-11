import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import categorySchema from "../../../validator/categoryValidator";
import FormCategoryUpdate from "./FormCategoryUpdate";
import * as CategoryServices from "../../../services/CategoryService";
import createAxiosInstance from "../../../services/createAxiosInstance";
import { useQuery } from "@tanstack/react-query";
import { updateCategory } from "../../../redux/slides/categorySlice";

const UpdateCatePage = () => {
  const { idCate } = useParams();
  const {
    control,
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    formState: { errors: errorsUpdate },
    setValue: setValueUpdate,
    reset,
    getValues,
  } = useForm({
    resolver: zodResolver(categorySchema.updateSchema),
  });

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.login.currentUser);
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const fatherCategories = useSelector(
    (state) => state.category.multilevelCate.currentCate
  );
  const navigate = useNavigate();

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

  const mutationUpdate = useMutationHook((data) => {
    return CategoryServices.updateCate(data, auth.accessToken, axiosJWT);
  });

  useEffect(() => {
    const currentCategory = fatherCategories.find(
      (category) => category.id.toString() === idCate
    );

    if (currentCategory) {
      reset({
        id: currentCategory.id.toString(),
        name: currentCategory.name,
        parentCategoryId: currentCategory.parentCategoryId || "",
      });
    } else {
      // Sử dụng flatMap để tìm danh mục con
      const childCategory = fatherCategories
        .flatMap((item) =>
          item.categories.filter((child) => child.id.toString() === idCate)
        )
        .find(Boolean); // Tìm danh mục con đầu tiên

      if (childCategory) {
        reset({
          id: childCategory.id.toString(),
          name: childCategory.name,
          parentCategoryId: childCategory.parentCategoryId.toString(),
        });
      }
    }
  }, [idCate, fatherCategories, reset]);

  const onSubmitUpdate = (data) => {
    console.log(data);
    mutationUpdate.mutate(data, {
      onSuccess: () => {
        message.success("Cập nhật danh mục thành công");
        refetch({ queryKey: ["listCategories"] });
        setTimeout(() => {
          navigate("/admin/categories");
        }, 500);
      },
      onError: (error) => {
        console.log(`Đã xảy ra lỗi: ${error.message}`);
        message.error("Cập nhật không thành công");
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
          <h2 className="text-3xl font-extrabold">Cập Nhật Danh Mục</h2>
        </div>
        <form onSubmit={handleSubmitUpdate(onSubmitUpdate)}>
          <FormCategoryUpdate
            registerUpdate={registerUpdate}
            control={control}
            errors={errorsUpdate}
            setValueUpdate={setValueUpdate}
            navigate={navigate}
            fatherCategories={fatherCategories}
            id={idCate}
          />
        </form>
      </div>
    </div>
  );
};

export default UpdateCatePage;
