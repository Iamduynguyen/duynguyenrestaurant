import axiosClient from "./axiosClient";

const TableAPI = {
    getAllTables: () => {
        const url = "/api/tables?start=1&end=1";
        return axiosClient.get(url);
    },
    getTableByTime: (data) => {
        const url = `/api/tables?start=${data}&end=${data}`;
        return axiosClient.get(url);
    },
    getTablesAvailable: () => {
        const url = "/api/tables/now";
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
};

export default TableAPI;