import promotionApi from "../api/promotionApi";
export const getPromotion = async (data) =>{
    try {
        const dataResult = await promotionApi.checkPromotion(data)
        console.log(dataResult);
        return dataResult
    } catch (error) {
        console.log("fetch failed!!", error);
        
        throw error;
    }
   
}