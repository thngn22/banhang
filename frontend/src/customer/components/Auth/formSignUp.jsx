import React from "react";

const FormSignUp = ({ registerSignUp, errors }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <h1 className="text-4xl font-bold tracking-wide mb-4">Đăng ký</h1>

      <div className="w-full flex justify-between gap-2">
        <div>
          <input
            type="text"
            placeholder="Họ"
            {...registerSignUp("firstName")}
          />
          {errors.firstName && (
            <span className="text-sm text-red-600 font-medium">
              {errors.firstName.message}
            </span>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Tên"
            {...registerSignUp("lastName")}
          />
          {errors.lastName && (
            <span className="text-sm text-red-600 font-medium">
              {errors.lastName.message}
            </span>
          )}
        </div>
      </div>

      <div className="w-full">
        <input
          type="text"
          placeholder="Số điện thoại"
          {...registerSignUp("phoneNumber")}
          className="w-full"
        />
        {errors.phoneNumber && (
          <span className="text-sm text-red-600 font-medium">
            {errors.phoneNumber.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <input
          type="email"
          placeholder="Email"
          {...registerSignUp("email")}
          className="w-full"
        />
        {errors.email && (
          <span className="text-sm text-red-600 font-medium">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <input
          type="password"
          placeholder="Mật khẩu"
          {...registerSignUp("password")}
          className="w-full"
        />
        {errors.password && (
          <span className="text-sm text-red-600 font-medium">
            {errors.password.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          {...registerSignUp("confirmPassword")}
          className="w-full"
        />
        {errors.confirmPassword && (
          <span className="text-sm text-red-600 font-medium">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="w-full p-2 mt-4 bg-black text-white rounded hover:opacity-80"
      >
        Đăng ký
      </button>
    </div>
  );
};

export default FormSignUp;
