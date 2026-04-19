/**
 * Applications API — submits league applications to /applications.
 *
 * Sends multipart/form-data when a logo file is present,
 * plain JSON otherwise.
 */

import api from '@/services/api';

/**
 * POST /applications
 *
 * @param {object} payload
 *   @param {string}  payload.applicationType   'free_agent' | 'full_team'
 *   @param {string}  payload.name
 *   @param {string}  payload.email
 *   @param {string}  payload.phone
 *   @param {string}  payload.gender
 *   @param {string}  payload.preferredDivision
 *   @param {string}  [payload.instagram]
 *   @param {string}  payload.reasonForCompeting
 *   @param {string}  [payload.teamName]          full_team only
 *   @param {number}  [payload.rosterSize]        full_team only
 *   @param {boolean} payload.nameLogoConfirmation
 *   @param {boolean} payload.nonGuarantee
 *   @param {boolean} payload.codeOfConduct
 * @param {File|null} [logoFile]  Optional logo attachment (full_team)
 *
 * @returns {Promise<object>}  Created application record from the server
 */
export async function submitApplication(payload, logoFile = null) {
  if (logoFile) {
    const formData = new FormData();
    Object.entries(payload).forEach(([k, v]) => formData.append(k, String(v)));
    formData.append('logo', logoFile);
    return api.upload('/applications', formData);
  }

  return api.post('/applications', payload);
}
