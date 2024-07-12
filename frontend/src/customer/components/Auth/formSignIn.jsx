import React from "react";
import { Link } from "react-router-dom";

const FormSignIn = ({ registerSignIn, errors }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <h1 className="text-4xl font-bold tracking-wide mb-4">Đăng nhập</h1>

      <div className="w-full">
        <input
          type="email"
          placeholder="Email"
          {...registerSignIn("email")}
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
          {...registerSignIn("password")}
          className="w-full"
        />
        {errors.password && (
          <span className="text-sm text-red-600 font-medium">
            {errors.password.message}
          </span>
        )}
      </div>

      <Link to={"/forgot"}>Quên mật khẩu?</Link>

      <button
        type="submit"
        className="w-full p-2 mt-4 bg-black text-white rounded hover:opacity-80"
      >
        Đăng nhập
      </button>
    </div>
  );
};

export default FormSignIn;
