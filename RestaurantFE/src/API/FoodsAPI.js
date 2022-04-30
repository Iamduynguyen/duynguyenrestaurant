import axiosClient from "./axiosClient";

const FoodsApi = {
  getAllFoods: (params) => {
    const url = "/api/foods";
    return axiosClient.get(url, { params });
  },
  getFoodById: (id) => {
    const url = `/api/foods/${id}`;
    return axiosClient.get(url);
  },
  getPageFoods: () => {
    const url = `/api/foods/pages`;
    return axiosClient.get(url);
  },
  createFood: (food) => {
    const url = "/api/foods";
    return axiosClient.post(url, food);
  },
  updateFood: (id, food) => {
    const url = `/api/foods/${id}`;
    return axiosClient.put(url, food);
  },
  deleteFood: (id) => {
    const url = `/api/foods/${id}`;
    return axiosClient.delete(url);
  },
  updateFoodDetails: (id, food) => {
    const url = `/api/food-detalls/${id}`;
    return axiosClient.put(url, food);
  },
  createFoodDetail: (food) => {
    const url = `/api/food-detalls`;
    return axiosClient.post(url, food);
  },
  deleteFoodDetail: (id) => {
    const url = `/api/food-detalls/${id}`;
    return axiosClient.delete(url);
  },
  uploadImage: (formData) => {
    const url = `/api/food-medias/image/upload`;
    return axiosClient.post(url, formData, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
  },
  getAllFavouriteFood: (params) => {
    const url = "/api/customers/favourite-food";
    return axiosClient.get(url, { params });
  },
  addNewFavouriteFood: (data) => {
    const url = "/api/customers/favourite-food";
    return axiosClient.post(url, data);
  },
  deleteFavoriteFood: (data) => {
    const url = "/api/customers/favourite-food";
    return axiosClient.delete(url, data);
  },
};

export default FoodsApi;
