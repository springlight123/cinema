import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const config = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
}
export const notifyWarn = (mesage) => toast.warn(mesage,config );
export const notifySucess = (mesage) => toast.success(mesage,config );
export const notifyInfo = (mesage) => toast.info(mesage,config );
export const notifyError = (mesage) => toast.error(mesage,config );
