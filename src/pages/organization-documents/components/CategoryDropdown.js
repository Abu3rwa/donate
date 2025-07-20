import React from "react";

const CategoryDropdown = ({
  categories,
  selectedCategory,
  onChange,
  defaultOption,
  ...props
}) => {
  return (
    <select
      className="input-field w-full"
      value={selectedCategory}
      onChange={onChange}
      {...props}
    >
      <option value="">{defaultOption || "اختر فئة..."}</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
};

export default CategoryDropdown;
