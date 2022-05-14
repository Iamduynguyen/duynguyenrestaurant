import axiosClient from "./axiosClient";

const CustomerApi = {
    getInfoCustomer: () => {
        const url = "/api/customer";
        return axiosClient.get(url);
    },
    saveInfoCustomer: (data) => {
        const url = "/api/customer";
        return axiosClient.post(url, data);
    }
};

export default CustomerApi;