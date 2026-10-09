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

export const checkInTicket = (token) =>
  api.post('/tickets/check-in/', { token });

export const getAdminTickets = (params = {}) => {
  const qs = new URLSearchParams();
  if (params.status) qs.set('status', params.status);
  if (params.tier)   qs.set('tier',   params.tier);
  if (params.page)   qs.set('page',   params.page);
  const query = qs.toString();
  return api.get(`/admin/tickets/${query ? `?${query}` : ''}`);
};
