/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import React, {
  Component, useEffect, useState,
} from 'react';
import {
  useParams, useHistory, NavLink, Link,
} from 'react-router-dom';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { emphasize, withStyles, makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import HomeIcon from '@material-ui/icons/Home';
import Grid from '@material-ui/core/Grid';
import Slider from 'react-slick';
import BreadCrumb from '../../../components/BreadCrumb/BreadCrumb';
import path from '../../../constant/index';
import API from '../../../api/index';
import './detail.css';

const StyledBreadcrumb = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.grey[300],
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[300], 0.12),
    },
    cursor: 'pointer',
  },
}))(Chip);

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
    backgroundColor: '#fafafa',
    minHeight: '100vh',
  },
  imageSlide: {
    outline: 'none',
  },
}));
const ProductDetail = () => {
  const [product, setProduct] = useState();
  const [images, setImages] = useState([{ url: 'https://halotravel.vn/wp-content/uploads/2020/07/thach_trangg_101029297_573874646879779_1794923475739360981_n.jpg' }]);
  const { id } = useParams();
  const history = useHistory();
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
  function handleClick(event) {
    event.preventDefault();
  }
  useEffect(() => {
    return API.getByProductId(id)
      .then((res) => {
        res.data.data.images.push({ url: res.data.data.avatar });
        setProduct(res.data.data);
      })
      .catch((error) => {
        history.push('/notfound');
      });
  }, []);
  return (
    <div className={classes.root}>
      <Breadcrumbs aria-label="breadcrumb">
        <StyledBreadcrumb
          component="a"
          href="/home"
          label="Sản phẩm"
          icon={<HomeIcon fontSize="small" />}
        // onClick={handleClick}
        />
        <StyledBreadcrumb
          component="a"
          href="#"
          label="Thông tin sản phẩm"
          onClick={handleClick}
        />
      </Breadcrumbs>
      <Grid className="single-product-content-left" container spacing={3}>
        <Grid item xs={5}>
          <Slider {...settings}>
            {product?.images && product?.images?.map((step, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={index} style={classes.imageSlide}>
                <img
                  src={step.url}
                  style={{
                    display: 'block',
                    overflow: 'hidden',
                    width: '100%',
                    outline: 'none',
                    objectFit: 'cover',
                  }}
                />
              </div>
            ))}
          </Slider>
        </Grid>
        <Grid className="single-product-content-right" item xs={6}>
          <h3 className="product_title light">{product?.productName}</h3>
          <div className="divider" />
          <p className="price">{product?.price.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
          })}
          </p>
          <table>
            <tbody>
              <tr className="product-type">
                <td className="span-3"><span className="label"><strong>Loại sản phẩm: </strong></span></td>
                <td className="span-9"><p> {product?.categoryId.name}</p></td>
              </tr>
              <tr className="product-category">
                <td className="span-3"><span className="label"><strong>Danh mục sản phẩm: </strong></span></td>
                <td className="span-9"><p> {product?.typeId.name}</p></td>
              </tr>
            </tbody>
          </table>
          <div className="product-category">
            <span className="label"><strong>Mô tả </strong></span>
          </div>
          <div className="description">
            <p>{product?.description}</p>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductDetail;
