import cinameApi from "../api/cinemaApi";
import cinemaHallApi from "../api/cinemaHallApi";
import promotionApi from "../api/promotionApi";
export const getCinemas = async () =>{
    try {
        const dataResult = await cinameApi.getCinemas()
        return dataResult
    } catch (error) {
        console.log("fetch failed!!", error);
        
        throw error;
    }
   
}

export const getCinemaHallById = async (id) =>{
    try {
        const dataResult = await cinemaHallApi.getCinemaHallById(id)
        return dataResult
    } catch (error) {
        console.log("fetch failed!!", error);
        
        throw error;
    }
   
}