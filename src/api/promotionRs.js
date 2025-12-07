import axiosApi from "./axisosApi";

const promotionRsApi = {
    getByOrderId: (id) => {
        return axiosApi.get(`/promotionResult/order/${id}`);
    },
    getByPromotionLineId: (id) => {
        return axiosApi.get(`/promotionResult/promotion/${id}`);
    },

    
};

export default promotionRsApi;