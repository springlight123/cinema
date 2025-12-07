import axiosApi from "./axisosApi";

const cinameApi = {
  getCinemas: (keyword = "") => {
    return axiosApi.get(`/cinema?keyword=${keyword}`);
  },
  getCinemaById: (id) => {
    return axiosApi.get(`/cinema/${id}`);
  },
  getHallByCinema: (id) => {
    return axiosApi.get(`cinemaHall/cinema/${id}`);
  },
  getCinemaActive: () => {
    return axiosApi.get("/cinema/status/active");
  },
  create: (data) => {
    return axiosApi.post("/cinema", data);
  },
  update: (id,data) => {
    return axiosApi.put("/cinema/"+id, data);
  },
  delete: (id) => {
    return axiosApi.delete("/cinema/"+id);
  }



};

export default cinameApi;
