import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import profileSchema from "../../../validator/profileValidator";
import FormFields from "./formField";

const UpdateProfile = ({
  userIn4,
  handleChangeData,
  handleUpdateProfile,
  handleSelected,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({ resolver: zodResolver(profileSchema) });

  const onSubmit = (data) => {
    // Cập nhật thông tin từ form
    handleChangeData("firstName", data.firstName);
    handleChangeData("lastName", data.lastName);
    handleChangeData("phone", data.phoneNumber);

    // Gọi hàm để cập nhật thông tin người dùng
    handleUpdateProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phoneNumber,
    });
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <FormFields
          register={register}
          control={control}
          errors={errors}
          setValue={setValue}
          user={userIn4}
        />
      </form>
      <button
        className="absolute bottom-2.5 left-9"
        onClick={() => handleSelected("")}
      >
        {"<"} Quay trở lại
      </button>
    </div>
  );
};

export default UpdateProfile;
