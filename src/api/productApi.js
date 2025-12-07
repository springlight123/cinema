import axiosApi from "./axisosApi";

const productApi = {
    getProducts: (query) => {
        return axiosApi.get(`/product?keyword=${query}`);
    },
    getProductById: (id) => {
        return axiosApi.get(`/product/${id}`);
    },
    createProduct: (data) => {
        return axiosApi.post("/product", data,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    updateProduct: (id, data) => {
        return axiosApi.put(`/product/${id}`, data,{
            headers: {
                'Content-Type': 'multipart/form-data'
                }
            });
    },
    deleteProduct: (id) => {
        return axiosApi.delete(`/product/${id}`);
    },
    getAllPriceProduct: () => {
        return axiosApi.get("/product/list/price");
    },
    getListProductByType: (type) => {
        return axiosApi.get(`/product/list/type/${type}`);
    }
};

export default productApi;