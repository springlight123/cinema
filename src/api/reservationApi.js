import axiosApi from "./axisosApi";

const reservationApi = {
    creatReservation: (data) => {
        return axiosApi.post("/reservation", data);
    },
    updateReservation: (data) => {
        return axiosApi.put("/reservation", data);
    },
    getReservation: (idShow) => {
        return axiosApi.get(`/showTimesMovie/seats/${idShow}`);
    },
    
};

export default reservationApi;