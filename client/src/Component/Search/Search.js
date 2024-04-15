import React, { useEffect, useState } from "react";
import "./styles.css";
import Button from "../Button/Button";

const SearchBox = ({ onSearch, setShowForm, setEditFormData }) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const addNewClientHandler = () => {
    setShowForm(true);
    setEditFormData(null);
  };

  return (
    <div className="search-box">
      <div className="search-box_actions">
        <input
          type="text"
          placeholder="Search with cin, email, company name....."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button title="Search" />
      </div>

      <div>
        <Button title="Add Company" onClickHandler={addNewClientHandler} />
      </div>
    </div>
  );
};

export default SearchBox;
