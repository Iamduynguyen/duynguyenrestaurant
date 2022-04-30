import axiosClient from './axiosClient';

const CategoryAPI = {
  getAllCategories: () => {
    const url = '/api/categories';
    return axiosClient.get(url);
  },
  createCategory: (category) => {
    const url = '/api/categories';
    return axiosClient.post(url, category);
  },
  deleteCategory: (id) => {
    const url = `/api/categories/${id}`;
    return axiosClient.delete(url);
  },
  updateCategory: (id, category) => {
    const url = `/api/categories/${id}`;
    return axiosClient.put(url, category);
  },
};

export default CategoryAPI;
