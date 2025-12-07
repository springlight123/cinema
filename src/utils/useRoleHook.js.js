import { useSelector } from "react-redux";

export const useRoleHook = () => {
    const user = useSelector((state) => state.user);
    const isMangement = user?.position === 3
    const isEmployee = user?.position === 4
    return {
        user,
        isMangement,
        isEmployee
    }
}
