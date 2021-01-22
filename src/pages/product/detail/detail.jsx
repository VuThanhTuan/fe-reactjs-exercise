/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prefer-stateless-function */
import React, { Component, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Slider from 'react-slick';
import BreadCrumb from '../../../components/BreadCrumb/BreadCrumb';
import path from '../../../constant/index';
import './detail.css';

const useStyles = makeStyles((theme) => ({
  button: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  root: {
    flexGrow: 1,
  },
}));
const images = [
  {
    photo: 'https://i.pinimg.com/originals/57/dc/69/57dc695c383af1aaf38798eaccceb4e5.jpg',
    label: 'image1',
  },
  {
    photo: 'https://i.pinimg.com/originals/57/dc/69/57dc695c383af1aaf38798eaccceb4e5.jpg',
    label: 'image2',
  },
];
const ProductDetail = () => {
  const classes = useStyles();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    slickNext: true,
    slickPrevious: true,
    swipe: true,
  };
  return (
    <div className={classes.root}>
      <BreadCrumb />
      <Grid className="single-product-content-left" container spacing={3}>
        <Grid item xs={6}>
          <Slider {...settings}>
            {images.map((step) => (
              <div key={step.label}>
                <img
                  src={step.photo}
                  alt={step.label}
                  style={{
                    height: '400px',
                    display: 'block',
                    overflow: 'hidden',
                    width: '100%',
                    outline: 'none',
                  }}
                />
              </div>
            ))}
          </Slider>
        </Grid>
        <Grid className="single-product-content-right" item xs={4}>
          <h3 className="product_title light">Doraemon</h3>
          <div className="divider" />
          <p className="price">100.000đ</p>
          <div className="product-type">
            <span className="label"><strong>Loại sản phẩm: </strong></span>
            <p> Áo</p>
          </div>
          <div className="product-category">
            <span className="label"><strong>Danh mục sản phẩm: </strong></span>
            <p> Áo thun nam</p>
          </div>
          <div className="product-category">
            <span className="label"><strong>Mô tả </strong></span>
          </div>
          <div className="description">
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odit, incidunt! Fugit hic id modi repudiandae debitis,
              maiores eius sapiente aut rem ab, iste molestiae numquam eveniet ut aperiam, illo molestias?
            </p>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductDetail;
