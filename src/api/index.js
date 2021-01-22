/* eslint-disable arrow-body-style */
import http from '../utils/http-common';

const getAll = () => {
  return http.get('/product');
};

const getByProductId = (id) => {
  return http.get(`/product/${id}`);
};

const deleteProduct = (id) => {
  return http.delete(`/product/${id}`);
};

const updateProduct = (id) => {
  return http.put(`/product/${id}`);
};

const getProductByCategory = (categoryId) => {
  return http.get(`/product/${categoryId}`);
};

const getProductByType = (typeId) => {
  return http.get(`/product/${typeId}`);
};

const getAllType = () => {
  return http.get('/type');
};

const getAllCategory = () => {
  return http.get('/category');
};

const getCategoryByType = (typeId) => {
  return http.get(`/category/${typeId}`);
};

export default {
  getAll,
  getByProductId,
  deleteProduct,
  updateProduct,
  getProductByCategory,
  getProductByType,
  getAllType,
  getAllCategory,
  getCategoryByType,
};
