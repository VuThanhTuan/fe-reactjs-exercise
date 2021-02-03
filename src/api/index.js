/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable arrow-body-style */
import http from '../utils/http-common';

const getAll = (page, PAGE_SIZE) => {
  return http.get(`/product?page=${page}&PAGE_SIZE=${PAGE_SIZE}`);
};

const getAllProductSearch = (typeId, categoryId, keywords, page, PAGE_SIZE) => {
  return http.get(`/product?typeId=${typeId}&categoryId=${categoryId}&keywords=${keywords}&page=${page}&PAGE_SIZE=${PAGE_SIZE}`);
};

const createNewProduct = (data) => {
  return http.post('/product', data);
};

const getByProductId = (id) => {
  return http.get(`/product/${id}`);
};

const deleteProduct = (id) => {
  return http.delete(`/product/${id}`);
};

const updateProduct = (id, data) => {
  return http.put(`/product/${id}`, data);
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
  getAllProductSearch,
  createNewProduct,
};
