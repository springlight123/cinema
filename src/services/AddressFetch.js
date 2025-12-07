import cinameApi from "../api/cinemaApi";
import movieApi from "../api/movieApi";
import openAddressApi from "../api/openApi";
import promotionApi from "../api/promotionApi";
export const getCity = async (id) =>{
    try {
        const dataResult = await openAddressApi.getProvinceByCode(id)
        return dataResult
    } catch (error) {
        console.log("fetch failed!!", error);
        
        throw error;
    }
   
}