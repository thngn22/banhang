import React from "react";

const FormFields = ({ register, errors, user }) => {
  return (
    <div className="pl-8">
      <p className="text-2xl font-extrabold text-gray-800">
        Update Information
      </p>
      <div className="pt-4 pr-14 flex flex-col gap-2">
        <div className="flex flex-col">
          <label htmlFor="firstName" className="text-gray-500 font-medium">
            First name:
          </label>
          <input
            type="text"
            className="input p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-black"
            placeholder="First name"
            defaultValue={user.firstName}
            {...register("firstName")}
          />
          {errors.firstName && (
            <span className="text-sm text-red-600 font-medium">
              {errors.firstName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="lastName" className="text-gray-500 font-medium">
            Last name:
          </label>
          <input
            type="text"
            className="input p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-black"
            placeholder="Last name"
            defaultValue={user.lastName}
            {...register("lastName")}
          />
          {errors.lastName && (
            <span className="text-sm text-red-600 font-medium">
              {errors.lastName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="phoneNumber" className="text-gray-500 font-medium">
            Phone number:
          </label>
          <input
            type="text"
            className="input p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-black"
            placeholder="Phone number"
            defaultValue={user.phone}
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <span className="text-sm text-red-600 font-medium">
              {errors.phoneNumber.message}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="Email" className="text-gray-500 font-medium">
            Email:
          </label>
          <input
            type="text"
            className="input p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-black"
            defaultValue={user.email}
            disabled={true}
            {...register("email")}
          />
        </div>

        <div className="flex justify-end items-center mt-6">
          <button
            className="bg-black text-white text-lg font-medium px-10 py-2 rounded-lg hover:opacity-80"
            type="submit"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormFields;
