import api from './api';

export const noteService = {
  uploadNote: (formData) =>
    api.post('/notes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getNotes: (params) => api.get('/notes', { params }),
  getNoteById: (id) => api.get(`/notes/${id}`),
  deleteNote: (id) => api.delete(`/notes/${id}`),
  toggleLike: (id) => api.put(`/notes/${id}/like`),
  rateNote: (id, value) => api.post(`/notes/${id}/rate`, { value }),
  incrementDownload: (id) => api.put(`/notes/${id}/download`),
};

export const userService = {
  getUserById: (id) => api.get(`/users/${id}`),
  getUserNotes: (id, params) => api.get(`/users/${id}/notes`, { params }),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/password', data),
};
