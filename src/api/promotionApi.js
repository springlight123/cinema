import axiosApi from "./axisosApi";

const promotionApi = {
  getPromotionHeader: ({ startDate, endDate}) => {
    return axiosApi.get(`/promotionHeader?start_date=${startDate}&end_date=${endDate} `);
  },
  updatePromotionHeader: (data,id) => {
    return axiosApi.put(`/promotionHeader/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  createPromotionHeader: (data) => {
    return axiosApi.post("/promotionHeader", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getPromotionHeaderById: (id) => {
    return axiosApi.get(`/promotionHeader/${id}`);
  },
  getPromotionLineByHeader: (_id) => {
    return axiosApi.get(`/promotionLine/promotionHeader/${_id}`);
  },
  getPromotionLineById: (_id) => {
    return axiosApi.get(`/promotionLine/${_id}`);
  },

  createPromotionLine: (data) => {
    return axiosApi.post("/promotionLine", data);
  },
  createPromotionDetail: (data) => {
    return axiosApi.post("/promotionDetail", data);
  },

  checkPromotion: (data) => {
    return axiosApi.post(`/promotionHeader/check/promotion`, data);
  },

  getPromotionDetailsByLineId: (_id) => {
    return axiosApi.get(`/promotionDetail/promotionLine/${_id}`);
  },
  getAllPromotionLine: () => {
    return axiosApi.get("/promotionLine");
  },
  delete: (id) => {
    return axiosApi.delete(`/promotionHeader/${id}`);
  },
  updateLine: (id,data) => {
    return axiosApi.put(`/promotionLine/${id}`, data);
  },
  deleteLine: (id) => {
    return axiosApi.delete(`/promotionLine/${id}`);
  }
};

export default promotionApi;
