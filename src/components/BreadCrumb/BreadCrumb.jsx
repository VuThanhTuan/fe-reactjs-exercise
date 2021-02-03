/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prefer-stateless-function */
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import React from 'react';
import { emphasize, withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { NavLink, Link } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import ListIcon from '@material-ui/icons/List';
import ViewListIcon from '@material-ui/icons/ViewList';
import './BreadCrumb.css';
import { object } from 'yup/lib/locale';

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
  },
}))(Chip);

function handleClick(event) {
  event.preventDefault();
}
class BreadCrumb extends React.Component {
  render() {
    // eslint-disable-next-line react/prop-types
    const { name } = this.props;
    return (
      <Breadcrumbs aria-label="breadcrumb">
        <StyledBreadcrumb
          component="a"
          href="#"
          label={name}
          icon={<HomeIcon fontSize="small" />}
          onClick={handleClick}
        />
        <StyledBreadcrumb
          component="a"
          href="#"
          label="Danh sách sản phẩm"
          icon={<ViewListIcon fontSize="small" />}
          onClick={handleClick}
        />
      </Breadcrumbs>
    );
  }
}

export default BreadCrumb;
