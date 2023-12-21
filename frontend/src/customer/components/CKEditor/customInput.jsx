import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const CustomInput = (props) => {
  const { onDataChange, dataDetail } = props;
  const [data, setData] = useState("");

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
      <CKEditor
        editor={ClassicEditor}
        data={dataDetail ? dataDetail : data}
        onChange={(event, editor) => {
          const value = editor.getData();
          handleInputChange(value);
        }}
      />
    </div>
  );
};

export default CustomInput;
