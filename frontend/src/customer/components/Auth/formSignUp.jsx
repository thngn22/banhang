import React from "react";

const FormSignUp = ({ registerSignUp, errors }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <h1 className="text-4xl font-bold tracking-wide mb-4">Sign up</h1>
      

      <div className="w-full flex justify-between gap-2">
        <div>
          <input
            type="text"
            placeholder="First name"
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
            placeholder="Last name"
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
          placeholder="User name"
          {...registerSignUp("userName")}
          className="w-full"
        />
        {errors.userName && (
          <span className="text-sm text-red-600 font-medium">
            {errors.userName.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <input
          type="text"
          placeholder="Phone number"
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
          placeholder="Password"
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
          placeholder="Confirm password"
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
        className="w-full p-2 mt-4 bg-black text-white rounded"
      >
        Sign Up
      </button>
    </div>
  );
};

export default FormSignUp;
