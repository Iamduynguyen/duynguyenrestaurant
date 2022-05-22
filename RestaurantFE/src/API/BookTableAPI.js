import axiosClient from "./axiosClient";

const BookTableAPI = {
  getBookTableById: (id) => {
    const url = `/api/table-orders/${id}`;
    return axiosClient.get(url);
  },
  bookTable: (data) => {
    const url = `/api/table-orders`;
    return axiosClient.post(url, data);
  },
  ordersDetails: (data) => {
    const url = `/api/order-details`;
    return axiosClient.post(url, data);
  },
  getUserBookTable: () => {
    const url = `/api/table-orders/customer`;
    return axiosClient.get(url);
  },
  changeStatusOrder: (id, data) => {
    const url = `/api/order-details/${id}`;
    return axiosClient.put(url, data);
  },
  getTotalByWeek: (month, year) => {
    const url = `/api/revenue?week=1&month=${month}&year=${year}`;
    return axiosClient.get(url);
  },
  getTotalByYear: (year) => {
    const url = `/api/revenue?year=${year}`;
    return axiosClient.get(url);
  },
  getInforOrder: (id) => {
    const url = `api/order-totals-status/${id}`;
    return axiosClient.get(url);
  },
  getInforThanhtoan: (id) => {
    const url = `api/order-totals-thanhtoan/${id}`;
    return axiosClient.get(url);
  },
};

export default BookTableAPI;
