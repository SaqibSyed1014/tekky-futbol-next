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
