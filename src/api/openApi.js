import axiosClient from "./axiosClient";
// https://provinces.open-api.vn/api/p/
const openAddressApi = {
  getList: (url) => {
    return axiosClient.get(url);
  },
  getProvinceByCode: (code) => {
    return axiosClient.get(`/p/${code}`);
  },
  getDistrictByCode: (code) => {
    return axiosClient.get(`/d/${code}`);
  },
  getWardByCode: (code) => {
    return axiosClient.get(`/w/${code}`);
  }

};

export default openAddressApi;
