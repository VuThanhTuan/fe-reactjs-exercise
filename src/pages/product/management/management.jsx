/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import React, { Component, useEffect, useState } from 'react';
import './management.css';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {
  Link, NavLink, Route, Switch, useHistory,
} from 'react-router-dom';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import { FormikTextField, FormikSelectField, TextField } from 'formik-material-fields';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import MyForm from '../../../components/form/form';
import BreadCrumb from '../../../components/BreadCrumb/BreadCrumb';
import ListProduct from '../../../components/table/table';
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
  root: {
    flexGrow: 1,
    padding: '20px 20px',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));
const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));
const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});
function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const {
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
const validationSchema = Yup.object().shape({
  productName: Yup.string().required().matches(/^[a-zA-Z0-9]*$/, 'Only letters and numbers are accepted'),
  price: Yup.number().required().min(0),
  description: Yup.string().required().max(255).min(10),
  typeId: Yup.string().required(),
  categoryId: Yup.string().required(),
  avatar: Yup.string().required(),
});
const initialValues = {
  productName: '',
  price: '',
  typeId: '',
  description: '',
  categoryId: '',
  avatar: '',
};
const MyTextArea = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and also replace ErrorMessage entirely.
  const [field, meta] = useField(props);
  let style = {};
  if (meta.touched && meta.error) {
    style = {
      transform: 'scaleX(1)',
      transition: 'transform 200ms cubic - bezier(0.0, 0, 0.2, 1) 0ms',
      border: '2px solid #f44336',
    };
  }
  return (
    <>
      <label className="text-area-label" htmlFor={props.id || props.name}>{label}</label>
      <textarea style={style} className="text-area" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};
const ProductManagement = () => {
  const classes = useStyles();
  const classesTable = useStyles2();
  const [products, setProducts] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const history = useHistory();

  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };
  async function getProductData() {
    return API.getAll()
      .then((response) => {
        const { data } = response;
        setProducts(data.data);
      })
      .catch((e) => {
      });
  }
  const onSubmit = () => {

  };

  async function deleteProduct(id) {
    return API.deleteProduct(id)
      .then((res) => {
        getProductData();
      })
      .catch((e) => {
      });
  }

  async function updateProduct(id) {
    history.push(`/product/${id}`);
  }

  const rows = !products ? [] : products.sort((a, b) => (a.createAt < b.createAt ? -1 : 1));
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    getProductData();
  }, []);
  return (
    <div className="container">
      <BreadCrumb />
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={9} sm={9}>
            <div className="header-left">
              <h5>Danh sách sản phẩm</h5>
            </div>
            <div className="table">
              <TableContainer component={Paper}>
                <Table className={classesTable.table} aria-label="custom pagination table">
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell>Product name</TableCell>
                      <TableCell>Product code</TableCell>
                      <TableCell align="center">Category</TableCell>
                      <TableCell align="center">Price</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : rows
                    ).map((row, index) => (
                      // eslint-disable-next-line no-underscore-dangle
                      <TableRow key={row._id}>
                        <TableCell align="center">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          {row.productName}
                        </TableCell>
                        <TableCell>
                          {row.productCode}
                        </TableCell>
                        <TableCell align="right">
                          {row.categoryId}
                        </TableCell>
                        <TableCell align="right">
                          {row.price}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton color="primary" aria-label="detail" onClick={() => updateProduct(row._id)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="secondary" aria-label="delete" onClick={() => deleteProduct(row._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                        colSpan={6}
                        count={rows.length}
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
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </div>
          </Grid>
          <Grid item xs={3} sm={3}>
            <div className="header-right">
              <h5>Thêm sản phẩm</h5>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ isValid }) => (
                  <Form autoComplete="off">
                    <FormikTextField
                      name="productName"
                      label="Product Name"
                      margin="normal"
                      fullWidth
                    />
                    <Grid container spacing={3}>
                      <Grid item xs={6} className="select-type">
                        <FormikSelectField
                          name="typeId"
                          label="Type"
                          margin="normal"
                          options={[
                            { label: 'Male', value: 'male' },
                            { label: 'Female', value: 'female' },
                          ]}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6} className="select-category">
                        <FormikSelectField
                          name="categoryId"
                          label="Category"
                          margin="normal"
                          options={[
                            { label: 'Male', value: 'male' },
                            { label: 'Female', value: 'female' },
                          ]}
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                    <FormikTextField
                      name="price"
                      label="Price"
                      margin="normal"
                      fullWidth
                    />
                    <MyTextArea
                      label="Description"
                      name="description"
                      rows="6"
                      placeholder="Please enter description..."
                    />
                    <div className="upload">
                      <img src="" alt="" />
                      <input type="file" name="" id="upload" />
                      <label className="label-upload" htmlFor="upload">
                        <IconButton color="primary" aria-label="upload picture" component="span">
                          <PhotoCamera />
                        </IconButton>
                      </label>
                    </div>
                    <Button color="primary" variant="contained" fullWidth type="submit">
                      Add
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ProductManagement;
