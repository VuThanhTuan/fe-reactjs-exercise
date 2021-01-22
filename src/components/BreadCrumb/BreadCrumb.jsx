/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prefer-stateless-function */
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Component } from 'react';
import { emphasize, withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { NavLink, Link } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import './BreadCrumb.css';

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
class BreadCrumb extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Breadcrumbs aria-label="breadcrumb">
        <StyledBreadcrumb
          component="a"
          href="#"
          label="Sản phẩm"
          icon={<HomeIcon fontSize="small" />}
          onClick={handleClick}
        />
        <StyledBreadcrumb
          component="a"
          href="#"
          label="Danh sách sản phẩm"
          onClick={handleClick}
        />
      </Breadcrumbs>
    );
  }
}

export default BreadCrumb;
