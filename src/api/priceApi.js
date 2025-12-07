import axiosApi from "./axisosApi";

const priceApi = {
    getPriceHeader: ({ startDate, endDate}) => {
        return axiosApi.get(`/priceHeader?start_date=${startDate}&end_date=${endDate}`);
    },
    createPriceHeader: (data) => {
        return axiosApi.post("/priceHeader", data);
    },
    getPriceHeaderById: (id) => {
        return axiosApi.get(`/priceHeader/${id}`);
    },
    getPriceLineByHeader: (_id) => {
        return axiosApi.get(`/priceLine/priceHeader/${_id}`);
    },

    addPriceLine: (data) => {
        return axiosApi.post("/priceLine", data);
    },
    updatePriceHeaderById: (id,data) => {
        return axiosApi.put(`/priceHeader/${id}`, data);
    },
    deletePriceLineById: (id) => {
        return axiosApi.delete(`/priceLine/${id}`);
    },
    getLineById: (id) => {
        return axiosApi.get(`/priceLine/${id}`);
    },
    updatePriceLineById: (id,data) => {
        return axiosApi.put(`/priceLine/${id}`, data);
    },

    getPriceProduct: () => {
        return axiosApi.get("/product/list/price");
    },
    delete: (id) => {
        return axiosApi.delete(`/priceHeader/${id}`);
    },

};

export default priceApi;