import api from './api';

export const initiateTicketCheckout = (payload) =>
  api.post('/tickets/checkout/', payload);

export const fetchTicketAvailability = (params = {}) => {
  const qs = new URLSearchParams();
  if (params.tier) qs.set('tier', params.tier);
  if (params.division) qs.set('division', params.division);
  if (params.week) qs.set('week', params.week);
  const query = qs.toString();
  return api.get(`/tickets/availability/${query ? `?${query}` : ''}`);
};

export const fetchTicketBySession = (sessionId) =>
  api.get(`/tickets/by-session/${sessionId}/`);

export const fetchMyTickets = () =>
  api.get('/tickets/my/');

export const fetchTicketVerifyDetails = (token) =>
  api.get(`/tickets/verify-details/?token=${encodeURIComponent(token)}`);

export const verifyTicket = (token, staffUniqueId) =>
  api.post('/tickets/verify/', { token, staff_unique_id: staffUniqueId });

export const getAdminTickets = (params = {}) => {
  const qs = new URLSearchParams();
  if (params.status) qs.set('status', params.status);
  if (params.tier)   qs.set('tier',   params.tier);
  if (params.page)   qs.set('page',   params.page);
  const query = qs.toString();
  return api.get(`/admin/tickets/${query ? `?${query}` : ''}`);
};

export const getAdminStaff = () =>
  api.get('/admin/staff/');

export const createStaff = (payload) =>
  api.post('/admin/staff/', payload);

export const deleteStaff = (id) =>
  api.delete(`/admin/staff/${id}/`);
