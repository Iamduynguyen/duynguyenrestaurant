import axiosClient from "./axiosClient";

const TableAPI = {
    getAllTables: () => {
        const url = "/api/tables";
        return axiosClient.get(url);
    },
    getTableByTime: (data) => {
        const url = `/api/tables?time=${data}`;
        return axiosClient.get(url);
    },
    createTable: (table) => {
        const url = "/api/tables";
        return axiosClient.post(url, table);
    },
    updateTable: (id, table) => {
        const url = `/api/tables/${id}`;
        return axiosClient.put(url, table);
    },
    deleteTable: (id) => {
        const url = `/api/tables/${id}`;
        return axiosClient.delete(url);
    },
    getInfoTableById: (id) => {
        const url = `/api/table-orders/${id}`;
        return axiosClient.get(url);
    },
};

export default TableAPI;