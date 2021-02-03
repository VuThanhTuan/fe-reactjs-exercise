/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
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
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import { FormikTextField, FormikSelectField, TextField } from 'formik-material-fields';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';
import Swal from 'sweetalert2';
import { serialize } from 'object-to-formdata';
import BreadCrumb from '../../../components/BreadCrumb/BreadCrumb';
import API from '../../../api/index';

// style for child elements
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
    padding: '8px 20px',
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
// pagination component
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
const FILE_SIZE = 1 * 1024 * 1024;
const SUPPORTED_FORMATS = [
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/png',
];
// validation form
const validationSchema = Yup.object().shape({
  productName: Yup.string().required('Không được để trống tên sản phẩm')
    .min(5, 'Tên sản phẩm quá ngắn')
    .max(20, 'Tên sản phẩm quá dài')
    .trim(),
  price: Yup.number('Nhập sai định dạng').typeError('Nhập sai định dạng')
    .required('Không được để trống')
    .min(0, 'Giá phải lớn hơn 0'),
  description: Yup.string().max(500, 'Mô tả quá dài!').min(10, 'Mô tả quá ngắn'),
  typeId: Yup.string().required('Không được để trống loại sản phẩm'),
  categoryId: Yup.string().required('Không được để trống danh mục sản phẩm'),
  // file: Yup.mixed().required('Không được để trống ảnh đại diện sản phẩm'),
  file: Yup.mixed()
    .test('fileSize', 'Kích thước ảnh quá lớn!', (value) => value && value.size <= FILE_SIZE)
    .test('fileType', 'Chỉ được gửi ảnh với kích thước nhỏ!', (value) => {
      SUPPORTED_FORMATS.includes(value.type);
    }),
});
const initialValues = {
  productName: '',
  price: '',
  typeId: '',
  description: '',
  categoryId: '',
  file: '',
};
// text area component
// eslint-disable-next-line react/prop-types
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
      {/* eslint-disable-next-line react/prop-types */}
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
  const [typeId, setType] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [products, setProducts] = useState();
  const [optionType, setOptionType] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [description, setDescription] = useState('');
  const [optionCategory, setOptionCategory] = useState([{ label: '', value: '' }]);
  const [newProduct, setNewProduct] = useState(initialValues);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItem, setTotalItem] = useState(0);
  const [viewImage, setViewImage] = useState(false);
  const history = useHistory();
  let disabled = true;
  // style for image when have image
  let style = {};
  let styleButtonImage = {};
  let styleDivUpload = {};
  if (!avatar) {
    style = {
      display: 'none',
    };
    styleDivUpload = {
      zIndex: '0',
    };
    styleButtonImage = {
      opacity: '1',
    };
  }
  // exit view avatar
  async function exit() {
    setViewImage(false);
  }
  // view avatar
  async function view() {
    setViewImage(true);
  }
  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };
  // get data products
  async function getProductData() {
    return API.getAll(page, rowsPerPage)
      .then((response) => {
        const { data } = response;
        setProducts(data.data.data);
        setTotalItem(data.data.totalItem);
      })
      .catch((e) => {
      });
  }
  // get all type product
  async function getTypeProducts() {
    return API.getAllType()
      .then((response) => {
        const { data } = response;
        const ListType = [];
        data.data.forEach((item, index) => {
          ListType.push({ label: item.name, value: item._id });
        });
        setOptionType(ListType);
      })
      .catch((e) => {

      });
  }
  // clear form data
  async function clearForm() {
    window.location.reload();
  }
  // submit data to create product
  const onSubmit = () => {
    const formData = serialize(
      newProduct,
    );
    API.createNewProduct(formData)
      .then((response) => {
        toast.success('Tạo thành công sản phẩm!', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        getProductData();
      })
      .catch((error) => {
        const message = error.response.data.message === 'this name product has been using' ? 'Tên sản phẩm đã được sử dụng' : 'Xảy ra lỗi khi tạo sản phẩm';
        toast.error(message, {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      });
  };
  // delete a product
  async function deleteProduct(id) {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa không?',
      // text: 'Bạn sẽ không thể hoàn tác!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa!',
      cancelButtonText: 'Hủy',
      // eslint-disable-next-line consistent-return
    }).then((result) => {
      if (result.isConfirmed) {
        API.deleteProduct(id)
          .then((res) => {
            Swal.fire(
              'Xóa thành công sản phẩm!',
            );
            getProductData();
            if (products.length === 1 && page >= 1) {
              setPage(page - 1);
            }
          })
          .catch((e) => {
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Sản phẩm được giữ',
        );
      }
    });
  }
  // navigate to page update product
  async function updateProduct(id) {
    history.push(`/product/${id}`);
  }
  // handle change page at pagination
  const handleChangePage = (event, newPage) => {
    setRowsPerPage(rowsPerPage);
    setPage(newPage);
  };
  // handle change number of record in pagination
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // change type product in form
  const handleChangeType = (event) => {
    setType(event.target.value);
    setNewProduct({ ...newProduct, [event.target.name]: event.target.value });
    API.getCategoryByType(event.target.value)
      .then((response) => {
        const { data } = response;
        const ListCategory = [];
        data.data.forEach((item, index) => {
          ListCategory.push({ label: item.name, value: item._id });
        });
        setOptionCategory(ListCategory);
      })
      .catch((e) => { });
  };
  // change description in form
  const onChangeDescription = (event) => {
    setDescription(event.target.value);
    setNewProduct({ ...newProduct, [event.target.name]: event.target.value });
  };
  // change data in form (price,name)
  const onChange = (event) => {
    setNewProduct({ ...newProduct, [event.target.name]: event.target.value });
  };
  // change avatar in form
  const onChangeAvatar = (event) => {
    setNewProduct({ ...newProduct, [event.target.name]: event.target.files[0] });
    setAvatar(URL.createObjectURL(event.target.files[0]));
  };
  // change category in form
  const handleChangeCategory = (event) => {
    setCategoryId(event.target.value);
    setNewProduct({ ...newProduct, [event.target.name]: event.target.value });
  };
  // disable select category if do not select type product
  if (typeId !== '') {
    disabled = false;
  }
  useEffect(() => {
    getTypeProducts();
    getProductData();
  }, [rowsPerPage, page]);
  return (
    <div className="container">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
      />
      <BreadCrumb name="Quản lý sản phẩm" />
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={8} sm={9} className="content">
            <div className="header-left">
              <h5>Danh sách sản phẩm</h5>
            </div>
            <div className="table">
              <TableContainer component={Paper}>
                <Table className={classesTable.table} aria-label="custom pagination table">
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell>Tên sản phẩm</TableCell>
                      <TableCell>Mã sản phẩm</TableCell>
                      <TableCell>Danh mục</TableCell>
                      <TableCell align="center">Giá</TableCell>
                      <TableCell align="center">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products && products.map((productItem, index) => (
                      <TableRow key={productItem._id}>
                        <TableCell align="center">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          {productItem.productName}
                        </TableCell>
                        <TableCell>
                          {productItem.productCode}
                        </TableCell>
                        <TableCell>
                          {productItem.categoryId.name}
                        </TableCell>
                        <TableCell align="right">
                          {productItem.price}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton color="primary" className="button-table" aria-label="detail" onClick={() => updateProduct(productItem._id)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="secondary" className="button-table" aria-label="delete" onClick={() => deleteProduct(productItem._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: totalItem }]}
                        colSpan={6}
                        count={totalItem}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                          key: 5,
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
          <Grid item xs={4} sm={3} className="content">
            <div className="header-right">
              <h5>Thêm sản phẩm</h5>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ isValid, values }) => (
                  <Form autoComplete="off">
                    <FormikTextField
                      name="productName"
                      label="Tên sản phẩm"
                      margin="normal"
                      fullWidth
                      onChange={onChange}
                    />
                    <Grid container spacing={3}>
                      <Grid item xs={6} className="select-type">
                        <FormikSelectField
                          name="typeId"
                          label="Loại"
                          margin="normal"
                          options={optionType}
                          onChange={handleChangeType}
                          key={optionType.value}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6} className="select-category">
                        <FormikSelectField
                          key={optionCategory.value}
                          name="categoryId"
                          label="Danh mục"
                          margin="normal"
                          onChange={handleChangeCategory}
                          options={optionCategory}
                          fullWidth
                          disabled={disabled}
                        />
                      </Grid>
                    </Grid>
                    <FormikTextField
                      name="price"
                      label="Giá"
                      margin="normal"
                      onChange={onChange}
                      fullWidth
                    />
                    <MyTextArea
                      label="Mô tả"
                      name="description"
                      rows="6"
                      value={description}
                      onChange={onChangeDescription}
                      placeholder="Nhập mô tả..."
                    />
                    <div style={styleDivUpload} className="upload upload-avatar add-avatar">
                      <img style={style} className="image-avatar image-avatar-upload" src={avatar && avatar} alt="" />
                      <label style={styleButtonImage} className="label-upload label-upload-avatar label-add-avatar" htmlFor="upload">
                        <IconButton className="btn-change btn-add" color="primary" aria-label="upload picture" component="span">
                          <InsertPhotoOutlinedIcon />
                        </IconButton>
                      </label>
                      <div className="label-upload view-image" style={style}>
                        <IconButton className="btn-view" color="primary" aria-label="upload picture" component="span" onClick={() => view()}>
                          <VisibilityOutlinedIcon />
                        </IconButton>
                      </div>
                    </div>
                    <FormikTextField
                      name="file"
                      type="file"
                      id="upload"
                      accept="image/png, image/jpg, image/jpeg"
                      onChange={onChangeAvatar}
                    />
                    <div className="button">
                      <Button className="btn-submit" color="primary" variant="contained" type="submit">
                        Thêm
                      </Button>
                      <Button className="btn-submit" color="secondary" variant="contained" onClick={() => clearForm()}>
                        Đặt lại
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </Grid>
        </Grid>
      </div>
      <div style={viewImage ? null : { display: 'none' }} className="modal-view-image">
        {/* eslint-disable-next-line react/button-has-type */}
        <button className="close" onClick={() => exit()}>&times; </button>
        <img src={avatar && avatar} alt="" className="modal-view-image-content" />
      </div>
    </div>
  );
};

export default ProductManagement;
