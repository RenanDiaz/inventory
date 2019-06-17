import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import Accounting from './pages/Accounting';
import Orders from './pages/Orders';
import Catalog from './pages/Catalog';
import Cash from './pages/Cash';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faAngleRight, faExchangeAlt, faSlash } from '@fortawesome/free-solid-svg-icons';

library.add(faPlus);
library.add(faAngleRight);
library.add(faExchangeAlt);
library.add(faSlash);

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path="/" component={Home} />
        <Route exact path="/products" component={Products} />
        <Route exact path="/products/catalog" component={Catalog} />
        <Route exact path="/accounting" component={Accounting} />
        <Route exact path="/accounting/cash" component={Cash} />
        <Route exact path="/orders" component={Orders} />
      </Layout>
    );
  }
}
