import React, { useState, useEffect } from "react";
import axios from "axios";

const ProvinceSelection = (props) => {
  const host = "https://provinces.open-api.vn/api/";
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    // Call API to get list of provinces
    axios
      .get(`${host}?depth=1`)
      .then((response) => setCities(response.data))
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  const callApiDistrict = (cityCode) => {
    // Call API to get list of districts based on selected city
    axios
      .get(`${host}p/${cityCode}?depth=2`)
      .then((response) => setDistricts(response.data.districts))
      .catch((error) => console.error("Error fetching districts:", error));
  };

  const callApiWard = (districtCode) => {
    // Call API to get list of wards based on selected district
    axios
      .get(`${host}d/${districtCode}?depth=2`)
      .then((response) => setWards(response.data.wards))
      .catch((error) => console.error("Error fetching wards:", error));
  };

  const handleCityChange = (event) => {
    const selectedCityCode = event.target.value;
    props.setState((s) => ({
      ...s,
      city: cities.find((city) => city.code === parseInt(selectedCityCode))
        ?.name,
      district: "",
      ward: "",
      address: "",
    }));
    setSelectedCity(selectedCityCode);
    setSelectedDistrict("");
    setSelectedWard("");
    callApiDistrict(selectedCityCode);
  };

  const handleDistrictChange = (event) => {
    const selectedDistrictCode = event.target.value;
    props.setState((s) => ({
      ...s,
      district: districts.find(
        (district) => district.code === parseInt(selectedDistrictCode)
      )?.name,
      ward: "",
      address: "",
    }));
    setSelectedDistrict(selectedDistrictCode);
    setSelectedWard("");
    callApiWard(selectedDistrictCode);
  };

  const handleWardChange = (event) => {
    props.setState((s) => ({
      ...s,
      ward: event.target.value,
      address: "",
    }));
    setSelectedWard(event.target.value);
  };

  const handleAddressChange = (event) => {
    const addressValue = event.target.value;
    props.setState((s) => ({
      ...s,
      address: addressValue,
    }));
  };

  return (
    <div style={{ marginTop: "16px" }}>
      <div style={{ marginBottom: "10px" }}>
        <span style={{ marginRight: "32px" }}>Tỉnh/Thành:</span>
        <select
          id="city"
          value={selectedCity}
          onChange={handleCityChange}
          style={{
            border: "1px solid",
            borderRadius: "14px",
            height: "32px",
            width: "180px",
          }}
        >
          <option value="" disabled>
            Chọn tỉnh thành
          </option>
          {cities.map((city) => (
            <option key={city.code} value={city.code}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <span style={{ marginRight: "23px" }}>Quận/Huyện:</span>
        <select
          id="district"
          value={selectedDistrict}
          onChange={handleDistrictChange}
          style={{
            border: "1px solid",
            borderRadius: "14px",
            height: "32px",
            width: "180px",
          }}
        >
          <option value="" disabled>
            Chọn quận huyện
          </option>
          {districts.map((district) => (
            <option key={district.code} value={district.code}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <span style={{ marginRight: "32px" }}>Phường/Xã:</span>
        <select
          id="ward"
          value={selectedWard}
          onChange={handleWardChange}
          style={{
            border: "1px solid",
            borderRadius: "14px",
            height: "32px",
            width: "180px",
          }}
        >
          <option value="" disabled>
            Chọn phường xã
          </option>
          {wards.map((ward) => (
            <option key={ward.code} value={ward.name}>
              {ward.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span style={{ marginRight: "57px" }}>Số nhà:</span>
        <input
          type="text"
          id="address"
          value={props.state.address}
          onChange={handleAddressChange}
          placeholder="Địa chỉ"
          style={{
            border: "1px solid",
            borderRadius: "14px",
            height: "32px",
            width: "60%",
            paddingLeft: "10px",
          }}
        />
      </div>
    </div>
  );
};

export default ProvinceSelection;
