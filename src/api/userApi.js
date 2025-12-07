import axiosApi from "./axisosApi";

const userApi = {
  login: (phone, password) => {
    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    if( regex.test(phone)){
      return axiosApi.post("/auth/login", {
        email: phone,
        password,
        staff: 1,
      });
    }else {
      return axiosApi.post("/auth/login", {
        phone,
        password,
        staff: 1,
      });
    }
  },
};

export default userApi;
