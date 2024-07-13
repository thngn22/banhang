import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormVoucherCreate from "./formVoucherCreate";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { message } from "antd";
import createAxiosInstance from "../../../services/createAxiosInstance";
import voucherApis from "../../../services/voucherApis";
import { useNavigate } from "react-router-dom";
import voucherSchema from "../../../validator/voucherValidator";

const CreateVoucherPage = () => {
  const {
    control,
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
    setValue: setValueCreate,
  } = useForm({
    resolver: zodResolver(voucherSchema),
  });

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.login.currentUser);
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const navigate = useNavigate();

  const mutation = useMutationHook((data) => {
    const res = voucherApis.createVoucherAdmin(
      data,
      auth.accessToken,
      axiosJWT
    );
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
        message.success("Thêm mới mã voucher thành công");
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
          <h2 className="text-3xl font-extrabold">Tạo Voucher</h2>
        </div>
        <form onSubmit={handleSubmitCreate(onSubmitCreate)}>
          <FormVoucherCreate
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

export default CreateVoucherPage;
