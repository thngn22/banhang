import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import voucherSchema from "../../../validator/voucherValidator";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { message } from "antd";
import createAxiosInstance from "../../../services/createAxiosInstance";
import apiSales from "../../../services/saleApis";
import { useNavigate, useParams } from "react-router-dom";
import FormVoucherUpdate from "./formVoucherUpdate";
import apiVouchers from "../../../services/voucherApis";
import dayjs from "dayjs";

const UpdateVoucherPage = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(voucherSchema),
  });

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.login.currentUser);
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const navigate = useNavigate();
  const { idVoucher } = useParams();

  const { data: detail } = useQuery({
    queryKey: [idVoucher, "detail"],
    queryFn: () => {
      return apiVouchers.getDetailVouchers(idVoucher, axiosJWT);
    },
  });

  const mutation = useMutationHook((data) => {
    const res = apiVouchers.editVoucherAdmin(data, auth.accessToken, axiosJWT);
    return res;
  });

  const onSubmitUpdate = (data) => {
    const { dateRange, ...rest } = data;
    const formData = {
      ...rest,
      id: idVoucher,
      startDate: dateRange[0],
      endDate: dateRange[1],
    };

    mutation.mutate(formData, {
      onSuccess: () => {
        message.success("Cập nhật voucher thành công");
        setTimeout(() => {
          navigate("/admin/vouchers");
        }, 500);
      },
      onError: (error) => {
        message.error(`Đã xảy ra lỗi: ${error.message}`);
        setTimeout(() => {
          navigate("/admin/vouchers");
        }, 500);
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full m-8 p-6 bg-white rounded shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold">Cập nhật mã voucher</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmitUpdate)}>
          <FormVoucherUpdate
            registerUpdate={register}
            control={control}
            errors={errors}
            setValueUpdate={setValue}
            navigate={navigate}
            detailVoucher={detail}
          />
        </form>
      </div>
    </div>
  );
};

export default UpdateVoucherPage;
