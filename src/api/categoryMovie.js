import axiosApi from "./axisosApi";

const categoryMovie = {
  getCategory: () => {
    return axiosApi.get("/category");
  },
};

export default categoryMovie;
