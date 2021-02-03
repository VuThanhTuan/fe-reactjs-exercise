/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component, lazy, Suspense } from 'react';
import './App.css';
import {
  BrowserRouter as Router, Route, Switch, Link, NavLink,
} from 'react-router-dom';
import path from './constant/index';
import SideBar from './components/SideNav/SideNav';
import Home from './pages/product/home/Home';
import Management from './pages/product/management/management';
import ProductDetail from './pages/product/detail/detail';
import UpdateProduct from './pages/product/update/update';
import NotFound from './components/NotFound/NotFound';
import Loading from './components/loading/loading';

// const ProductDetail = lazy(
//   () => import('./pages/product/detail/detail'),
// );
// const Management = lazy(
//   () => import('./pages/product/management/management'),
// );
class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <SideBar />
          <div className="main">
            <div className="row">
              <Switch>
                <Route exact path={[path.HOME, '/']} component={Home} />
                <Route exact path={path.PRODUCT} component={Management} />
                <Route path={`${path.DETAIL}/:id`} component={ProductDetail} />
                <Route path={path.UPDATE} component={UpdateProduct} />
                <Route exact path={path.NOTFOUND} component={NotFound} />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
