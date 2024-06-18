import React from "react";

const Default = ({ userIn4, handleSelected }) => {
  return (
    <div className="grid grid-cols-3 mb-10">
      <div className="col-span-2 pl-8 flex">
        <div className="flex flex-col w-full">
          <p className="text-2xl font-extrabold mb-4">Information User</p>

          <div className="flex flex-col gap-2">
            <div className="flex">
              <p className="w-32 text-gray-500 font-semibold">First Name:</p>
              <p>{userIn4?.firstName}</p>
            </div>

            <div className="flex">
              <p className="w-32 text-gray-500 font-semibold">Last Name:</p>
              <p>{userIn4?.lastName}</p>
            </div>

            <div className="flex">
              <p className="w-32 text-gray-500 font-semibold">Email:</p>
              <p>{userIn4?.email}</p>
            </div>

            <div className="flex">
              <p className="w-32 text-gray-500 font-semibold">Phone number:</p>
              <p>{userIn4?.phone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-1 flex flex-col gap-4 pl-8 mt-12">
        <button
          className="px-4 py-4 bg-red-400 text-lg hover:opacity-80 rounded-xl font-medium"
          onClick={() => handleSelected("updateUser")}
        >
          Test
        </button>
      </div>
    </div>
  );
};

export default Default;
