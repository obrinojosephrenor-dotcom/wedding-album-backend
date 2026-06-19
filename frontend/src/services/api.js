import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000,
});

export const registerGuest = (guest_name) =>
  API.post("/api/guests/register", { guest_name }).then(r => r.data);

export const getGuest = (id) =>
  API.get(`/api/guests/${id}`).then(r => r.data);

export const uploadPhoto = (formData, onProgress) =>
  API.post("/api/photos/upload", formData, {
    headers:         { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => onProgress && onProgress(Math.round(e.loaded / e.total * 100)),
  }).then(r => r.data);

export const getPhotos = (limit = 24, offset = 0) =>
  API.get(`/api/photos?limit=${limit}&offset=${offset}`).then(r => r.data);

// Admin
export const getAdminStats = (token) =>
  API.get("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

export const getGuestList = (token) =>
  API.get("/api/admin/guests", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

export const deleteAdminPhoto = (id, token) =>
  API.delete(`/api/admin/photos/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

export const getQRCode = (token, format = "png") =>
  `${import.meta.env.VITE_API_URL}/api/admin/qr?format=${format}&token=${token}`;