import axios from "axios";
const BASE_URL = "http://localhost:8000";

export const getAllCompanies = async () => {
  const URL = `${BASE_URL}/clients/`;
  try {
    let response = await axios.get(URL);
    return { data: response.data, status: response.status };
  } catch (error) {
    return { message: error };
  }
};

export const searchCompanies = async (term) => {
  const params = new URLSearchParams({
    q: `${term}`,
  });
  try {
    const URL = `${BASE_URL}/clients?${params.toString()}`;
    let response = await axios.get(URL);
    return { data: response.data, status: response.status };
  } catch (error) {
    return { message: error };
  }
};

export const updateCompanyDetails = async (data, id) => {
  try {
    const URL = `${BASE_URL}/clients/${id}`;
    let response = await axios.post(URL, data);
    return { data: response.data, status: response.status };
  } catch (error) {
    return { message: error };
  }
};

export const deleteCompany = async (id) => {
  try {
    const URL = `${BASE_URL}/clients/${id}`;
    let response = await axios.delete(URL);
    return { data: response.data, status: response.status };
  } catch (error) {
    return { message: error };
  }
};

export const addCompany = async (data) => {
  try {
    const URL = `${BASE_URL}/clients/`;
    let response = await axios.post(URL, data);
    return { data: response.data, status: response.status };
  } catch (error) {
    return { message: error };
  }
};
