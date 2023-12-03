import React, { useState } from "react";
import InputField from "../../../customer/components/InputField";

const Group = (props) => {
  const { title, onDataChange } = props;
  const [data, setData] = useState("");

  const styleInputField = {
    width: "100%",
  };

  const handleInputChange = (value) => {
    setData(value);
    onDataChange(value);
  };


  return (
    <div>
      <span style={{ fontSize: "14px", fontWeight: "500" }}>{title}</span>
      <InputField style={styleInputField} handleOnChange={handleInputChange} />
    </div>
  );
};

export default Group;
