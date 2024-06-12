import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import addressApi from "../../../services/ProvinceService";
import { useNavigate } from "react-router-dom";
import CartItemCheckOut from "./CartItemCheckOut";
import { Radio } from "antd";
import imgTrunk from "../../../Data/image/img-trunk.png";
import imgReload from "../../../Data/image/img-reload.png";

const FormFields = ({ register, control, errors, setValue, user }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await addressApi.getProvinces();
        if (data && data.length > 0) {
          setProvinces(data);
          setValue("province", data[0].province_name);
          fetchDistricts(data[0].province_id);
        }
      } catch (error) {
        console.error("Error fetching provinces", error);
      }
    };

    fetchProvinces();
  }, [setValue]);

  const fetchDistricts = async (provinceId) => {
    try {
      const data = await addressApi.getDistricts(provinceId);
      if (data && data.length > 0) {
        setDistricts(data);
        setValue("district", data[0].district_name);
        fetchWards(data[0].district_id);
      }
    } catch (error) {
      console.error("Error fetching districts", error);
    }
  };

  const fetchWards = async (districtId) => {
    try {
      const data = await addressApi.getWards(districtId);
      if (data && data.length > 0) {
        setWards(data);
        setValue("ward", data[0].ward_name);
      }
    } catch (error) {
      console.error("Error fetching wards", error);
    }
  };

  const handleProvinceChange = (event) => {
    const selectedProvince = event.target.value;
    setValue("province", selectedProvince);
    const selectedProvinceId = provinces.find(
      (province) => province.province_name === selectedProvince
    )?.province_id;
    if (selectedProvinceId) {
      fetchDistricts(selectedProvinceId);
    }
  };

  const handleDistrictChange = (event) => {
    const selectedDistrict = event.target.value;
    setValue("district", selectedDistrict);
    const selectedDistrictId = districts.find(
      (district) => district.district_name === selectedDistrict
    )?.district_id;
    if (selectedDistrictId) {
      fetchWards(selectedDistrictId);
    }
  };

  const handleComebackCart = () => {
    navigate("/carts");
  };

  return (
    <div className="grid grid-cols-5 relative" style={{ height: "100dvh" }}>
      <div className="col-span-3 border-r-2 pl-52 pt-14">
        <p className="ml-1 text-5xl font-extrabold text-gray-800">SHOES.CO</p>
        <div className="pt-4 pr-14 flex flex-col gap-2">
          <p className="text-lg font-medium">Order Information</p>
          <input
            type="text"
            className="input p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-black"
            placeholder="Full Name"
            {...register("name")}
          />
          {errors.name && (
            <span className="text-sm text-red-600 font-medium">
              {errors.name.message}
            </span>
          )}
          <input
            type="text"
            className="input p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-black"
            placeholder="Phone Number"
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <span className="text-sm text-red-600 font-medium">
              {errors.phoneNumber.message}
            </span>
          )}
          <div className="flex gap-2">
            <Controller
              control={control}
              name="province"
              render={({ field: { value, onChange } }) => (
                <select
                  id="province"
                  value={value}
                  className="border-2 p-3 rounded-lg border-gray-300 focus:outline-none focus:border-black"
                  onChange={(e) => {
                    onChange(e);
                    handleProvinceChange(e);
                  }}
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
            {errors.province && (
              <span className="text-sm text-red-600 font-medium">
                {errors.province.message}
              </span>
            )}
            <Controller
              control={control}
              name="district"
              render={({ field: { value, onChange } }) => (
                <select
                  id="district"
                  value={value}
                  className="border-2 p-3 rounded-lg border-gray-300 focus:outline-none focus:border-black"
                  onChange={(e) => {
                    onChange(e);
                    handleDistrictChange(e);
                  }}
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
            <Controller
              control={control}
              name="ward"
              render={({ field: { value, onChange } }) => (
                <select
                  id="ward"
                  value={value}
                  className="border-2 p-3 rounded-lg border-gray-300 focus:outline-none focus:border-black"
                  onChange={onChange}
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
          <input
            type="text"
            className="input p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-black"
            placeholder="Address"
            {...register("address")}
          />
          {errors.address && (
            <span className="text-sm text-red-600 font-medium">
              {errors.address.message}
            </span>
          )}
          <div className="flex justify-between items-center mt-6">
            <p onClick={handleComebackCart} className="cursor-pointer">
              {"<"} Comeback Cart
            </p>
            <button
              className="bg-black text-white text-lg font-medium px-10 py-2 rounded-lg hover:opacity-80"
              type="submit"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
      <div className="col-span-2 bg-gray-100 pr-52 pt-14 pl-10">
        {user?.cart.cartItems.map((item, index) => (
          <CartItemCheckOut key={index} product={item} />
        ))}
        <hr className="border-1 border-gray-300 my-4" />
        <div className="flex justify-between gap-2">
          <input
            type="text"
            className="input flex-1 p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-black"
            placeholder="Type Voucher"
            {...register("voucher")}
          />
          {errors.voucher && (
            <span className="text-sm text-red-600 font-medium">
              {errors.voucher.message}
            </span>
          )}
          <button className="bg-red-600 text-white text-base font-medium px-8 py-3 rounded-lg hover:opacity-80">
            Use
          </button>
        </div>
        <hr className="border-1 border-gray-300 my-4" />
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Shipping method</label>
            <Controller
              control={control}
              name="delivery"
              defaultValue={1}
              render={({ field: { value, onChange } }) => (
                <Radio.Group
                  onChange={(e) => onChange(parseInt(e.target.value))}
                  value={value}
                  className="flex flex-col"
                >
                  <Radio value={1}>Shoes.co's Staff</Radio>
                  <Radio value={2}>Grab</Radio>
                </Radio.Group>
              )}
            />
            {errors.delivery && (
              <span className="text-sm text-red-600 font-medium">
                {errors.delivery.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Payment method</label>
            <Controller
              control={control}
              name="paymentMethod"
              defaultValue={1}
              render={({ field: { value, onChange } }) => (
                <Radio.Group
                  onChange={(e) => onChange(parseInt(e.target.value))}
                  value={value}
                  className="flex flex-col"
                >
                  <Radio value={1}>COD</Radio>
                  <Radio value={2}>VNPay</Radio>
                </Radio.Group>
              )}
            />
            {errors.paymentMethod && (
              <span className="text-sm text-red-600 font-medium">
                {errors.paymentMethod.message}
              </span>
            )}
          </div>
        </div>

        <hr className="border-1 border-gray-300 my-4" />
        <div className="flex justify-between items-center">
          <p className="font-light text-xl text-gray-600">Total:</p>
          <p className="text-xl font-bold text-red-600">
            {user?.cart.totalPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>
        </div>

        <div className="flex gap-2 mt-8 mb-4">
          <img className="w-[4rem] h-[4rem]" src={imgTrunk} alt="imgTrunk" />
          <div className="text-sm">
            <p className="font-medium">
              More than 800,000 orders have been successfully delivered to
              customers by Biti's.
            </p>
            <p>
              Shoes.co always makes sure customers are satisfied when receiving
              products. You just need to order delivery and let the Shoes.co
              team take care of it.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <img className="w-[4rem] h-[4rem]" src={imgReload} alt="imgTrunk" />
          <div className="text-sm">
            <p className="font-medium">
              Order online with peace of mind with a return policy
            </p>
            <p>
              Biti's warranty is 3-6 months depending on each product line,
              return policy within 7 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormFields;
