import React from "react";
import PropTypes from "prop-types";
import { TextField } from "@mui/material";

InputField.propTypes = {};

function InputField(props) {
  const { label, value, name, type, style, handleOnChange, isCategory, disable } = props;

  const handleOnChangeInput = (e) => {
    handleOnChange(e.target.value);
  };

  return (
    <div>
      {isCategory ? (
        <TextField
          margin="normal"
          required
          autoFocus
          label={label}
          value={value.name}
          name={name}
          type={type}
          style={style}
          onChange={handleOnChangeInput}
          disabled={true}
        />
      ) : (
        <TextField
          margin="normal"
          required
          autoFocus
          label={label}
          value={value}
          name={name}
          type={type}
          style={style}
          onChange={handleOnChangeInput}
          disabled={disable}
        />
      )}
    </div>
  );
}

export default InputField;
