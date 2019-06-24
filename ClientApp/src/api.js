const BASE_URL = `http://${window.location.hostname}:3001`;

async function callApi(endpoint, options = {}) {
  options.headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  const url = BASE_URL + endpoint;
  const response = await fetch(url, options);
  const data = await response.json();
  const totalCount = await response.headers.get('X-Total-Count');
  if (totalCount) {
    Object.defineProperty(data, 'totalCount', { value: Number(totalCount) });
  }

  return data;
}

const api = {
  products: {
    list() {
      return callApi('/products?_expand=category');
    },
    create(product) {
      return callApi(`/products`, {
        method: 'POST',
        body: JSON.stringify(product)
      });
    },
    read(id) {
      return callApi(`/products/${id}`);
    },
    update(id, updates) {
      return callApi(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },
    remove(id) {
      return callApi(`/products/${id}`, {
        method: 'DELETE'
      });
    }
  },
  categories: {
    list() {
      return callApi('/categories');
    },
    create(category) {
      return callApi(`/categories`, {
        method: 'POST',
        body: JSON.stringify(category)
      });
    },
    read(id) {
      return callApi(`/categories/${id}`);
    },
    update(id, updates) {
      return callApi(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },
    remove(id) {
      return callApi(`/categories/${id}`, {
        method: 'DELETE'
      });
    }
  },
  purchases: {
    list() {
      return callApi('/purchases');
    },
    create(purchase) {
      return callApi(`/purchases`, {
        method: 'POST',
        body: JSON.stringify(purchase)
      });
    },
    read(id) {
      return callApi(`/purchases/${id}`);
    },
    update(id, updates) {
      return callApi(`/purchases/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },
    remove(id) {
      return callApi(`/purchases/${id}`, {
        method: 'DELETE'
      });
    }
  },
  purchasedProducts: {
    list() {
      return callApi('/purchasedProducts');
    },
    create(purchasedProduct) {
      return callApi(`/purchasedProducts`, {
        method: 'POST',
        body: JSON.stringify(purchasedProduct)
      });
    },
    read(id) {
      return callApi(`/purchasedProducts/${id}`);
    },
    update(id, updates) {
      return callApi(`/purchasedProducts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },
    remove(id) {
      return callApi(`/purchasedProducts/${id}`, {
        method: 'DELETE'
      });
    }
  },
  items: {
    list() {
      return callApi('/items?_expand=product&_expand=category');
    },
    create(item) {
      return callApi(`/items`, {
        method: 'POST',
        body: JSON.stringify(item)
      });
    },
    read(id) {
      return callApi(`/items/${id}`);
    },
    update(id, updates) {
      return callApi(`/items/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },
    remove(id) {
      return callApi(`/items/${id}`, {
        method: 'DELETE'
      });
    }
  },
  sales: {
    list() {
      return callApi('/sales');
    },
    create(sale) {
      return callApi(`/sales`, {
        method: 'POST',
        body: JSON.stringify(sale)
      });
    },
    read(id) {
      return callApi(`/sales/${id}`);
    },
    update(id, updates) {
      return callApi(`/sales/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },
    remove(id) {
      return callApi(`/sales/${id}`, {
        method: 'DELETE'
      });
    }
  },
  soldProducts: {
    list() {
      return callApi('/soldProducts');
    },
    create(soldProduct) {
      return callApi(`/soldProducts`, {
        method: 'POST',
        body: JSON.stringify(soldProduct)
      });
    },
    read(id) {
      return callApi(`/soldProducts/${id}`);
    },
    update(id, updates) {
      return callApi(`/soldProducts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },
    remove(id) {
      return callApi(`/soldProducts/${id}`, {
        method: 'DELETE'
      });
    }
  }
};

export default api;
