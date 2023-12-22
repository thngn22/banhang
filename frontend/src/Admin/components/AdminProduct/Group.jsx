import React, { useEffect, useState } from "react";
import InputField from "../../../customer/components/InputField";

const Group = (props) => {
  const { title, onDataChange, dataDetail, dataCate, isCategory } = props;
  const [data, setData] = useState("");
  const [cate, setCate] = useState(dataCate);

  useEffect(() => {
    if (isCategory) {
      setCate(dataCate);
    }
  }, [dataCate]);



  const styleInputField = {
    width: "100%",
  };

  useEffect(() => {
    if (dataDetail && dataDetail !== "") {
      setData(dataDetail);
    }
  }, [dataDetail]);


  const handleInputChange = (value) => {
    setData(value);
    onDataChange(value);
  };

  return (
    <div>
      <span style={{ fontSize: "14px", fontWeight: "500" }}>{title}</span>
      {isCategory ? (
        <InputField
          style={styleInputField}
          handleOnChange={handleInputChange}
          value={cate}
          isCategory={isCategory}
        />
      ) : (
        <InputField
          style={styleInputField}
          handleOnChange={handleInputChange}
          value={data}
        />
      )}
    </div>
  );
};

export default Group;
