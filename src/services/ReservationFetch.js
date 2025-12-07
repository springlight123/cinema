import reservationApi from "../api/reservationApi";

export const createReservationData = async (data) =>{
    try {
        const dataResult = await reservationApi.creatReservation(data)
        console.log('đã gọi api lưu ghế !!');
        return dataResult
    } catch (error) {
        console.log("fetch failed!!", error);
        
        throw error;
    }
   
}

export const cancelReservationData = async (data) =>{
    try {
        const dataResult = await reservationApi.updateReservation(data)
        console.log('đã gọi api xóa ghế !!');
        return dataResult
    } catch (error) {
        console.log("fetch failed!!", error);
        throw error;
    }
   
}

export const getReservationData = async (idShow) =>{
    try {
        const dataResult = await reservationApi.getReservation(idShow)
        return dataResult
    } catch (error) {
        console.log("fetch failed!!", error);
        throw error;
    }
   
}