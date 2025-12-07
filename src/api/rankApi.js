import axiosApi from "./axisosApi";

const rankApi = {
    getRanks: () => {
        return axiosApi.get("/rank");
    },
};

export default rankApi;