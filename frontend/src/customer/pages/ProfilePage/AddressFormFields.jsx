import React from "react";
import { Controller } from "react-hook-form";

const AddressFormFields = ({
  control,
  register,
  errors,
  provinces,
  districts,
  wards,
  handleProvinceChange,
  handleDistrictChange,
}) => {
  return (
    <div className="pl-8">
      <p className="text-2xl font-extrabold text-gray-800">Cập nhật Địa chỉ</p>
      <div className="pt-4 pr-14 flex flex-col gap-2">
        <div className="flex flex-col">
          <label htmlFor="city" className="text-gray-500 font-medium">
            Thành phố/Tỉnh:
          </label>
          <Controller
            control={control}
            name="city"
            render={({ field: { value, onChange } }) => (
              <select
                id="city"
                value={value}
                onChange={(event) => {
                  onChange(event);
                  handleProvinceChange(event);
                }}
                className="input p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-black"
              >
                {provinces.map((province) => (
                  <option
                    key={province.province_id}
                    value={province.province_name}
                  >
                    {province.province_name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.city && (
            <span className="text-sm text-red-600 font-medium">
              {errors.city.message}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="district" className="text-gray-500 font-medium">
            Quận/Huyện:
          </label>
          <Controller
            control={control}
            name="district"
            render={({ field: { value, onChange } }) => (
              <select
                id="district"
                value={value}
                onChange={(event) => {
                  onChange(event);
                  handleDistrictChange(event);
                }}
                className="input p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-black"
              >
                {districts.map((district) => (
                  <option
                    key={district.district_id}
                    value={district.district_name}
                  >
                    {district.district_name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.district && (
            <span className="text-sm text-red-600 font-medium">
              {errors.district.message}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="ward" className="text-gray-500 font-medium">
            Phường/Xã:
          </label>
          <Controller
            control={control}
            name="ward"
            render={({ field: { value, onChange } }) => (
              <select
                id="ward"
                value={value}
                onChange={onChange}
                className="input p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-black"
              >
                {wards.map((ward) => (
                  <option key={ward.ward_id} value={ward.ward_name}>
                    {ward.ward_name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.ward && (
            <span className="text-sm text-red-600 font-medium">
              {errors.ward.message}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="address" className="text-gray-500 font-medium">
            Địa chỉ chi tiết:
          </label>
          <input
            id="address"
            type="text"
            {...register("address")}
            className="input p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-black"
          />
          {errors.address && (
            <span className="text-sm text-red-600 font-medium">
              {errors.address.message}
            </span>
          )}
        </div>
        <div className="flex items-center">
          <label htmlFor="default" className="text-gray-500 font-medium mr-2">
            Đặt làm địa chỉ mặc định:
          </label>
          <input
            id="default"
            type="checkbox"
            {...register("default")}
            className="checkbox"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressFormFields;
