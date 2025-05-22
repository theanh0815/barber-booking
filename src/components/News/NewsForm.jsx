import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';

// Dựa trên NewsDTO và NewsService
// NewsDTO fields: id, title, content, author, date (tự gán), imageUrl
const NewsForm = ({ existingNews, onSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState(''); // Hoặc lấy từ user đăng nhập nếu cần
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!existingNews;

  useEffect(() => {
    if (isEditing) {
      setTitle(existingNews.title || '');
      setContent(existingNews.content || '');
      setAuthor(existingNews.author || '');
      setImageUrl(existingNews.imageUrl || '');
    } else {
      // Reset form cho trường hợp tạo mới
      setTitle('');
      setContent('');
      setAuthor(''); // Hoặc gán mặc định
      setImageUrl('');
    }
  }, [existingNews, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const newsData = { title, content, author, imageUrl };
    // NewsService không yêu cầu date từ client khi create
    // và có thể bao gồm date khi update
    if (isEditing) {
        newsData.id = existingNews.id;
        newsData.date = existingNews.date; // Giữ lại date gốc khi update
    }


    try {
      if (isEditing) {
        await apiService.put(`/news/${existingNews.id}`, newsData); // Endpoint: PUT /api/v1/news/{id}
        alert('News updated successfully!');
      } else {
        await apiService.post('/news', newsData); // Endpoint: POST /api/v1/news
        alert('News created successfully!');
      }
      onSuccess(); // Gọi callback để đóng form và refresh list
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid green', padding: '15px', margin: '15px 0' }}>
      <h3>{isEditing ? 'Edit News' : 'Create News'}</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="title">Title:</label><br />
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '90%', marginBottom: '10px' }}
        />
      </div>
      <div>
        <label htmlFor="content">Content:</label><br />
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows="5"
          style={{ width: '90%', marginBottom: '10px' }}
        />
      </div>
      <div>
        <label htmlFor="author">Author:</label><br />
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{ width: '90%', marginBottom: '10px' }}
        />
      </div>
      <div>
        <label htmlFor="imageUrl">Image URL:</label><br />
        <input
          type="text"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={{ width: '90%', marginBottom: '10px' }}
        />
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : (isEditing ? 'Update News' : 'Create News')}
      </button>
      <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }} disabled={submitting}>
        Cancel
      </button>
    </form>
  );
};

export default NewsForm;