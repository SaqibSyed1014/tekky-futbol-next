import api from './api';

export const initiateShopCheckout = (product) =>
  api.post('/shop/checkout/', product);
