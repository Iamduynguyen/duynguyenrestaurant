import axios from 'axios';
import qs from 'qs';


const axiosClient = axios.create({
  baseURL: 'http://localhost:8787',
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: (params) =>
    qs.stringify(params, { encodeValuesOnly: true }),
});

axiosClient.interceptors.request.use((config) => {
  if (!!localStorage.getItem('token') || !!sessionStorage.getItem('token')) {
    config.headers = {
      token: `${localStorage.getItem('token') || sessionStorage.getItem('token')
        }`,
    };
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    console.error(error.response);
    return error.response;
  },
);
export default axiosClient;
