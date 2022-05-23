import axiosClient from "./axiosClient";

const CustomerApi = {
    getInfoCustomer: () => {
        const url = "/api/customer";
        return axiosClient.get(url);
    },
    saveInfoCustomer: (data) => {
        const url = "/api/customer";
        return axiosClient.post(url, data);
    },
    getListCustomer: () => {
        const url = "/api/customers";
        return axiosClient.get(url);
    },
    deleteCustomer: (id) => {
        const url = "/api/customer/" + id;
        return axiosClient.delete(url);
    },
    openCustomer: (id) => {
        const url = "/api/customer/unlock/" + id;
        return axiosClient.put(url);
    },
    updateInfoCustomer: (data) => {
        const url = "/api/customer";
        return axiosClient.put(url, data);
    },
};

export default CustomerApi;