import React from "react";
import { parseCompanyDetailsKey } from "../../utils";
import "./styles.css";
import Button from "../Button/Button";

const Card = ({ data, setShowForm, setEditFormData, companyDeleteHandler }) => {
  const formEditHandler = (companyData) => {
    setShowForm(true);
    setEditFormData(companyData);
  };
  return (
    <div className="card">
      <div className="card-header">
        <h2>Company Details</h2>
      </div>
      <div className="card-body">
        {Object.keys(data)
          .filter((key) => key !== "id")
          .map((key) => (
            <div>
              <p key={key}>
                <strong>{parseCompanyDetailsKey[key]}:</strong> {data[key]}
              </p>
            </div>
          ))}
      </div>
      <div className="card-btn-container">
        <Button title="Edit" onClickHandler={() => formEditHandler(data)} />
        <Button
          title="Delete"
          onClickHandler={() => companyDeleteHandler(data.id)}
        />
      </div>
    </div>
  );
};

export default Card;
