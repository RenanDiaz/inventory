import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import Accounting from './pages/Accounting';
import Orders from './pages/Orders';
import Purchases from './pages/Purchases';
import Catalog from './pages/Catalog';
import Categories from './pages/Categories';
import Cash from './pages/Cash';
import Suppliers from './pages/Suppliers';
import NewPurchase from './pages/NewPurchase';
import Sales from './pages/Sales';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faPlus,
  faAngleRight,
  faExchangeAlt,
  faSlash,
  faPlusCircle,
  faMinusCircle
} from '@fortawesome/free-solid-svg-icons';
import './App.css';

library.add(faPlus);
library.add(faAngleRight);
library.add(faExchangeAlt);
library.add(faSlash);
library.add(faPlusCircle);
library.add(faMinusCircle);

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path="/" component={Home} />
        <Route exact path="/products" component={Products} />
        <Route exact path="/products/catalog" component={Catalog} />
        <Route exact path="/products/categories" component={Categories} />
        <Route exact path="/accounting" component={Accounting} />
        <Route exact path="/accounting/cash" component={Cash} />
        <Route exact path="/orders" component={Orders} />
        <Route exact path="/purchases" component={Purchases} />
        <Route exact path="/purchases/new" component={NewPurchase} />
        <Route exact path="/suppliers" component={Suppliers} />
        <Route exact path="/sales" component={Sales} />
      </Layout>
    );
  }
}
