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
    const formData = {
      ...data,
    };
    handleChangeData("firstName", formData.firstName);
    handleChangeData("lastName", formData.lastName);
    handleChangeData("phoneNumber", formData.phoneNumber);

    handleUpdateProfile();
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
        {"<"} Comeback
      </button>
    </div>
  );
};

export default UpdateProfile;
