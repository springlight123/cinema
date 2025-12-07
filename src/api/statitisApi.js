import axiosApi from "./axisosApi";

const statitisApi = {
  getRevenueByCustomer: (params) => {
    if (!params?.customer_id) {
      return axiosApi.get(
        `/statistics/revenuebycustomer?start_date=${params.start_date}&end_date=${params.end_date}&cinema_id=${params?.cinema_id}`
      );
    } else {
      return axiosApi.get(
        `/statistics/revenuebycustomer?customer_id=${params?.customer_id}&start_date=${params.start_date}&end_date=${params.end_date}&cinema_id=${params.cinema_id}`
      );
    }
  },
  getRevenue: (params) => {
    if (!params?.staff_id) {
      return axiosApi.get(
        `/statistics/revenuebystaff?start_date=${params.start_date}&end_date=${params.end_date}&cinema_id=${params.cinema_id}`
      );
    } else {
      return axiosApi.get(
        `/statistics/revenuebystaff?staff_id=${params?.staff_id}&start_date=${params.start_date}&end_date=${params.end_date}&cinema_id=${params.cinema_id}`
      );
    }
  },
  getRevenueByMovie: (params) => {
    if (params?.movie_id) {
      return axiosApi.get(
        `/statistics/revenuebymovie?${params?.movie_id}&start_date=${params.start_date}&end_date=${params.end_date}&movie_id=${params.movie_id}`
      );
    } else {
      return axiosApi.get(
        `/statistics/revenuebymovie?start_date=${params.start_date}&end_date=${params.end_date}`
      );
    }
  },

  getRevenueByShow: (params) => {

      return axiosApi.get(
        `/statistics/revenuebyshowtime?date=${params.date}&idMovie=${params.idMovie}`
      );
    
  },

  getRevenueInWeek: () => {
    return axiosApi.get(
      `/statistics/revenueInWeek`
    );
  },
  getPersenUser: () => {
    return axiosApi.get(
      `/statistics/total-percent-users`
    );
  },
  getTopMovie: () => {
    return axiosApi.get(
      `/statistics/top5movies`
    );
  },
  getTopCustomer: () => {
    return axiosApi.get(
      `/statistics/top5customers`
    );
  },
  getRatio: () => {
    return axiosApi.get(
      `/statistics/ratioDashboard`
    );
  },
  getRevenuePromotion: ({start_date, end_date, promotion_code, promotion_type}) => {
    return axiosApi.get(
      `/statistics/revenuebypromotionline?start_date=${start_date}&end_date=${end_date}&promotion_code=${promotion_code}&promotion_type=${promotion_type}`
    );
  },
  getRefundStatitis: ({start_date, end_date, type}) => {
    return axiosApi.get(
      `/statistics/refundorder?start_date=${start_date}&end_date=${end_date}&type_seat=${type}`
    );
  },
  getRefundDetail: (idOrder) => {
    return axiosApi.get(
      `/statistics/refundorderdetail?idOrder=${idOrder}`
    );
  },


};

export default statitisApi;
