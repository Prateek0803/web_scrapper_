import React from "react";

const Button = ({ title, onClickHandler, disabled, type }) => {
  return (
    <button
      className="search-button"
      onClick={onClickHandler}
      disabled={disabled}
      type={type}
    >
      {title}
    </button>
  );
};

export default Button;
