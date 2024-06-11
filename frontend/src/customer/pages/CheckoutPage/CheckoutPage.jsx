import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import checkOutSchema from "../../../validator/checkoutValidator";
import FormFields from "./formField";
import { useSelector } from "react-redux";

const CheckoutPage = () => {
  const user = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({ resolver: zodResolver(checkOutSchema) });

  const onSubmit = (data) => {
    const formData = {
      ...data,
    };
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <FormFields
        register={register}
        control={control}
        errors={errors}
        setValue={setValue}
        user={user}
      />
    </form>
  );
};

export default CheckoutPage;
