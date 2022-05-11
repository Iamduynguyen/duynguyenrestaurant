import axiosClient from "./axiosClient";

const OrdersAPI = {
    getAllOrders: () => {
        const url = "/api/orders";
        return axiosClient.get(url);
    },
    confirmOrder1: (id) => {
        const url = `/api/order-total/customer-confirm1/${id}`;
        return axiosClient.get(url);
    },
    confirmOrder2: (id) => {
        const url = `/api/order-total/staff-confirm2/${id}`;
        return axiosClient.get(url);
    },
    confirmOrder4: (id) => {
        const url = `/api/order-total/staff-confirm4/${id}`;
        return axiosClient.get(url);
    },
    confirmOrder6: (id) => {
        const url = `/api/order-total/staff-confirm6/${id}`;
        return axiosClient.get(url);
    },
    // deleteOrder: (data) => {
    //     const url = "/api/delete-all-details-ids";
    //     return axiosClient.post(url, data);
    // },
    // getTableByTime: (data) => {
    //     const url = `/api/tables?time=${data}`;
    //     return axiosClient.get(url);
    // },
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