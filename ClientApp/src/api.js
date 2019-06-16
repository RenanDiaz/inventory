const BASE_URL = 'http://localhost:3001';

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
      return callApi('/products');
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
  }
};

export default api;
