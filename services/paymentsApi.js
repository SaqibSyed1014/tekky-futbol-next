import api from './api';

export const initiatePayment  = ()           => api.get('/api/v1/payments/initiate/');
export const getMyPayment     = ()           => api.get('/api/v1/payments/me/');
export const getAdminPayments = (params = {}) => {
  const qs = new URLSearchParams();
  if (params.status) qs.set('status', params.status);
  if (params.page)   qs.set('page',   params.page);
  const query = qs.toString();
  return api.get(`/api/v1/admin/payments/${query ? `?${query}` : ''}`);
};
