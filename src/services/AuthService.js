import authApi from "../api/authApi";
import cinameApi from "../api/cinemaApi";
import promotionApi from "../api/promotionApi";
export const sendEmailGetPassword = async (email) =>{
    try {
        const dataResult = await authApi.sendEmailFogotPassword(email)
        return dataResult
    } catch (error) {
        throw error;
    }  
}

export const handleResetPassword = async (email, token, password) =>{
    try {
        const dataResult = await authApi.resetPassword(email, token, password)
        return dataResult
    } catch (error) {
        throw error;
    }
}

export const handleUpdatePass = async (email, password) =>{
    try {
        const dataResult = await authApi.updatePassword(email, password)
        return dataResult
    } catch (error) {
        throw error;
    }
}