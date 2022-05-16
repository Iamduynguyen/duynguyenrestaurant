import axiosClient from "./axiosClient";

const OrdersAPI = {
    /**
     * Orders
     */
    getAllOrders: () => {
        const url = "/api/orders";
        return axiosClient.get(url);
    },
    confirmOrder1: (id) => {
        const url = `/api/order-total/customer-confirm1/${id}`;
        return axiosClient.get(url);
    },
    // status 1 => 2
    staffConfirmOrderOnline: (id) => {
        const url = `/api/confirm-order-online/${id}`;
        return axiosClient.put(url);
    },
    // status 3 => 4
    staffConfirmDepositOnline: (data) => {
        const url = `/api/confirm-deposit-online`;
        return axiosClient.post(url, data);
    },
    // status 5 => 6
    staffConfirmPayment: (data) => {
        const url = `/api/payment-order`;
        return axiosClient.post(url, data);
    },
    // status => -1
    deleteOrder: (id) => {
        const url = `/api/cancel-order/${id}`;
        return axiosClient.put(url);
    },
    // createNewOrder
    createOrder: (data) => {
        const url = `/api/create-order-couter`;
        return axiosClient.post(url, data);
    },
    // add food to exist order
    addFoodOrder: (data) => {
        const url = `/api/add-order-details`;
        return axiosClient.post(url, data);
    },

    /**
     * OrderDetails
     */
    // add qty orderDetail
    addQty: (data) => {
        const url = `/api/add-order-details`;
        return axiosClient.post(url, data);
    },
    // remove qty orderDetail
    removeQty: (data) => {
        const url = `/api/edit-order-details`;
        return axiosClient.post(url, data);
    },
    // remove orderDetail by ids
    deleteOrderDetails: (data) => {
        const url = `/api/delete-all-details-ids`;
        return axiosClient.post(url, data);
    },
};

export default OrdersAPI;