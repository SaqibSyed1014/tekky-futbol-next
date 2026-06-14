import api from '@/services/api';

// ─── Public (no auth) ────────────────────────────────────────────────────────

/**
 * GET /api/v1/profiles/<userId>/
 * Public player profile. Returns null if not found / not yet public.
 */
export const getPublicProfile = (userId) =>
  api.get(`/profiles/${userId}/`);

/**
 * GET /api/v1/teams/public/<slug>/
 * Public team profile. Includes roster, kit slug, and approved team link.
 */
export const getPublicTeamProfile = (slug) =>
  api.get(`/teams/public/${slug}/`);

// ─── Player ───────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/users/profile/me/link/
 * Submit or clear personal profile link.
 * @param {string|null} profileLink  URL string or null to clear
 */
export const submitProfileLink = (profileLink) =>
  api.post('/users/profile/me/link/', { profile_link: profileLink || null });

// ─── Captain ──────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/users/team/link/
 * Submit or clear team link.
 * @param {string|null} teamLink  URL string or null to clear
 */
export const submitTeamLink = (teamLink) =>
  api.post('/users/team/link/', { team_link: teamLink || null });

// ─── Admin ────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/admin/players/
 * Paginated list of all players with stats + link statuses.
 * @param {{ search?: string, is_public?: string, page?: number }} params
 */
export const getAdminPlayers = ({ search = '', is_public = '', page = 1 } = {}) => {
  const q = new URLSearchParams({ page });
  if (search)    q.set('search', search);
  if (is_public) q.set('is_public', is_public);
  return api.get(`/admin/players/?${q}`);
};

/**
 * PATCH /api/v1/admin/players/<userId>/stats/
 * @param {string} userId
 * @param {object} stats  Any combination of stat fields
 */
export const updatePlayerStats = (userId, stats) =>
  api.patch(`/admin/players/${userId}/stats/`, stats);

/**
 * PATCH /api/v1/admin/players/<userId>/profile-link/
 * @param {string} userId
 * @param {'approve'|'reject'} action
 */
export const reviewProfileLink = (userId, action) =>
  api.patch(`/admin/players/${userId}/profile-link/`, { action });

/**
 * PATCH /api/v1/admin/teams/<teamId>/team-link/
 * @param {string} teamId
 * @param {'approve'|'reject'} action
 */
export const reviewTeamLink = (teamId, action) =>
  api.patch(`/admin/teams/${teamId}/team-link/`, { action });
