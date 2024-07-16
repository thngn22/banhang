import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import saleSchema from "../../../validator/saleValidator";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../../redux/slides/categorySlice";
import * as CategoryService from "../../../services/CategoryService";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { message } from "antd";
import createAxiosInstance from "../../../services/createAxiosInstance";
import apiSales from "../../../services/saleApis";
import { useNavigate, useParams } from "react-router-dom";
import {
  detailSaleUpdate,
  updateChoesedProductList,
} from "../../../redux/slides/saleSlice";
import FormSaleUpdate from "./formSaleUpdate";

const UpdateSalePage = () => {
  const {
    control,
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    formState: { errors: errorsUpdate },
    setValue: setValueUpdate,
  } = useForm({
    resolver: zodResolver(saleSchema.updateSchema),
  });

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.login.currentUser);
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const navigate = useNavigate();
  const { idSale } = useParams();

  const { data: detailSale } = useQuery({
    queryKey: [idSale, "detailSale"],
    queryFn: () => {
      return apiSales.getSaleDetailAdmin(idSale, auth.accessToken, axiosJWT);
    },
    enabled: Boolean(auth?.accessToken),
  });
  useEffect(() => {
    if (detailSale) dispatch(detailSaleUpdate(detailSale));
  }, [detailSale]);

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
    const res = apiSales.editSaleAdmin(data, auth.accessToken, axiosJWT);
    return res;
  });

  const onSubmitUpdate = (data) => {
    const { dateRange, ...rest } = data;
    const formData = {
      ...rest,
      id: idSale,
      startDate: dateRange[0],
      endDate: dateRange[1],
    };
    console.log(formData);

    mutation.mutate(formData, {
      onSuccess: () => {
        message.success("Chỉnh sửa mới mã khuyến mãi thành công");
        dispatch(updateChoesedProductList(null));
        setTimeout(() => {
          navigate("/admin/sales");
        }, 500);
      },
      onError: (error) => {
        console.log(`Đã xảy ra lỗi: ${error.message}`);
        message.error("Chỉnh sửa không thành công");
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
          <h2 className="text-3xl font-extrabold">Cập nhật mã khuyến mãi</h2>
        </div>
        {detailSale && (
          <form onSubmit={handleSubmitUpdate(onSubmitUpdate)}>
            <FormSaleUpdate
              defaultValues={{
                name: detailSale.name,
                description: detailSale.description,
                discountRate: detailSale.discountRate,
                dateRange: [detailSale.startDate, detailSale.endDate],
                idProductList: detailSale.productResponses.map(
                  (product) => product.id
                ),
              }}
              registerUpdate={registerUpdate}
              control={control}
              errors={errorsUpdate}
              setValueUpdate={setValueUpdate}
              navigate={navigate}
              idSale={idSale}
              data={detailSale}
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateSalePage;
