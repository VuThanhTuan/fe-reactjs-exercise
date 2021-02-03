/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prefer-stateless-function */
import React, { Component, useEffect, useState } from 'react';
import './Home.css';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import {
  Link, NavLink, Route, Switch,
} from 'react-router-dom';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
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
const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));
function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const {
    // eslint-disable-next-line react/prop-types
    count, page, rowsPerPage, onChangePage,
  } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}
const ProductHome = () => {
  const classes = useStyles();
  const [typeId, setType] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categoryProduct, setCategoryProduct] = useState([]);
  const [typeProduct, setTypeProduct] = useState([{ name: 'select All', _id: '' }]);
  const [products, setProducts] = useState([]);
  const [keywords, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [totalItem, setTotalItem] = useState(0);
  let style = {};
  let disabled = true;

  async function getProductData() {
    return API.getAllProductSearch(typeId, categoryId, keywords, page, rowsPerPage)
      .then((response) => {
        const { data } = response;
        setProducts(data.data.data);
        setTotalItem(data.data.totalItem);
      })
      .catch((e) => {
      });
  }

  async function getTypeProducts() {
    return API.getAllType()
      .then((response) => {
        const { data } = response;
        data.data.push({ _id: '', name: 'select All' });
        setTypeProduct(data.data);
      })
      .catch((e) => {

      });
  }

  function displayProducts() {
    // const filteredProducts = products.filter((product) => product.productName.toLowerCase().includes(search.toLowerCase()));
    const filteredProducts = products.sort((a, b) => (a.createAt < b.createAt ? -1 : 1));
    if (filteredProducts.length > 0) {
      return filteredProducts.map((product) => (
        <div id="item-card" data-text="Beats" key={product._id}>
          {/* eslint-disable-next-line prefer-template */}
          <Link to={path.DETAIL + `/${product._id}`}>
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
      // eslint-disable-next-line no-else-return
    } else {
      style = {
        display: 'none',
      };
      return <p className="not-found">Không có sản phẩm bạn muốn tìm kiếm!</p>;
    }
  }

  function userSearch(event) {
    setPage(0);
    setSearch(event.target.value);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleChangeType = (event) => {
    setPage(0);
    setType(event.target.value);
    setCategoryId('');
    API.getCategoryByType(event.target.value)
      .then((response) => {
        const { data } = response;
        data.data.push({ name: 'select All', _id: '', typeId: '' });
        setCategoryProduct(data.data);
      })
      .catch((e) => { });
  };

  const handleChangeCategory = (event) => {
    setPage(0);
    setCategoryId(event.target.value);
  };
  if (typeId !== '') {
    disabled = false;
  }
  useEffect(() => {
    getTypeProducts();
    getProductData();
  }, [page, rowsPerPage, typeId, categoryId, keywords]);
  return (
    <div className="container">
      <BreadCrumb name="sản phẩm" />
      <div className="header">
        <div className="header-left">
          <h5>Danh sách sản phẩm</h5>
        </div>
        <div className="header-right">
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Loại</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={typeId || ''}
              onChange={handleChangeType}
            >
              {typeProduct?.map((type) => <MenuItem key={type._id} value={type?._id || ''}>{type.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Danh mục</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={categoryId || ''}
              onChange={handleChangeCategory}
              disabled={disabled}
            >
              {categoryProduct?.map((category) => <MenuItem key={category._id} value={category?._id || ''}>{category.name}</MenuItem>)}
            </Select>
          </FormControl>
          <input className="search-box" type="search" placeholder="Tìm kiếm..." onChange={userSearch} />
        </div>
      </div>
      <div className="product">
        <div className="product-card">
          {displayProducts()}
        </div>
      </div>
      <div className="pagination" style={style}>
        <table>
          <tfoot>
            <tr>
              <TablePagination
                rowsPerPageOptions={[4, 8, 12, 16, 24, 28]}
                // colSpan={6}
                count={totalItem}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ProductHome;
