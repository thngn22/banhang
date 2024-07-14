import React from "react";

const FormCategoryUpdate = ({
  registerUpdate,
  errors,
  navigate,
  id,
  parentCategoryId,
}) => {
  const handleComeback = () => {
    navigate("/admin/categories");
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full">
        <input
          type="text"
          placeholder="ID Danh Mục"
          {...registerUpdate("id")}
          className="w-full p-3 mb-2 rounded border"
          defaultValue={id}
          disabled
        />
        {errors.id && (
          <span className="text-red-600 text-sm">{errors.id.message}</span>
        )}
      </div>

      <div className="w-full">
        <input
          type="text"
          placeholder="Tên Danh Mục"
          {...registerUpdate("name")}
          className="w-full p-3 mb-2 rounded border"
        />
        {errors.name && (
          <span className="text-red-600 text-sm">{errors.name.message}</span>
        )}
      </div>

      <div className="w-full">
        <input
          type="text"
          placeholder="Mã Danh Mục Cha"
          {...registerUpdate("parentCategoryId")}
          className="w-full p-3 mb-2 rounded border"
          defaultValue={parentCategoryId}
          disabled
        />
        {errors.parentCategoryId && (
          <span className="text-red-600 text-sm">
            {errors.parentCategoryId.message}
          </span>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="cursor-pointer" onClick={handleComeback}>
          {"<"} Quay lại
        </p>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:opacity-80"
        >
          Tiến hành cập nhật Danh Mục
        </button>
      </div>
    </div>
  );
};

export default FormCategoryUpdate;
