import React from "react";

const SearchBar = ({ value, onChange, placeholder, ...props }) => {
  return (
    <input
      type="text"
      placeholder={placeholder || "بحث..."}
      value={value}
      onChange={onChange}
      className="input-field w-full"
      {...props}
    />
  );
};

export default SearchBar;
