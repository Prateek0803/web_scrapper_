import React, { useState, useEffect } from "react";
import Card from "./Component/Card/Card";
import {
  getAllCompanies,
  searchCompanies,
  updateCompanyDetails,
  deleteCompany,
  addCompany,
} from "./api";
import SearchBox from "./Component/Search/Search";
import CompanyForm from "./Component/Form/CompanyForm";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  const getCompanies = async () => {
    setLoading(true);
    let response = await getAllCompanies();
    if (!response.message) {
      setData(response.data);
    } else {
      setError(response.message);
    }
    setLoading(false);
  };
  const onSearch = async (searchTerm) => {
    setLoading(true);
    let response = await searchCompanies(searchTerm);
    if (!response.message) {
      setData(response.data);
    } else {
      setError(response.message);
    }
    setLoading(false);
  };

  const companyUpdateHandler = async (data, id) => {
    setLoading(true);
    try {
      let response = await updateCompanyDetails(data, id);
      alert(response.data.message);
    } catch (error) {
      alert("Something went wrong!!");
      setError(error);
    } finally {
      setLoading(false);
      setShowForm(false);
      await getCompanies();
    }
  };

  const companyDeleteHandler = async (id) => {
    setLoading(true);
    try {
      let response = await deleteCompany(id);
      alert(response.data.message);
    } catch (error) {
      alert("Something went wrong!!");
      setError(error);
    } finally {
      setLoading(false);
      setShowForm(false);
      await getCompanies();
    }
  };

  const addCompanyHandler = async (data) => {
    setLoading(true);
    try {
      let response = await addCompany(data);
      alert(response.data.message);
    } catch (error) {
      alert("Something went wrong!!");
      setError(error);
    } finally {
      setLoading(false);
      setShowForm(false);
      await getCompanies();
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);
  return (
    <div className="App">
      <h2 className="App_Header">Company List</h2>
      {error && <p>Something Went Wrong</p>}
      {loading && <p>Loading....</p>}
      <div className="App_SearchBar">
        <SearchBox
          onSearch={onSearch}
          setShowForm={setShowForm}
          setEditFormData={setEditFormData}
        />
      </div>
      {!error && !loading && (
        <>
          {showForm ? (
            <CompanyForm
              selectedCompany={editFormData}
              setShowForm={setShowForm}
              companyUpdateHandler={companyUpdateHandler}
              addCompanyHandler={addCompanyHandler}
            />
          ) : (
            <div className="App_CardContainer">
              {data?.map((ins) => (
                <Card
                  data={ins}
                  setShowForm={setShowForm}
                  setEditFormData={setEditFormData}
                  key={`${ins.id}${ins.pincode}`}
                  companyDeleteHandler={companyDeleteHandler}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
