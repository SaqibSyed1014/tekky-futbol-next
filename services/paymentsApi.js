import api from './api';

export const initiatePayment = () =>
  api.get('/payments/initiate/').then((data) => {
    console.log('[payments] initiatePayment response:', data);
    return data;
  });

export const getMyPayment = () =>
  api.get('/payments/me/').then((data) => {
    console.log('[payments] getMyPayment response:', data);
    return data;
  });

export const getAdminPayments = (params = {}) => {
  const qs = new URLSearchParams();
  if (params.status) qs.set('status', params.status);
  if (params.page)   qs.set('page',   params.page);
  const query = qs.toString();
  return api.get(`/admin/payments/${query ? `?${query}` : ''}`);
};
