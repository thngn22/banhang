import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CustomInput = (props) => {
  const { onDataChange, dataDetail } = props;
  const [data, setData] = useState("");

  console.log("des", data);

  const handleInputChange = (value) => {
    setData(value);
    onDataChange(value);
  };

  useEffect(() => {
    if (dataDetail && dataDetail !== "") {
      setData(dataDetail);
    }
  }, [dataDetail]);
  return (
    <div>
      <ReactQuill
        theme="snow"
        value={dataDetail ? dataDetail : data}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default CustomInput;
