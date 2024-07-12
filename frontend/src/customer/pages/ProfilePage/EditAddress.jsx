import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import addressSchema from "../../../validator/addressValidator";
import AddressFormFields from "./AddressFormFields";
import { useMutationHook } from "../../../hooks/useMutationHook";
import addressApis from "../../../services/addressApis";
import { useDispatch, useSelector } from "react-redux";
import createAxiosInstance from "../../../services/createAxiosInstance";
import addressApi from "../../../services/ProvinceService";
import { message } from "antd";

const EditAddress = ({ address, handleCancelEdit, refetchListAddress }) => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const axiosJWT = createAxiosInstance(auth, dispatch);

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    formState: { errors: errorsUpdate },
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(addressSchema.updateSchema),
    defaultValues: {
      city: address?.addressInfor?.city || "",
      district: address?.addressInfor?.district || "",
      ward: address?.addressInfor?.ward || "",
      address: address?.addressInfor?.address || "",
      is_default: address?._default || false,
    },
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const mutationEdit = useMutationHook((data) => {
    const res = addressApis.updateAddressUser(data, auth.accessToken, axiosJWT);
    return res;
  });

  const fetchProvinces = async () => {
    try {
      const data = await addressApi.getProvinces();
      setProvinces(data);
    } catch (error) {
      console.error("Error fetching provinces", error);
    }
  };

  const fetchDistricts = async (provinceId) => {
    try {
      const data = await addressApi.getDistricts(provinceId);
      setDistricts(data);
    } catch (error) {
      console.error("Error fetching districts", error);
    }
  };

  const fetchWards = async (districtId) => {
    try {
      const data = await addressApi.getWards(districtId);
      setWards(data);
    } catch (error) {
      console.error("Error fetching wards", error);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    const selectedProvince = provinces.find(
      (province) => province.province_name === address?.addressInfor?.city
    );
    if (selectedProvince) {
      fetchDistricts(selectedProvince.province_id);
    }
  }, [provinces, address?.addressInfor?.city]);

  useEffect(() => {
    const selectedDistrict = districts.find(
      (district) => district.district_name === address?.addressInfor?.district
    );
    if (selectedDistrict) {
      fetchWards(selectedDistrict.district_id);
    }
  }, [districts, address?.addressInfor?.district]);

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
    const formData = {
      ...data,
      id: address?.addressInfor.id,
    };
    console.log(formData);

    mutationEdit.mutate(formData, {
      onSuccess: () => {
        message.success("Cập nhật địa chỉ thành công");
        refetchListAddress({ queryKey: ["dataAddress"] });
        handleCancel();
      },
      onError: (error) => {
        message.error(`Đã xảy ra lỗi: ${error.message}`);
        handleCancel();
      },
    });
  };

  const handleCancel = () => {
    handleCancelEdit();
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmitUpdate(onSubmit)} className="form">
        <AddressFormFields
          control={control}
          register={registerUpdate}
          errors={errorsUpdate}
          provinces={provinces}
          districts={districts}
          wards={wards}
          handleProvinceChange={handleProvinceChange}
          handleDistrictChange={handleDistrictChange}
        />
        <div className="flex justify-end items-center mt-6 gap-4">
          <button
            className="bg-gray-400 text-white text-lg font-medium px-10 py-2 rounded-lg hover:opacity-80"
            type="button"
            onClick={handleCancel}
          >
            Hủy
          </button>
          <button
            className="bg-black text-white text-lg font-medium px-10 py-2 rounded-lg hover:opacity-80"
            type="submit"
          >
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAddress;
