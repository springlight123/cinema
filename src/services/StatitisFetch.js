import promotionApi from "../api/promotionApi";
import statitisApi from "../api/statitisApi";

export const fetchRevenue = async (data) => {
  try {
    const dataResult = await statitisApi.getRevenue(data);
    return dataResult;
  } catch (error) {
    console.log("fetch failed!!", error);

    throw error;
  }
};

export const fetchRevenueByCustomer = async (data) => {
  try {
    const dataResult = await statitisApi.getRevenueByCustomer(data);
    return dataResult;
  } catch (error) {
    console.log("fetch failed!!", error);

    throw error;
  }
};

export const fetchRevenueByMovie = async (data) => {
  try {
    const dataResult = await statitisApi.getRevenueByMovie(data);
    return dataResult;
  } catch (error) {
    console.log("fetch failed!!", error);
    throw error;
  }
};


export const fetchRevenueByShow = async (data) => {
  try {
    const dataResult = await statitisApi.getRevenueByShow(data);
    return dataResult;
  } catch (error) {
    console.log("fetch failed!!", error);
    throw error;
  }
};
