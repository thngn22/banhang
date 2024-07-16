import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import saleSchema from "../../../validator/saleValidator";
import FormSaleCreate from "./formSaleCreate";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../../redux/slides/categorySlice";
import * as CategoryService from "../../../services/CategoryService";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { message } from "antd";
import createAxiosInstance from "../../../services/createAxiosInstance";
import apiSales from "../../../services/saleApis";
import { useNavigate } from "react-router-dom";
import { updateChoesedProductList } from "../../../redux/slides/saleSlice";

const CreateSalePage = () => {
  const {
    control,
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
    setValue: setValueCreate,
  } = useForm({
    resolver: zodResolver(saleSchema.createSchema),
  });

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.login.currentUser);
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const navigate = useNavigate();

  const { data: categoriesRes } = useQuery({
    queryKey: ["categoriesRes"],
    queryFn: CategoryService.getAllTreeCategory,
  });
  useEffect(() => {
    if (categoriesRes) {
      dispatch(getCategory(categoriesRes));
    }
  }, [categoriesRes]);

  const mutation = useMutationHook((data) => {
    const res = apiSales.createSaleAdmin(data, auth.accessToken, axiosJWT);
    return res;
  });

  const onSubmitCreate = (data) => {
    const { dateRange, ...rest } = data;
    const formData = {
      ...rest,
      startDate: dateRange[0] + " 00:00:00",
      endDate: dateRange[1] + " 00:00:00",
    };
    console.log(formData);

    mutation.mutate(formData, {
      onSuccess: () => {
        message.success("Thêm mới mã khuyến mãi thành công");
        dispatch(updateChoesedProductList(null));
        setTimeout(() => {
          navigate("/admin/sales");
        }, 500);
      },
      onError: (error) => {
        console.log(`Đã xảy ra lỗi: ${error.message}`);
        message.error("Thêm không thành công");
        setTimeout(() => {
          navigate("/admin/sales");
        }, 500);
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full m-8 p-6 bg-white rounded shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold">Tạo mã khuyến mãi</h2>
        </div>
        <form onSubmit={handleSubmitCreate(onSubmitCreate)}>
          <FormSaleCreate
            registerCreate={registerCreate}
            control={control}
            errors={errorsCreate}
            setValueCreate={setValueCreate}
            navigate={navigate}
          />
        </form>
      </div>
    </div>
  );
};

export default CreateSalePage;
