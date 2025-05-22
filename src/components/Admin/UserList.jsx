import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
// import CreateEmployeeForm from './CreateEmployeeForm';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'employee', 'customer'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [showCreateEmpForm, setShowCreateEmpForm] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      let endpoint = '/admin/users'; // GET /api/v1/admin/users
      if (filter === 'employee') {
        endpoint = '/admin/users/employee'; // GET /api/v1/admin/users/employee
      } else if (filter === 'customer') {
        endpoint = '/admin/users/customer'; // GET /api/v1/admin/users/customer
      }
      try {
        const response = await apiService.get(endpoint);
        setUsers(response.users || []);
      } catch (err) {
        setError(err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [filter]);

  // ... (render list, filter buttons, button to show CreateEmployeeForm)
  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>User Management</h2>
      <div>
        Filter:
        <button onClick={() => setFilter('all')} disabled={filter === 'all'}>All</button>
        <button onClick={() => setFilter('employee')} disabled={filter === 'employee'}>Employees</button>
        <button onClick={() => setFilter('customer')} disabled={filter === 'customer'}>Customers</button>
      </div>
       {/* <button onClick={() => setShowCreateEmpForm(true)}>Create New Employee</button>
      {showCreateEmpForm && <CreateEmployeeForm onSuccess={() => { setShowCreateEmpForm(false); // fetchUsers() lại hoặc cập nhật state}} />} */}

      {users.length === 0 && !loading && <p>No users found for this filter.</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default UserList;