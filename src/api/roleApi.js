import axiosApi from "./axisosApi";

const roleApi = {
    getRoles: () => {
        return axiosApi.get("/role");
    },
    getRoleById: (id) => {
        return axiosApi.get(`/role/${id}`);
    },
};

export default roleApi;
