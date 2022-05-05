import axios from 'axios';
import qs from 'qs';


const upLoadAxiosClient = axios.create({
  baseURL: 'http://viprestaurant.cf:8888',
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: (params) =>
    qs.stringify(params, { encodeValuesOnly: true }),
});

upLoadAxiosClient.interceptors.request.use((config) => {
  if (!!localStorage.getItem('token') || !!sessionStorage.getItem('token')) {
    config.headers = {
      token: `${localStorage.getItem('token') || sessionStorage.getItem('token')
        }`,
    };
  }
  return config;
});

upLoadAxiosClient.interceptors.response.use(
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
export default upLoadAxiosClient;
