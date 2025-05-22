// src/components/User/UpdateUserForm.jsx
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService'; // Giả sử bạn có file này

// Component này nhận userId của người dùng cần cập nhật.
// Đối với người dùng tự cập nhật profile, đây sẽ là ID của chính họ.
const UpdateUserForm = ({ userId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    oldPassword: '',
    newPassword: '',
  });
  const [initialEmail, setInitialEmail] = useState(''); // Để kiểm tra xem email có thay đổi không
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user data để điền vào form khi component được tải
  useEffect(() => {
    if (!userId) {
      setError("User ID is missing. Cannot load user data.");
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Endpoint: GET /api/v1/user/{id} từ UserController.java
        const userData = await apiService.get(`/user/${userId}`);
        if (userData) {
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            oldPassword: '', // Không điền mật khẩu cũ
            newPassword: '',
          });
          setInitialEmail(userData.email || '');
        } else {
          setError("User not found.");
        }
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch user data.");
        console.error("Fetch user data error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    // Chuẩn bị payload dựa trên UpdateUserDTO mà UserService.java mong đợi
    const payload = {
      name: formData.name,
      email: formData.email,
    };

    // Chỉ gửi mật khẩu nếu người dùng nhập mật khẩu mới
    if (formData.newPassword) {
      payload.oldPassword = formData.oldPassword;
      payload.newPassword = formData.newPassword;
    }
    // Lưu ý: Backend UserService.java có logic kiểm tra oldPassword nếu newPassword được cung cấp và người dùng không phải admin

    try {
      // Endpoint: PUT /api/v1/user/{id} từ UserController.java
      const updatedUser = await apiService.put(`/user/${userId}`, payload);
      setSuccessMessage('Profile updated successfully!');
      // Cập nhật lại email ban đầu nếu email đã được thay đổi thành công
      if (payload.email !== initialEmail) {
          setInitialEmail(payload.email);
      }
      // Xóa các trường mật khẩu sau khi submit thành công
      setFormData(prev => ({ ...prev, oldPassword: '', newPassword: '' }));

      console.log('Updated user:', updatedUser);
      // Có thể bạn muốn cập nhật lại thông tin user trong state global (AuthContext, Redux) ở đây
    } catch (err) {
      // UserService.java có thể trả về "Email already in use" hoặc "Old password is incorrect."
      setError(err.message || 'Failed to update profile.');
      console.error("Update profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return <p style={{ color: 'red' }}>Error: User ID not provided to UpdateUserForm.</p>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Update Your Profile</h2>

      {loading && <p>Loading user data...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <fieldset style={{ border: '1px dashed #ddd', padding: '10px', marginBottom: '15px' }}>
        <legend>Change Password (optional)</legend>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="oldPassword" style={{ display: 'block', marginBottom: '5px' }}>Old Password:</label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder="Enter if changing password"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="newPassword" style={{ display: 'block', marginBottom: '5px' }}>New Password:</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter if changing password"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
      </fieldset>

      <button type="submit" disabled={loading} style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
};

export default UpdateUserForm;