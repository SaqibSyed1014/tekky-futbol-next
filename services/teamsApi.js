/**
 * Teams API — captain, player, and public join-flow endpoints.
 * All authenticated calls attach JWT automatically via the shared api utility.
 */

import api from '@/services/api';

// ─── Captain endpoints ───────────────────────────────────────────────────────

/** GET /teams/my/ — captain's team details (playerCount, pendingCount, remainingSlots) */
export const getMyTeam = () => api.get('/teams/my/');

/**
 * GET /teams/my/roster/
 * Returns { approved, pending_admin, invited, rosterCount, maxPlayers, teamStatus }
 */
export const getMyRoster = () => api.get('/teams/my/roster/');

/** GET /teams/my/invites/ — all pending invites for the captain's team */
export const getMyInvites = () => api.get('/teams/my/invites/');

/** GET /teams/my/invites/link/ — get or create the active link invite */
export const getLinkInvite = () => api.get('/teams/my/invites/link/');

/** POST /teams/my/invites/link/ — force-regenerate the link invite */
export const regenerateLinkInvite = () => api.post('/teams/my/invites/link/');

/**
 * POST /teams/my/invites/direct/
 * @param {string} playerId — UUID of the player to invite
 */
export const sendDirectInvite = (playerId) =>
  api.post('/teams/my/invites/direct/', { playerId });

/**
 * DELETE /teams/my/invites/:id/ — captain revokes a pending invite
 * @param {string} inviteId
 */
export const revokeInvite = (inviteId) =>
  api.delete(`/teams/my/invites/${inviteId}/`);

/**
 * DELETE /teams/my/roster/:userId/ — captain removes an approved player
 * @param {string} userId
 */
export const removePlayer = (userId) =>
  api.delete(`/teams/my/roster/${userId}/`);

/**
 * GET /teams/free-agents/
 * @param {{ search?: string, division?: string, page?: number }} params
 */
export const getFreeAgents = ({ search = '', division = '', page = 1 } = {}) => {
  const q = new URLSearchParams({ page });
  if (search)   q.set('search', search);
  if (division) q.set('division', division);
  return api.get(`/teams/free-agents/?${q}`);
};

// ─── Player endpoints ────────────────────────────────────────────────────────

/**
 * GET /teams/my-membership/
 * Returns { membership, teammates } for the authenticated player.
 */
export const getMyMembership = () => api.get('/teams/my-membership/');

// ─── Public join-flow endpoints ──────────────────────────────────────────────

/**
 * GET /teams/join/:token/ — fetch invite details (public, no auth required)
 * @param {string} token
 */
export const getJoinPage = (token) => api.get(`/teams/join/${token}/`);

/**
 * POST /teams/join/:token/ — player accepts or rejects a direct invite (JWT required)
 * @param {string} token
 * @param {'accept'|'reject'} action
 */
export const respondToInvite = (token, action) =>
  api.post(`/teams/join/${token}/`, { action });

/**
 * GET /teams/join-link/:token/validate/ — validate a link invite before registration
 * @param {string} token
 */
export const validateLinkInvite = (token) =>
  api.get(`/teams/join-link/${token}/validate/`);

/**
 * POST /teams/join-link/:token/ — authenticated player joins via link (post-registration)
 * @param {string} token
 */
export const joinViaLink = (token) => api.post(`/teams/join-link/${token}/`);

/**
 * POST /teams/join-link/:token/register/ — register + join in one shot (unauthenticated)
 * @param {string} token
 * @param {{ email, password, password2, name?, phone?, gender? }} payload
 */
export const registerAndJoin = (token, payload) =>
  api.post(`/teams/join-link/${token}/register/`, payload);
