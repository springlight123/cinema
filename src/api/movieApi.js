import axiosApi from "./axisosApi";

const movieApi = {
  getMovies: (query ) => {
    return axiosApi.get(`/movie?keyword=${query?.keyword}&startDate=${query?.startDate}&endDate=${query?.endDate}`);
  },

  getMovieByType: (type) => {
    return axiosApi.get(`/movie/status/${type}`);
  },

  searchMovies: (nameMovie) => {
    return axiosApi.get(`/movie/name/search/${nameMovie}`);
  },

  createMovie: (data) => {
    return axiosApi.post("/movie", data,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getMovieById: (id)=>{
    return axiosApi.get(`/movie/${id}`);
  },

  getMovieByIdCinema: (id)=>{
    return axiosApi.get(`/movie/cinema/${id}`);
  },

  updateMovie: (id, data) => {
    return axiosApi.put(`/movie/${id}`, data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
    );
  },

  deleteMovie: (id) => {
    return axiosApi.delete(`/movie/${id}`);
  }
};

export default movieApi;
