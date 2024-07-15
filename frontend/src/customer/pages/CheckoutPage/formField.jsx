import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import addressApi from "../../../services/ProvinceService";
import { useNavigate } from "react-router-dom";
import CartItemCheckOut from "./CartItemCheckOut";
import { message, Radio } from "antd";
import imgTrunk from "../../../Data/image/img-trunk.png";
import * as CartService from "../../../services/CartService";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { useDispatch, useSelector } from "react-redux";
import createAxiosInstance from "../../../services/createAxiosInstance";
import algorithsm from "../../../utils/algorithsm";
import { useQuery } from "@tanstack/react-query";
import apiVouchers from "../../../services/voucherApis";
import { updateCart } from "../../../redux/slides/userSlide";

const FormFields = ({
  register,
  control,
  errors,
  setValue,
  user,
  getValues,
}) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const [ship, setShip] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const { data: cart, refetch: refetchCart } = useQuery({
    queryKey: ["cart"],
    queryFn: () => {
      return CartService.getCartItems(auth.accessToken, axiosJWT);
    },
  });
  useEffect(() => {
    if (cart) {
      dispatch(updateCart(cart));
    }
  }, [cart]);

  const mutationDistance = useMutationHook((data) => {
    return CartService.getDistance(data, auth?.accessToken, axiosJWT);
  });
  const { data } = mutationDistance;

  const { data: vouchers, refetch: refetchVouchers } = useQuery({
    queryKey: ["vouchers"],
    queryFn: () => {
      return apiVouchers.getUserVouchers(axiosJWT);
    },
    enabled: Boolean(auth?.accessToken),
  });

  const mutationUseVoucher = useMutationHook((data) => {
    return apiVouchers.useVoucher(data, auth?.accessToken, axiosJWT);
  });
  const mutationRevokeVoucher = useMutationHook((cartId) => {
    return apiVouchers.revokeVoucher(
      { cartId: cartId },
      auth?.accessToken,
      axiosJWT
    );
  });

  useEffect(() => {
    setShip(data);
  }, [data]);

  const handleContinue = async () => {
    const formData = getValues();
    const addressData = {
      city: algorithsm.removeVietnameseTones(formData.city),
      district: algorithsm.removeVietnameseTones(formData.district),
      ward: algorithsm.removeVietnameseTones(formData.ward),
      address: algorithsm.removeVietnameseTones(formData.address),
    };

    if (addressData.address === "") {
      message.error("Không được để trống thông tin");
    } else {
      try {
        const deliveryMethods = await mutationDistance.mutateAsync(addressData); // Gọi API để lấy phương thức vận chuyển
        setShip(deliveryMethods); // Cập nhật ship với dữ liệu trả về
      } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
      }
    }
  };

  useEffect(() => {
    if (selectedAddress === null) {
      const fetchProvinces = async () => {
        try {
          const data = await addressApi.getProvinces();
          if (data && data.length > 0) {
            setProvinces(data);
            setValue("city", data[0].province_name);
            fetchDistricts(data[0].province_id);
          }
        } catch (error) {
          console.error("Lỗi khi fetch citys", error);
        }
      };

      fetchProvinces();
    }
  }, [setValue, selectedAddress]);

  const fetchDistricts = async (provinceId) => {
    try {
      const data = await addressApi.getDistricts(provinceId);
      if (data && data.length > 0) {
        setDistricts(data);
        setValue("district", data[0].district_name);
        fetchWards(data[0].district_id);
      }
    } catch (error) {
      console.error("Lỗi khi fetch districts", error);
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
      console.error("Lỗi khi fetch wards", error);
    }
  };

  const handleProvinceChange = (event) => {
    const selectedProvince = event.target.value;
    setValue("city", selectedProvince);
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

  const handleAddressClick = (address) => {
    if (
      selectedAddress &&
      selectedAddress.addressInfor.id === address.addressInfor.id
    ) {
      // Nếu nhấn vào địa chỉ đã chọn thì bỏ chọn
      setSelectedAddress(null);
      setValue("city", "");
      setValue("district", "");
      setValue("ward", "");
      setValue("address", "");
    } else {
      // Nếu chọn địa chỉ mới
      setSelectedAddress(address);
      setValue("city", address.addressInfor.city);
      setValue("district", address.addressInfor.district);
      setValue("ward", address.addressInfor.ward);
      setValue("address", address.addressInfor.address);
    }
  };

  useEffect(() => {
    setValue("voucher", "");
  }, []);

  const handleVoucherClick = async (voucher) => {
    try {
      if (selectedVoucher?.id === voucher.id) {
        // Nếu voucher đã chọn thì bỏ chọn
        await mutationRevokeVoucher.mutateAsync(user.cart.id); // Gọi API revoke voucher
        // dispatch(updateCart(updateCart));
        refetchCart({ queryKey: ["cart"] });
        setSelectedVoucher(null);
        setValue("voucher", ""); // Reset giá trị voucher
      } else {
        // Nếu chọn voucher mới
        const data = {
          voucherCode: voucher.voucherCode, // Hoặc voucher.id tùy theo cấu trúc của API
          cartId: user.cart.id,
        };
        await mutationUseVoucher.mutateAsync(data); // Gọi API use voucher
        // dispatch(updateCart(updatedCart)); // Cập nhật cart cho Redux
        refetchCart({ queryKey: ["cart"] });
        setSelectedVoucher(voucher);
        setValue("voucher", voucher.voucherCode); // Cập nhật giá trị voucher
      }
    } catch (error) {
      console.error("Lỗi khi sử dụng hoặc thu hồi voucher:", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại!");
      refetchCart({ queryKey: ["cart"] });
      refetchVouchers({ queryKey: ["vouchers"] });
    }
  };

  const handleComebackCart = async () => {
    try {
      // Nếu voucher đã chọn thì bỏ chọn
      await mutationRevokeVoucher.mutateAsync(user.cart.id); // Gọi API revoke voucher
      navigate("/carts");
    } catch (error) {
      navigate("/carts");
      console.error("Lỗi khi sử dụng hoặc thu hồi voucher:", error);
    }
  };

  return (
    <div className="grid grid-cols-5 relative" style={{ height: "100dvh" }}>
      <div className="col-span-3 border-r-2 pl-52 pt-14">
        <p className="ml-1 text-5xl font-extrabold text-gray-800">SHOES.CO</p>
        <div className="pt-4 pr-14 flex flex-col gap-2">
          <p className="text-lg font-medium">Thông tin đơn hàng</p>

          {/* Render address list */}
          <div
            className={`flex gap-2 overflow-x-auto ${
              ship ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {user?.addressList?.map((address) => (
              <div
                key={address.addressInfor.id}
                onClick={() => handleAddressClick(address)}
                className={`p-2 rounded-lg flex-shrink-0 cursor-pointer ${
                  selectedAddress?.addressInfor.id === address.addressInfor.id
                    ? "border border-green-600"
                    : "bg-blue-100"
                }`}
              >
                <p className="text-xs font-medium">
                  {address.addressInfor.address}
                </p>
                <p className="text-xs font-medium">
                  {address.addressInfor.ward}
                </p>
                <p className="text-xs font-medium">
                  {address.addressInfor.district}
                </p>
                <p className="text-xs font-medium">
                  {address.addressInfor.city}
                </p>
                {address._default && (
                  <p className="text-xs text-red-600">Mặc định</p>
                )}
              </div>
            ))}
          </div>

          <div
            className={`flex flex-col mb-2${
              ship ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <input
              type="text"
              className="input p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-black"
              placeholder="Tên đầy đủ"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-sm text-red-600 font-medium">
                {errors.name.message}
              </span>
            )}
          </div>

          <div
            className={`flex flex-col mb-2${
              ship ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <input
              type="text"
              className="input p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-black"
              placeholder="Số điện thoại"
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <span className="text-sm text-red-600 font-medium">
                {errors.phoneNumber.message}
              </span>
            )}
          </div>
          {!selectedAddress && (
            <div
              className={`flex flex-col gap-2 mb-2 ${
                ship ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <div className="flex gap-2">
                <Controller
                  control={control}
                  name="city"
                  render={({ field: { value, onChange } }) => (
                    <select
                      id="city"
                      className="border-2 p-3 rounded-lg border-gray-300 focus:outline-none focus:border-black"
                      value={value}
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
                {errors.city && (
                  <span className="text-sm text-red-600 font-medium">
                    {errors.city.message}
                  </span>
                )}
                <Controller
                  control={control}
                  name="district"
                  render={({ field: { value, onChange } }) => (
                    <select
                      id="district"
                      className="border-2 p-3 rounded-lg border-gray-300 focus:outline-none focus:border-black"
                      value={value}
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
                      className="border-2 p-3 rounded-lg border-gray-300 focus:outline-none focus:border-black"
                      value={value}
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
                placeholder="Địa chỉ cụ thể"
                {...register("address")}
              />
              {errors.address && (
                <span className="text-sm text-red-600 font-medium">
                  {errors.address.message}
                </span>
              )}
            </div>
          )}
          <div className="flex justify-between items-center mt-6">
            <p onClick={handleComebackCart} className="cursor-pointer">
              {"<"} Trở lại giỏ hàng
            </p>
            {!ship && ( // Chỉ hiển thị nút "Tiếp tục" khi ship là null
              <button
                type="button"
                onClick={handleContinue}
                className="bg-blue-400 text-white text-lg font-medium px-10 py-2 rounded-lg hover:opacity-80"
              >
                Tiếp tục
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="col-span-2 bg-gray-100 pr-52 pt-14 pl-10">
        {user?.cart?.cartItems?.length >= 0 &&
          user?.cart?.cartItems?.map((item, index) => (
            <CartItemCheckOut key={index} product={item} />
          ))}
        <hr className="border-1 border-gray-300 my-4" />
        <div className="flex justify-between gap-2">
          <input
            type="text"
            disabled
            className="input flex-1 p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-black"
            placeholder="Mã Voucher"
            {...register("voucher")}
          />
          {errors.voucher && (
            <span className="text-sm text-red-600 font-medium">
              {errors.voucher.message}
            </span>
          )}
        </div>
        {vouchers && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {vouchers.map((voucher) => {
              if (voucher.minimumCartPrice <= user?.cart.totalPrice) {
                return (
                  <div
                    key={voucher.voucherCode}
                    onClick={() => handleVoucherClick(voucher)}
                    className={`p-2 rounded-lg border-2 cursor-pointer w-full text-center ${
                      selectedVoucher?.id === voucher.id
                        ? "bg-yellow-400 border-yellow-800"
                        : "bg-yellow-100 border-yellow-300"
                    }`}
                  >
                    <p className="text-xs font-medium">{voucher.voucherCode}</p>
                    <p className="text-xs text-gray-700">
                      Giảm giá: {voucher.discountRate}%
                    </p>
                    <p className="text-xs text-gray-700">
                      Giảm tối đa:{" "}
                      {voucher.maximumDiscountValidPrice.toLocaleString(
                        "vi-VN",
                        {
                          style: "currency",
                          currency: "VND",
                        }
                      )}
                    </p>
                  </div>
                );
              }
            })}
          </div>
        )}

        <hr className="border-1 border-gray-300 my-4" />
        <div className="flex flex-col">
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Phương thức giao hàng</label>
            <Controller
              control={control}
              name="deliveryId"
              render={({ field: { value, onChange } }) => (
                <Radio.Group
                  onChange={(e) => onChange(parseInt(e.target.value))}
                  value={value}
                  className="flex flex-col"
                >
                  {ship && (
                    <Radio key={ship.deliveryId} value={ship.deliveryId}>
                      {ship.deliveryName} - {ship.deliveryDescription}
                    </Radio>
                  )}
                </Radio.Group>
              )}
            />
            {errors.deliveryId && (
              <span className="text-sm text-red-600 font-medium">
                {errors.deliveryId.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Phương thức thanh toán</label>
            <Controller
              control={control}
              name="paymentMethodId"
              defaultValue={1}
              render={({ field: { value, onChange } }) => (
                <Radio.Group
                  onChange={(e) => onChange(parseInt(e.target.value))}
                  value={value}
                  className="flex flex-col"
                >
                  <Radio value={2}>COD</Radio>
                  <Radio value={1}>VNPay</Radio>
                </Radio.Group>
              )}
            />
            {errors.paymentMethodId && (
              <span className="text-sm text-red-600 font-medium">
                {errors.paymentMethodId.message}
              </span>
            )}
          </div>
        </div>

        <hr className="border-1 border-gray-300 my-4" />
        <div className="flex justify-between items-center">
          <p className="font-light text-lg text-gray-600">Tổng tiền:</p>
          <div className="flex items-center gap-1">
            {user?.cart.discountRate > 0 && (
              <>
                <div className="bg-red-500 rounded-xl px-4 py-2">
                  <p className="text-xs font-medium text-white">
                    -{user?.cart.discountRate}%
                  </p>
                </div>
                <p className="text-xs text-gray-500 line-through">
                  {user?.cart.totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </>
            )}
            <p className="text-xl font-bold text-red-600">
              {user?.cart.finalPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-8 mb-4">
          <img className="w-[4rem] h-[4rem]" src={imgTrunk} alt="imgTrunk" />
          <div className="text-sm">
            <p className="font-medium">
              Hơn 800.000 đơn hàng đã được Shoes.co giao thành công đến khách
              hàng.
            </p>
            <p>
              Shoes.co luôn đảm bảo khách hàng hài lòng khi nhận sản phẩm. Bạn
              chỉ cần đặt hàng, đội ngũ Shoes.co sẽ lo hết.
            </p>
          </div>
        </div>

        {/* Nội dung khác */}
        {ship && ( // Chỉ hiển thị nút "Điền thông tin lại" và "Thanh toán" khi ship không phải null
          <div className="flex justify-between mt-6 mb-4">
            <button
              className="bg-blue-400 text-white text-lg font-medium px-4 py-2 rounded-lg hover:opacity-80"
              type="button"
              onClick={() => {
                setShip(null); // Reset ship
                // Có thể thêm logic để reset giá trị các trường nhập liệu nếu cần
              }}
            >
              Điền thông tin lại
            </button>
            <button
              className="bg-black text-white text-lg font-medium px-4 py-2 rounded-lg hover:opacity-80"
              type="submit"
            >
              Thanh toán
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormFields;
