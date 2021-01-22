/* eslint-disable react/no-this-in-sfc */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
import React, { Component, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import { FormikTextField, FormikSelectField, TextField } from 'formik-material-fields';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import BreadCrumb from '../../../components/BreadCrumb/BreadCrumb';
import API from '../../../api/index';
import './update.css';

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));
const validationSchema = Yup.object().shape({
  productName: Yup.string().required().matches(/^[a-zA-Z0-9]*$/, 'Only letters and numbers are accepted'),
  price: Yup.number().required().min(0),
  description: Yup.string().required().max(255).min(10),
  // typeId: Yup.string().required(),
  // categoryId: Yup.string().required(),
  avatar: Yup.string().required(),
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
const initialValues = {
  productName: 'Áo 3 lỗ',
  price: '1000000',
  typeId: 'Áo',
  description: 'Mlem Mlem...',
  categoryId: 'Áo thun',
  avatar: '',
};
const onSubmit = () => {

};
const UpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState();
  const classes = useStyles();
  async function getDetailProduct(productId) {
    return API.getByProductId(productId).then(
      (response) => {
        const { data } = response.data;
        setProduct(data);
      },
    ).catch((e) => {
    });
  }
  const productDetail = !product ? [] : product;
  useEffect(() => {
    getDetailProduct(id);
  }, []);
  return (
    <div className={classes.root}>
      <BreadCrumb />
      <Grid container spacing={3}>
        <Grid item xs={4}>
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
                <FormikTextField
                  name="productName"
                  label="Product Name"
                  margin="normal"
                  fullWidth
                />
                {/* <Grid container spacing={3}>
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
                      padding="12px 0"
                    />
                  </Grid>
                </Grid> */}
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
                  Save
                </Button>
              </Form>
            )}
          </Formik>
          )}
        </Grid>
        <Grid item xs={8}>
          <div className="header-right">
            <h5>Ảnh slide sản phẩm</h5>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default UpdateProduct;
