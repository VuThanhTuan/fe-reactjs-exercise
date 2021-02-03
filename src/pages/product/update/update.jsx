/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unused-vars */
import React, { Component, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { emphasize, withStyles, makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import HomeIcon from '@material-ui/icons/Home';
import Grid from '@material-ui/core/Grid';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import { FormikTextField, FormikSelectField, TextField } from 'formik-material-fields';
import Button from '@material-ui/core/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';
import { serialize } from 'object-to-formdata';
import API from '../../../api/index';
import './update.css';

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
  root: {
    flexGrow: 1,
    background: '#fafafa',
  },
}));
const validationSchema = Yup.object().shape({
  productName: Yup.string().trim().required('Không được để trống tên sản phẩm')
    .min(5, 'Tên sản phẩm quá ngắn')
    .max(20, 'Tên sản phẩm quá dài'),
  price: Yup.number('Nhập sai định dạng').typeError('Nhập sai định dạng')
    .required('Không được để trống')
    .min(0, 'Giá phải lớn hơn 0'),
  description: Yup.string().max(1000, 'Mô tả quá dài!').min(10, 'Mô tả quá ngắn'),
  typeId: Yup.string().required('Không được để trống loại sản phẩm'),
  categoryId: Yup.string().required('Không được để trống danh mục sản phẩm'),
  // file: Yup.mixed().required('Không được để trống ảnh đại diện sản phẩm'),
});
const MyTextArea = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and alse replace ErrorMessage entirely.
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
const UpdateProduct = () => {
  const { id } = useParams();
  const history = useHistory();
  const [product, setProduct] = useState();
  const [viewImage, setViewImage] = useState(false);
  const [viewImageSlide, setViewImageSlide] = useState({ index: '', isShow: false });
  const [listImgView, setListImgView] = useState([
    { url: null },
    { url: null },
    { url: null },
    { url: null },
    { url: null },
  ]);
  const [typeId, setTypeId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [optionType, setOptionType] = useState([]);
  const [optionCategory, setOptionCategory] = useState([]);
  const [description, setDescription] = useState('');
  const [listImage, setListImage] = useState([null, null, null, null, null]);
  const classes = useStyles();
  let disabled = true;
  if (typeId !== '') {
    disabled = false;
  }
  // exit view image
  async function exit() {
    setViewImage(false);
    setViewImageSlide({ name: '', isShow1: false }, { name: '', isShow2: false }, { name: '', isShow3: false }, { name: '', isShow4: false });
  }
  // setState view image avatar
  async function view() {
    setViewImage(true);
  }
  // setState view image slide
  async function viewImgSlide(i, name) {
    setViewImageSlide({ index: i, isShow: true });
  }
  // setState delete image view
  async function deleteImg(index, name) {
    listImgView[index].url = null;
    setListImgView([...listImgView]);
  }
  // get All type product
  async function getTypeProducts() {
    return API.getAllType()
      .then((response) => {
        const { data } = response;
        const ListType = [];
        data.data.forEach((item) => {
          ListType.push({ label: item.name, value: item._id });
        });
        setOptionType(ListType);
      })
      .catch((e) => {

      });
  }
  // get category by type product
  async function getCategoryByTypeId(idType) {
    return API.getCategoryByType(idType)
      .then((res) => {
        const { data } = res;
        const ListCategory = [];
        data.data.forEach((item) => {
          ListCategory.push({ label: item.name, value: item._id });
        });
        setOptionCategory(ListCategory);
      })
      .catch((e) => { });
  }
  // get information detail product
  async function getDetailProduct(productId) {
    return API.getByProductId(productId).then(
      (response) => {
        const { data } = response.data;
        getCategoryByTypeId(data.typeId._id);
        setProduct({
          productName: data.productName,
          price: data.price,
          description: data.description,
          typeId: data.typeId._id,
          categoryId: data.categoryId._id,
          avatar: data.avatar,
          images: data.images,
        });
        if (data.images.length > 0) {
          data.images.forEach((image) => {
            listImgView[image.index].url = image.url;
          });
        } else {
          setListImgView([
            { url: null },
            { url: null },
            { url: null },
            { url: null },
            { url: null },
          ]);
        }
        setDescription(data.description);
      },
    ).catch((e) => {
      history.push('/notfound');
    });
  }
  // submit data to update product
  const onSubmit = () => {
    const productUpdate = {
      productName: product.productName,
      price: product.price,
      description: product.description,
      typeId: product.typeId,
      categoryId: product.categoryId,
    };
    const listIndex = [];
    const listIndexDelete = [];
    const formData = serialize(
      productUpdate,
    );

    if (!listImage.every((each) => !each)) {
      listImage.forEach((image, index) => {
        if (image !== null && image !== '' && index < 4) {
          formData.append('multi-files', image);
          listIndex.push(index);
        }
        if (index === 4 && image !== null && image !== '') {
          formData.append('avatar', image);
          listIndex.push(4);
        }
      });
      formData.append('listIndex', JSON.stringify(listIndex));
    }
    for (let indexDelete = 0; indexDelete < listImgView.length - 1; indexDelete += 1) {
      if (!listImgView[indexDelete].url) {
        listIndexDelete.push(indexDelete);
      }
    }
    formData.append('listDeleteImageIndex', JSON.stringify(listIndexDelete));
    API.updateProduct(id, formData)
      .then((res) => {
        toast.success('Cập nhật thành công sản phẩm!', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        getDetailProduct(id);
      })
      .catch((error) => {
        const message = error.response.data.code === 11000 ? 'Tên sản phẩm đã được sử dụng' : 'Có lỗi khi cập nhật sản phẩm';
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
  // change image slide
  const handleChangeImages = (event, index) => {
    listImage[index] = event.target.files[0];
    listImgView[index].url = URL.createObjectURL(event.target.files[0]);
    setListImgView([...listImgView]);
    setListImage([...listImage]);
  };
  // change data (name,price)
  const handleChangeData = (event) => {
    setProduct({ ...product, [event.target.name]: event.target.value });
  };
  // change description
  const onChangeDescription = (event) => {
    setDescription(event.target.value);
    setProduct({ ...product, [event.target.name]: event.target.value });
  };
  // change type product
  const handleChangeType = (event) => {
    setTypeId(event.target.value);
    // setCategoryId('');
    setProduct({ ...product, [event.target.name]: event.target.value });
    API.getCategoryByType(event.target.value)
      .then((response) => {
        const { data } = response;
        const ListCategory = [];
        data.data.forEach((item) => {
          ListCategory.push({ label: item.name, value: item._id });
        });
        setOptionCategory(ListCategory);
      })
      .catch((e) => { });
  };
  // change category product
  const handleChangeCategory = (event) => {
    setCategoryId(event.target.value);
    setProduct({ ...product, [event.target.name]: event.target.value });
  };

  function handleClick(event) {
    event.preventDefault();
  }
  useEffect(() => {
    getDetailProduct(id);
  }, []);
  useEffect(() => {
    getTypeProducts();
  }, []);
  return (
    <div className={classes.root}>
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
      <Breadcrumbs aria-label="breadcrumb">
        <StyledBreadcrumb
          component="a"
          href="/product"
          label="Quản lý sản phẩm"
          icon={<HomeIcon fontSize="small" />}
        />
        <StyledBreadcrumb
          component="a"
          href="#"
          label="Chi tiết sản phẩm"
          onClick={handleClick}
        />
      </Breadcrumbs>
      <Grid container spacing={3}>
        <Grid item sm={4} className="content">
          <div className="header-left">
            <h5>Thông tin sản phẩm</h5>
          </div>
          {product && (
            <Formik
              initialValues={product}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ values, isValid }) => (
                <Form>
                  <div className="upload upload-avatar update-avatar">
                    <img className="image-avatar image-avatar-update" src={listImgView[4]?.url || product?.avatar} alt="" />
                    <label className="label-upload label-upload-avatar" htmlFor="upload">
                      <IconButton className="btn-change" color="primary" aria-label="upload picture" component="span">
                        <InsertPhotoOutlinedIcon />
                      </IconButton>
                    </label>
                    <div className="label-upload view-image">
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
                    onChange={(e) => handleChangeImages(e, 4)}
                  />
                  <FormikTextField
                    name="productName"
                    label="Tên sản phẩm"
                    onChange={handleChangeData}
                    margin="normal"
                    fullWidth
                  />
                  <Grid container spacing={3}>
                    <Grid item xs={6} className="select-type">
                      <FormikSelectField
                        name="typeId"
                        label="Loại"
                        margin="normal"
                        onChange={handleChangeType}
                        options={optionType}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6} className="select-category">
                      <FormikSelectField
                        name="categoryId"
                        label="Danh mục"
                        margin="normal"
                        onChange={handleChangeCategory}
                        options={optionCategory}
                        fullWidth
                        padding="12px 0"
                      // disabled={disabled}
                      />
                    </Grid>
                  </Grid>
                  <FormikTextField
                    name="price"
                    label="Giá"
                    margin="normal"
                    onChange={handleChangeData}
                    fullWidth
                  />
                  <MyTextArea
                    label="Mô tả"
                    name="description"
                    value={description}
                    rows="6"
                    onChange={onChangeDescription}
                    placeholder="Nhập mô tả..."
                  />
                  <Button color="primary" variant="contained" fullWidth type="submit">
                    Lưu
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </Grid>
        <Grid className="slide-images content" item sm={7}>
          <div className="header-right">
            <h5>Ảnh slide sản phẩm</h5>
          </div>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <div className="upload upload-image-slides">
                <img src={listImgView[0]?.url || null} className="image-slide-item" alt="" />
                <label style={listImgView[0]?.url ? { display: 'none' } : null} className="label-upload label-upload-image-slides" htmlFor="upload0">
                  <IconButton color="primary" aria-label="upload picture" component="span">
                    <PhotoCamera />
                  </IconButton>
                </label>
                <input
                  name="file1"
                  type="file"
                  id="upload0"
                  accept="image/png, image/jpg, image/jpeg"
                  onChange={(e) => handleChangeImages(e, 0)}
                />
                <div style={!listImgView[0]?.url ? { display: 'none' } : null} className="label-upload delete-image">
                  <IconButton color="secondary" className="btn-delete" aria-label="delete" onClick={() => deleteImg(0, 'file1')}>
                    <DeleteIcon />
                  </IconButton>
                </div>
                <div style={!listImgView[0]?.url ? { display: 'none' } : null} className="label-upload view-image">
                  <IconButton className="btn-view" color="primary" aria-label="upload picture" component="span" onClick={() => viewImgSlide(0, 'file1')}>
                    <VisibilityOutlinedIcon />
                  </IconButton>
                </div>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="upload upload-image-slides">
                <img src={listImgView[1]?.url || null} className="image-slide-item" alt="" />
                <label style={listImgView[1]?.url ? { display: 'none' } : null} className="label-upload label-upload-image-slides" htmlFor="upload1">
                  <IconButton color="primary" aria-label="upload picture" component="span">
                    <PhotoCamera />
                  </IconButton>
                </label>
                <input
                  name="file2"
                  type="file"
                  id="upload1"
                  accept="image/png, image/jpg, image/jpeg"
                  onChange={(e) => handleChangeImages(e, 1)}
                />
                <div style={!listImgView[1]?.url ? { display: 'none' } : null} className="label-upload delete-image">
                  <IconButton color="secondary" className="btn-delete" aria-label="delete" onClick={() => deleteImg(1, 'file2')}>
                    <DeleteIcon />
                  </IconButton>
                </div>
                <div style={!listImgView[1]?.url ? { display: 'none' } : null} className="label-upload view-image">
                  <IconButton className="btn-view" color="primary" aria-label="upload picture" component="span" onClick={() => viewImgSlide(1, 'file2')}>
                    <VisibilityOutlinedIcon />
                  </IconButton>
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <div className="upload upload-image-slides">
                <img src={listImgView[2]?.url || null} className="image-slide-item" alt="" />
                <label style={listImgView[2]?.url ? { display: 'none' } : null} className="label-upload label-upload-image-slides" htmlFor="upload2">
                  <IconButton color="primary" aria-label="upload picture" component="span">
                    <PhotoCamera />
                  </IconButton>
                </label>
                <input
                  name="file3"
                  type="file"
                  id="upload2"
                  accept="image/png, image/jpg, image/jpeg"
                  onChange={(e) => handleChangeImages(e, 2)}
                />
                <div style={!listImgView[2]?.url ? { display: 'none' } : null} className="label-upload delete-image">
                  <IconButton color="secondary" className="btn-delete" aria-label="delete" onClick={() => deleteImg(2, 'file3')}>
                    <DeleteIcon />
                  </IconButton>
                </div>
                <div style={!listImgView[2]?.url ? { display: 'none' } : null} className="label-upload view-image">
                  <IconButton className="btn-view" color="primary" aria-label="upload picture" component="span" onClick={() => viewImgSlide(2, 'file3')}>
                    <VisibilityOutlinedIcon />
                  </IconButton>
                </div>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="upload upload-image-slides">
                <img src={listImgView[3]?.url || null} className="image-slide-item" alt="" />
                <label style={listImgView[3]?.url ? { display: 'none' } : null} className="label-upload label-upload-image-slides" htmlFor="upload3">
                  <IconButton color="primary" aria-label="upload picture" component="span">
                    <PhotoCamera />
                  </IconButton>
                </label>
                <input
                  name="file4"
                  type="file"
                  id="upload3"
                  accept="image/png, image/jpg, image/jpeg"
                  onChange={(e) => handleChangeImages(e, 3)}
                />
                <div style={!listImgView[3]?.url ? { display: 'none' } : null} className="label-upload delete-image">
                  <IconButton color="secondary" className="btn-delete" aria-label="delete" onClick={() => deleteImg(3, 'file4')}>
                    <DeleteIcon />
                  </IconButton>
                </div>
                <div style={!listImgView[3]?.url ? { display: 'none' } : null} className="label-upload view-image">
                  <IconButton className="btn-view" color="primary" aria-label="upload picture" component="span" onClick={() => viewImgSlide(3, 'file4')}>
                    <VisibilityOutlinedIcon />
                  </IconButton>
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <div style={viewImage ? null : { display: 'none' }} className="modal-view-image">
        {/* eslint-disable-next-line react/button-has-type */}
        <button className="close" onClick={() => exit()}>&times; </button>
        <img src={listImgView[4]?.url || product?.avatar} alt="" className="modal-view-image-content" />
      </div>
      <div style={viewImageSlide.isShow ? null : { display: 'none' }} className="modal-view-image">
        {/* eslint-disable-next-line react/button-has-type */}
        <button className="close" onClick={() => exit()}>&times; </button>
        <img src={listImgView[viewImageSlide.index]?.url} alt="" className="modal-view-image-content" />
      </div>
    </div>
  );
};

export default UpdateProduct;
