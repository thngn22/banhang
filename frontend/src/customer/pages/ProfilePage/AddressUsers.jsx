import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import addressSchema from "../../../validator/addressValidator";
import addressApi from "../../../services/ProvinceService";
import addressApis from "../../../services/addressApis";
import { useDispatch, useSelector } from "react-redux";
import createAxiosInstance from "../../../services/createAxiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import EditAddress from "./EditAddress";

const AddressUsers = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const [creatingAddress, setCreatingAddress] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [listAddress, setListAddress] = useState([]);
  const navigate = useNavigate();
  const [editingAddress, setEditingAddress] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm({ resolver: zodResolver(addressSchema.createSchema) });

  const { data: dataAddress, refetch: refetchListAddress } = useQuery({
    queryKey: ["dataAddress"],
    queryFn: () => {
      return addressApis.getAddressUser(auth.accessToken, axiosJWT);
    },
    enabled: Boolean(auth?.accessToken),
  });

  useEffect(() => {
    if (dataAddress) {
      setListAddress(dataAddress);
    }
  }, [dataAddress]);

  const mutationCreate = useMutationHook((data) => {
    const res = addressApis.createAddressUser(data, auth.accessToken, axiosJWT);
    return res;
  });

  const mutationDelete = useMutationHook((id) => {
    const res = addressApis.deleteAddressUser(id, auth.accessToken, axiosJWT);
    return res;
  });

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await addressApi.getProvinces();
        if (data && data.length > 0) {
          setProvinces(data);
          setValue("city", data[0].province_name); // Cập nhật giá trị mặc định cho thành phố
          fetchDistricts(data[0].province_id); // Lấy danh sách các quận của tỉnh đầu tiên
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
        setValue("district", data[0].district_name); // Cập nhật giá trị mặc định cho quận
        fetchWards(data[0].district_id); // Lấy danh sách các phường của quận đầu tiên
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
        setValue("ward", data[0].ward_name); // Cập nhật giá trị mặc định cho phường
      }
    } catch (error) {
      console.error("Error fetching wards", error);
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

  const onSubmit = (data) => {
    const formData = { ...data };
    console.log(formData);

    mutationCreate.mutate(formData, {
      onSuccess: () => {
        message.success("Thêm địa chỉ mới thành công");
        refetchListAddress({ queryKey: ["dataAddress"] });
      },
      onError: (error) => {
        message.error(`Đã xảy ra lỗi: ${error.message}`);
      },
    });

    reset();
    setCreatingAddress(false); // Close the creation form
  };

  const handleEdit = (address) => {
    setEditingAddress(address); // Cập nhật địa chỉ đang chỉnh sửa
  };

  const handleCloseEdit = () => {
    setEditingAddress(null); // Đóng form chỉnh sửa
  };

  const handleDelete = (id) => {
    mutationDelete.mutate(id, {
      onSuccess: () => {
        message.success("Xóa địa chỉ mới thành công");
        refetchListAddress({ queryKey: ["dataAddress"] });
      },
      onError: (error) => {
        message.error(`Đã xảy ra lỗi: ${error.message}`);
      },
    });
  };

  return (
    <div className="px-4">
      <p className="font-bold text-2xl mb-4">Danh sách địa chỉ</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex justify-center items-center">
          <div className="space-y-4 w-full">
            {listAddress.map((address) => (
              <div
                key={address.addressInfor.id}
                className="p-4 bg-blue-100 rounded-lg shadow-lg"
              >
                {editingAddress?.addressInfor.id === address.addressInfor.id ? (
                  <EditAddress
                    address={editingAddress}
                    handleChangeData={handleCloseEdit}
                    handleUpdateAddress={handleCloseEdit}
                    handleCancelEdit={handleCloseEdit}
                    refetchListAddress={refetchListAddress}
                  />
                ) : (
                  <>
                    <div className="flex gap-2">
                      <strong>Thành phố/Tỉnh:</strong>
                      <p>{address.addressInfor.city}</p>
                    </div>
                    <div className="flex gap-2">
                      <strong>Quận/Huyện:</strong>
                      <p>{address.addressInfor.district}</p>
                    </div>
                    <div className="flex gap-2">
                      <strong>Phường/Xã:</strong>
                      <p>{address.addressInfor.ward}</p>
                    </div>
                    <div className="flex gap-2">
                      <strong>Địa chỉ cụ thể:</strong>
                      <p>{address.addressInfor.address}</p>
                    </div>
                    {address._default && (
                      <p className="font-medium text-red-500">
                        Địa chỉ mặc định
                      </p>
                    )}
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-blue-500"
                      >
                        <EditOutlined />
                      </button>
                      <button
                        onClick={() => handleDelete(address.addressInfor.id)}
                        className="text-red-500"
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center">
          {creatingAddress ? (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-md space-y-4 bg-gray-100 shadow-lg rounded-lg p-4"
            >
              <div>
                <label className="block text-gray-700">Thành phố/Tỉnh:</label>
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
                      className="block w-full px-4 py-2 mt-2 bg-white border rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                  <p className="text-red-500">{errors.city.message}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700">Quận/Huyện:</label>
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
                      className="block w-full px-4 py-2 mt-2 bg-white border rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                  <p className="text-red-500">{errors.district.message}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700">Phường/Xã:</label>
                <Controller
                  control={control}
                  name="ward"
                  render={({ field: { value, onChange } }) => (
                    <select
                      id="ward"
                      value={value}
                      onChange={onChange}
                      className="block w-full px-4 py-2 mt-2 bg-white border rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                  <p className="text-red-500">{errors.ward.message}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700">Địa chỉ cụ thể:</label>
                <input
                  type="text"
                  id="address"
                  {...register("address")}
                  className="block w-full px-4 py-2 mt-2 bg-white border rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.address && (
                  <p className="text-red-500">{errors.address.message}</p>
                )}
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id="default"
                    {...register("default")}
                    className="mr-2"
                  />
                  Đặt làm địa chỉ mặc định
                </label>
                {errors.default && (
                  <p className="text-red-500">{errors.default.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2 font-medium text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              >
                Tạo
              </button>
              <button
                onClick={() => setCreatingAddress(false)}
                className="ml-2 px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded-md shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
              >
                Hủy
              </button>
            </form>
          ) : (
            <button
              onClick={() => setCreatingAddress(true)}
              className="px-4 py-2 font-medium text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              Thêm địa chỉ mới
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressUsers;
