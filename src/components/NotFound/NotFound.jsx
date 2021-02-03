/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { emphasize, withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { NavLink, Link } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import ListIcon from '@material-ui/icons/List';
import ViewListIcon from '@material-ui/icons/ViewList';
import './NotFound.css';

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
const NotFound = () => (
  <div>
    <Breadcrumbs aria-label="breadcrumb">
      <StyledBreadcrumb
        component="a"
        href="/home"
        label="Sản phẩm"
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
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404" />
        <h1>404</h1>
        <h2>Oops! Page Not Be Found</h2>
        <p>Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily unavailable</p>
        <Link to="/home">Back to homepage</Link>
      </div>
    </div>
  </div>
);

export default NotFound;
