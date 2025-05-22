import React, { useState } from 'react';
import { apiService } from '../../services/apiService';

const CreateEmployeeForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      // Endpoint: POST /api/v1/admin/employee
      const response = await apiService.post('/admin/employee', formData);
      setMessage(response.message || "Employee created successfully!"); // AdminService trả về message
      setFormData({ name: '', email: '', password: '' }); // Reset form
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Failed to create employee.");
    } finally {
      setSubmitting(false);
    }
  };

  // ... (JSX for form with name, email, password fields)
  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Employee</h3>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {message && <p style={{color: 'green'}}>{message}</p>}
      {/* Inputs for name, email, password */}
      {/* ... */}
      <button type="submit" disabled={submitting}>Create</button>
    </form>
  );
};
export default CreateEmployeeForm;