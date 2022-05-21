import axiosClient from "./axiosClient";

const StaffAPi = {
    saveStaff: (data) => {
        const url = "/api/staff";
        return axiosClient.post(url, data);
    },
    getAllStaff: () => {
        const url = "/api/staff";
        return axiosClient.get(url);
    },
    getStaff: (id) => {
        const url = `/api/staff/${id}`;
        return axiosClient.get(url);
    },
    updateStaff: (id, data) => {
        const url = `/api/staff/${id}`;
        return axiosClient.put(url, data);
    },
    deleteStaff: (id) => {
        const url = `/api/staff/${id}`;
        return axiosClient.delete(url);
    }
};

export default StaffAPi;