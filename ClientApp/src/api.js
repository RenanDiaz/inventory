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
  }
};

export default api;
