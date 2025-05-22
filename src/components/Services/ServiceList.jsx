import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import ServiceForm from './ServiceForm';
// import { authService } from '../../services/authService';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]); // Cho batch delete

  // const isAdmin = authService.isAdmin();

  const fetchServices = async () => {
    // Gọi GET /api/v1/services
    // ... (tương tự NewsList) ...
     try {
      setLoading(true);
      const data = await apiService.get('/services');
      setServices(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleShowCreateForm = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingService(null);
    fetchServices();
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const handleDeleteBatch = async () => {
    if (selectedIds.length === 0) {
      alert("Please select services to delete.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected services?`)) {
      try {
        // Endpoint: DELETE /api/v1/services/batch
        const response = await apiService.delete('/services/batch', selectedIds);
        alert(response.message || `${response.success?.length || 0} services deleted successfully. ${response.failed?.length || 0} failed.`);
        fetchServices();
        setSelectedIds([]);
      } catch (err) {
        alert(`Error deleting services: ${err.message}`);
      }
    }
  };


  if (loading) return <p>Loading services...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Services</h2>
      {/* {isAdmin && ( */}
        <>
          <button onClick={handleShowCreateForm}>Add New Service</button>
          {selectedIds.length > 0 && (
            <button onClick={handleDeleteBatch} style={{ marginLeft: '10px' }}>
              Delete Selected ({selectedIds.length})
            </button>
          )}
        </>
      {/* )} */}

      {showForm && (
        <ServiceForm
          existingService={editingService}
          onSuccess={handleFormSuccess}
          onCancel={() => {setShowForm(false); setEditingService(null);}}
        />
      )}

      {services.length === 0 && !loading && <p>No services found.</p>}
      {services.map(service => (
        <div key={service.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          {/* {isAdmin && ( */}
            <input
              type="checkbox"
              checked={selectedIds.includes(service.id)}
              onChange={() => handleCheckboxChange(service.id)}
              style={{ marginRight: '10px' }}
            />
          {/* )} */}
          <strong>{service.name}</strong> - ${service.price} ({service.estimatedTime} mins)
          <p>{service.description}</p>
          {service.imageUrl && <img src={service.imageUrl} alt={service.name} style={{width: '100px'}} />}
          <p>Active: {service.active ? 'Yes' : 'No'}</p>
          {/* {isAdmin && ( */}
            <button onClick={() => handleEdit(service)} style={{ marginLeft: '10px' }}>Edit</button>
          {/* )} */}
        </div>
      ))}
    </div>
  );
};

export default ServiceList;