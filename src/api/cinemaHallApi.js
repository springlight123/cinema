import axiosApi from "./axisosApi";

const cinemaHallApi = {
  getCinemaHalls: (id,keyword) => {
    return axiosApi.get(`/cinemaHall/cinema/${id}?keyword=${keyword}`);
  },

  getCinemaHallById: (id) => {
    return axiosApi.get(`/cinemaHall/${id}`);
  },

  getCinemaHallSeatById: (id) => {
    return axiosApi.get(`/cinemaHallSeat/cinemaHall/${id}`);
  },

  getSeatById: (id) => {
    return axiosApi.get(`/cinemaHallSeat/${id}`);
  },

  updateSeat: (id, data) => {
    return axiosApi.put(`/cinemaHallSeat/${id}`, data);
  },
  create: (data) => {
    return axiosApi.post(`/cinemaHall`, data);
  },
  getById: (id) => {
    return axiosApi.get(`/cinemaHall/${id}`);
  },
  update: (id, data) => {
    return axiosApi.put(`/cinemaHall/${id}`, data);
  },
  delete: (id) => {
    return axiosApi.delete(`/cinemaHall/${id}`);
  }
};

export default cinemaHallApi;
