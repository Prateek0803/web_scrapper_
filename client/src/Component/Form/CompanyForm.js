import React, { useState, useEffect } from "react";
import "./styles.css";
import { parseCompanyDetailsKey, initialStateForForm } from "../../utils";
import Button from "../Button/Button";

const CompanyForm = ({
  selectedCompany,
  setShowForm,
  companyUpdateHandler,
  addCompanyHandler,
}) => {
  const [formData, setFormData] = useState(initialStateForForm);
  const [changedCompanyDetailsData, setChangedCompanyDetailsData] = useState(
    {}
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedCompany) {
      setFormData(selectedCompany);
    } else {
      setFormData(initialStateForForm);
    }
  }, [selectedCompany]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (
      name === "lastannualgeneralmeetingdate" ||
      name === "latestdateofbalancesheet"
    ) {
      newValue = value.trim() === "" ? null : value;
    }
    setFormData({ ...formData, [name]: newValue });
    setChangedCompanyDetailsData({
      ...changedCompanyDetailsData,
      [name]: newValue,
    });

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    if (name === "cin" || name === "pincode") {
      if (value.length !== 21 && name === "cin") {
        error = "CIN should be exactly 21 characters long.";
      } else if (value.length !== 6 && name === "pincode") {
        error = "Pincode should be exactly 6 characters long.";
      }
    } else if (
      name === "registrationdate" ||
      name === "lastannualgeneralmeetingdate" ||
      name === "latestdateofbalancesheet"
    ) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        error = "Invalid date format. Please use YYYY-MM-DD.";
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isFormIncomplete = Object.values(formData).some((value) => !value);

    if (isFormIncomplete) {
      alert("Please fill in all fields before submitting.");
      return;
    }
    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (hasErrors) {
      alert("Please fix the error");
    } else {
      if (selectedCompany) {
        companyUpdateHandler(changedCompanyDetailsData, selectedCompany.id);
      } else {
        addCompanyHandler(formData);
      }
    }
  };

  return (
    <div className="form-container">
      <h2>{selectedCompany ? "Edit Company" : "Add Company"}</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData)
          .filter((key) => key !== "id")
          .map((key) => (
            <div key={key} className="form-group">
              <label htmlFor={key}>{parseCompanyDetailsKey[key]}</label>
              <input
                type="text"
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="form-input"
              />
              {errors[key] && <div className="error">{errors[key]}</div>}
            </div>
          ))}
        <div className="form-actions">
          <Button type="submit" title={selectedCompany ? "Update" : "Add"} />
          <Button title="Cancel" onClickHandler={() => setShowForm(false)} />
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;
