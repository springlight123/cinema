import promotionApi from "../api/promotionApi";
import staffApi from "../api/staffApi";
import statitisApi from "../api/statitisApi";

export const featchStaffByIdCinema = async (data) =>{
    try {
        const dataResult = await staffApi.getStaffsByIdCinema(data)
        return dataResult
    } catch (error) {
        console.log("fetch failed!!", error);
        throw error;
    }
}

export const getStaffById = async (id) =>{
    try {
        const dataResult = await staffApi.getStaff(id)
        return dataResult
    } catch (error) {
        console.log("fetch failed!!", error);
        throw error;
    }
}

export const createStaff = async (data) =>{
    try {
        const dataResult = await staffApi.createStaff(data)
        return dataResult
    } catch (error) {
        console.log("fetch failed!!", error);
        throw error;
    }
}

export const updateStaff = async (id, data) =>{
    try {
        const dataResult = await staffApi.updateStaff(id, data)
        return dataResult
    } catch (error) {
        console.log("fetch failed!!", error);
        throw error;
    }
}