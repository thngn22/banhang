import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import checkOutSchema from "../../../validator/checkoutValidator";
import FormFields from "./formField";
import { useDispatch, useSelector } from "react-redux";
import createAxiosInstance from "../../../services/createAxiosInstance";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as CartService from "../../../services/CartService";
import { message } from "antd";

const CheckoutPage = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (user) {
      setCartItems(user.cart.cartItems.map((item) => item.id));
    }
  }, [user]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({ resolver: zodResolver(checkOutSchema) });

  const mutationCheckout = useMutationHook((data) => {
    return CartService.checkOutCarts(data, auth?.accessToken, axiosJWT);
  });
  const { data, isSuccess } = mutationCheckout;
  useEffect(() => {
    if (isSuccess && data) {
      window.location.href = data;
    }
  }, [data, isSuccess]);

  const onSubmit = (data) => {
    const formData = {
      ...data,
      userAddressRequestv2: {
        city: data.city,
        district: data.district,
        ward: data.ward,
        address: data.address,
      },
      cartItemId: cartItems,
    };
    delete formData.voucher;
    delete formData.city;
    delete formData.district;
    delete formData.ward;
    delete formData.address;
    console.log(formData);

    mutationCheckout.mutate(formData, {
      onError: (error) => {
        console.log(`Đã xảy ra lỗi ${error.message}`);
        message.error("Không thành công");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <FormFields
        register={register}
        control={control}
        errors={errors}
        setValue={setValue}
        user={user}
        getValues={getValues}
      />
    </form>
  );
};

export default CheckoutPage;
