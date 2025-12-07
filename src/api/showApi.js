import axiosApi from "./axisosApi";

const showApi = {
  getShow: (query) => {
    return axiosApi.get(`/show?cinemaId=${query?.cinemaId}&movieId=${query?.movieId}&startDate=${query?.startDate}&endDate=${query?.endDate}`);
  },

  getShowByMovieAndDate: (idMovie, date) => {
    return axiosApi.get(`/showTimesMovie/show/movie/${idMovie}/date/${date}`);
  },
  createShow: (data) => {
    return axiosApi.post("/show", data);
  },
  updateShow: (id, data) => {
    return axiosApi.put(`/show/${id}`, data);
  },
  deleteShow: (id) => {
    return axiosApi.delete(`/show/${id}`);
  },
  checkShowIsExist: (data) => {
    return axiosApi.post("/show/checkExist", data);
  },
  getShowIsPass: ({startDate, endDate, idCinema, idCinemaHall, idMovie}) => {
    return axiosApi.get(`/show/listShowTime/isPassed?startDateIn=${startDate}&endDateIn=${endDate}&idCinema=${idCinema}&idCinemaHall=${idCinemaHall}&idMovie=${idMovie}`
    );
  },
  updateStatus: (id, status) => {
    return axiosApi.put(`/show/status/${id}`, status);
  },
  getShowByDate: ({idCinema, showDate, idMovie}) => {
    return axiosApi.get(`/showTimesMovie/showTime/movie?idCinema=${idCinema}&showDate=${showDate}&idMovie=${idMovie}`
    );
  },

};

export default showApi;
