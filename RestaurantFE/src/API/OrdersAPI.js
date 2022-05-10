import axiosClient from "./axiosClient";

const OrdersAPI = {
    getAllOrders: () => {
        const url = "/api/orders";
        return axiosClient.get(url);
    },
    // getTableByTime: (data) => {
    //     const url = `/api/tables?time=${data}`;
    //     return axiosClient.get(url);
    // },
    deleteOrder: (data) => {
        const url = "/api/delete-all-details-ids";
        return axiosClient.post(url, data);
    },
    // updateTable: (id, table) => {
    //     const url = `/api/tables/${id}`;
    //     return axiosClient.put(url, table);
    // },
    // deleteTable: (id) => {
    //     const url = `/api/tables/${id}`;
    //     return axiosClient.delete(url);
    // },
};

export default OrdersAPI;