import api from '@/services/api';

export function fetchMyProfile() {
  return api.get('/users/me/');
}

export function changePassword({ oldPassword, newPassword, confirmPassword }) {
  return api.post('/users/change-password/', {
    old_password:     oldPassword,
    new_password:     newPassword,
    confirm_password: confirmPassword,
  });
}

/** PATCH /users/me/update/ — update name, phone, gender */
export function updateUserInfo(data) {
  return api.patch('/users/me/update/', data);
}

/** PATCH /users/profile/me/ — update position, bio, date_of_birth, preferred_division, instagram */
export function updatePlayerProfile(data) {
  return api.patch('/users/profile/me/', data);
}

/** DELETE /users/me/delete/ — permanently delete own account */
export function deleteAccount() {
  return api.delete('/users/me/delete/');
}

/** POST /auth/forgot-password/ — send reset-link email */
export function forgotPassword(email) {
  return api.post('/auth/forgot-password/', { email });
}

/** POST /auth/reset-password/ — consume uid+token and set new password */
export function resetPassword({ uid, token, newPassword, confirmPassword }) {
  return api.post('/auth/reset-password/', {
    uid,
    token,
    new_password:     newPassword,
    confirm_password: confirmPassword,
  });
}
