export const parseCompanyDetailsKey = {
  companyname: "Company Name",
  companyactivity: "Company Activity",
  cin: "CIN",
  registrationdate: "Registration Date",
  category: "Category",
  subcategory: "Subcategory",
  companyclass: "Company Class",
  roc: "RoC",
  companystatus: "Company Status",
  authorisedcapital: "Authorised Capital",
  paidupcapital: "Paid-Up Capital",
  lastannualgeneralmeetingdate: "Last Annual General Meeting Date",
  latestdateofbalancesheet: "Latest Date of Balance Sheet",
  state: "State",
  pincode: "Pincode",
  country: "Country",
  address: "Address",
  email: "Email",
};

export const initialStateForForm = {
  companyname: "",
  companyactivity: "",
  cin: "",
  registrationdate: "",
  category: "",
  subcategory: "",
  companyclass: "",
  roc: "",
  companystatus: "",
  authorisedcapital: "",
  paidupcapital: "",
  lastannualgeneralmeetingdate: "",
  latestdateofbalancesheet: "",
  state: "",
  pincode: "",
  country: "",
  address: "",
  email: "",
};

export const debounce = (fn, delay) => {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};
