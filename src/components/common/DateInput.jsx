
import React from "react";

function DateInput({ value, onChange, name, className, ...props }) {
  return (
    <input
      type="date"
      name={name}
      value={value}
      onChange={onChange}
      min="1900-01-01"
      max="2100-12-31"
      onInput={(e) => {
        const year = e.target.value.split("-")[0];
        if (year.length > 4) {
          e.target.value = "";
        }
      }}
      className={className}
      {...props}
    />
  );
}

export default DateInput;
