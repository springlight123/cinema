import axiosApi from "./axisosApi";

const staffApi = {
  getStaffs: () => {
    return axiosApi.get("/staff");
  },
  getStaff: (id) => {
    return axiosApi.get(`/staff/${id}`);
  },
  createStaff: (data) => {
    return axiosApi.post("/auth/signup", data);
  },
  updateStaff: (id, data) => {
    return axiosApi.put(`/staff/${id}`, data,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteStaff: (id) => {
    return axiosApi.delete(`/staff/${id}`);
  },

  getStaffsByIdCinema: (id) => {
    return axiosApi.get(`/staff/cinema/${id}`);
  },
};


export default staffApi;
