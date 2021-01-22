/* eslint-disable react/prefer-stateless-function */
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './SideNav.css';

class SideBar extends Component {
  render() {
    return (
      <div className="sidebar">
        <ul>
          <li>
            <NavLink to="/home">
              <span>Sản phẩm</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/product">
              <span>Quản lý sản phẩm</span>
            </NavLink>
          </li>
        </ul>
      </div>
    );
  }
}

export default SideBar;
