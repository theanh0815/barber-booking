// src/services/apiService.js
const API_BASE_URL = '/api/v1'; // Giả sử proxy đã được cấu hình trong package.json

// Hàm helper để xử lý response
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Something went wrong');
  }
  if (response.status === 204 || response.headers.get('Content-Length') === '0') { // No content
    return null;
  }
  return response.json();
};

// Hàm helper để lấy token (giả định bạn lưu token trong localStorage)
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken'); // Thay đổi tùy theo cách bạn lưu token
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const apiService = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  delete: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      ...(data && { body: JSON.stringify(data) }), // Cho trường hợp batch delete
    });
    // Delete có thể trả về 200 OK với message hoặc 204 No Content
    if (response.status === 204) return null;
    if (response.ok && response.headers.get('Content-Type')?.includes('application/json')) {
        return response.json();
    } else if (response.ok) {
        return response.text(); // Cho trường hợp trả về text "Successfully Deleted"
    }
    return handleResponse(response); // Xử lý lỗi nếu không ok
  },
};