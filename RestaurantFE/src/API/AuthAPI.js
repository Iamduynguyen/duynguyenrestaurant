import axiosClient from './axiosClient';

const AuthAPI = {
  login: (user) => {
    const url = '/service/signin';
    return axiosClient.post(url, user);
  },
  register: (user) => {
    const url = '/service/register';
    return axiosClient.post(url, user);
  },
  changePassword: (data) => {
    const url = '/service/change-password';
    return axiosClient.post(url, data);
  },
};

export default AuthAPI;
