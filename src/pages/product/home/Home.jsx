/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prefer-stateless-function */
import React, { Component, useEffect, useState } from 'react';
import './Home.css';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import {
  Link, NavLink, Route, Switch,
} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import BreadCrumb from '../../../components/BreadCrumb/BreadCrumb';
import API from '../../../api/index';
import path from '../../../constant/index';

const useStyles = makeStyles((theme) => ({
  button: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));
const ProductHome = (match) => {
  const classes = useStyles();
  const [types, setType] = useState('');
  const [categories, setCategories] = useState('');
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  const handleChangeCategory = (event) => {
    setCategories(event.target.value);
  };

  async function getProductData() {
    return API.getAll()
      .then((response) => {
        const { data } = response;
        setProducts(data.data);
      })
      .catch((e) => {
        // console.log(e);
      });
  }

  function displayProducts() {
    const filteredProducts = products.filter((product) => product.productName.toLowerCase().includes(search.toLowerCase()));
    if (filteredProducts.length > 0) {
      return filteredProducts.map((product) => (
        <div id="item-card" data-text="Beats" key={product._id}>
          <Link to={path.DETAIL}>
            <div className="img-container">
              <img src={product.avatar} alt="" />
            </div>
          </Link>
          <div className="text-container">
            <span className="title">{product.productName}</span>
            <div className="price">
              {product.price.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              })}
            </div>
          </div>
        </div>
      ));
    }
    return <p className="not-found">Products not found!</p>;
  }
  function userSearch(event) {
    setSearch(event.target.value);
  }

  useEffect(() => {
    getProductData();
  }, []);
  return (
    <div className="container">
      <BreadCrumb />
      <div className="header">
        <div className="header-left">
          <h5>Danh sách sản phẩm</h5>
        </div>
        <div className="header-right">
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Types</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={types}
              onChange={handleChangeType}
            >
              <MenuItem value="Select All">Select All</MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Categories</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={categories}
              onChange={handleChangeCategory}
            >
              <MenuItem value="Select All">Select All</MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
          <input className="search-box" type="search" placeholder="Search..." onChange={userSearch} />
        </div>
      </div>
      <div className="product">
        <div className="product-card">
          {displayProducts()}
        </div>
      </div>
    </div>
  );
};

export default ProductHome;
