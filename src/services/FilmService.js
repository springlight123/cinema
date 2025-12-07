import cinameApi from "../api/cinemaApi";
import movieApi from "../api/movieApi";
import promotionApi from "../api/promotionApi";
export const getFilmByCinemaId = async (id) =>{
    try {
        const dataResult = await movieApi.getMovieByIdCinema(id)
        return dataResult
    } catch (error) {
        console.log("fetch failed!!", error);
        
        throw error;
    }
   
}

export const getFilmById = async (id) =>{
    try {
        const dataResult = await movieApi.getMovieById(id)
        return dataResult
    } catch (error) {
        throw error;
    }
   
}