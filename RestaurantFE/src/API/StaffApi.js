import axiosClient from "./axiosClient";

const StaffAPi = {
    saveStaff: (data) => {
        const url = "/api/staff";
        return axiosClient.post(url, data);
    },
    getAllStaff: () => {
        const url = "/api/staff";
        return axiosClient.get(url);
    }
};

export default StaffAPi;