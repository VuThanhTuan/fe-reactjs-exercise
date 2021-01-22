/* eslint-disable import/extensions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import { FormikTextField, FormikSelectField, TextField } from 'formik-material-fields';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import './form.css';

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
class MyForm extends Component {
  render() {
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={this.props.onSubmit}
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
    );
  }
}

export default MyForm;
