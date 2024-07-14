import React from "react";
import { Select } from "antd";

const FormCategoryCreate = ({
  registerCreate,
  control,
  errors,
  setValueCreate,
  navigate,
  fatherCategories,
}) => {
  const handleComeback = () => {
    navigate("/admin/categories");
  };

  const handleCategoryChange = (value) => {
    if (value === "new") {
      setValueCreate("parentCategoryId", "");
    } else {
      setValueCreate("parentCategoryId", value);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full">
        <input
          type="text"
          placeholder="Tên Danh Mục"
          {...registerCreate("name")}
          className="w-full p-3 mb-2 rounded border"
        />
        {errors.name && (
          <span className="text-red-600 text-sm">{errors.name.message}</span>
        )}
      </div>

      <div>
        <div className="w-full">
          <Select
            placeholder="Chọn Danh Mục Cha"
            className="mb-2 w-60"
            onChange={handleCategoryChange}
          >
            <Select.Option key="new" value="new">
              Tạo Mới Danh Mục Cha
            </Select.Option>
            {fatherCategories &&
              fatherCategories.map((category) => (
                <Select.Option key={category.id} value={category.id.toString()}>
                  {category.name}
                </Select.Option>
              ))}
          </Select>

          <span className="text-xs ml-4">
            Nếu muốn tạo mới danh mục Cha thì chọn "Tạo mới danh mục cha"
          </span>
        </div>

        <div className="w-full">
          <input
            type="text"
            placeholder="Mã Danh Mục Cha"
            {...registerCreate("parentCategoryId")}
            className="w-full p-3 mb-2 rounded border"
            disabled
          />
          {errors.parentCategoryId && (
            <span className="text-red-600 text-sm">
              {errors.parentCategoryId.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="cursor-pointer" onClick={handleComeback}>
          {"<"} Quay lại
        </p>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:opacity-80"
        >
          Tiến hành tạo Danh Mục
        </button>
      </div>
    </div>
  );
};

export default FormCategoryCreate;
