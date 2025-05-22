import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import NewsForm from './NewsForm'; // Component form sẽ được tạo bên dưới

// Giả định có authService để kiểm tra vai trò admin
// import { authService } from '../../services/authService';

const NewsList = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNews, setEditingNews] = useState(null); // Tin tức đang được sửa
  const [showForm, setShowForm] = useState(false);

  // const isAdmin = authService.isAdmin(); // Kiểm tra vai trò admin

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await apiService.get('/news'); // Endpoint: GET /api/v1/news
      setNewsList(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setNewsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        await apiService.delete(`/news/${id}`); // Endpoint: DELETE /api/v1/news/{id}
        fetchNews(); // Tải lại danh sách
        alert('News deleted successfully!');
      } catch (err) {
        setError(err.message);
        alert(`Error deleting news: ${err.message}`);
      }
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setShowForm(true);
  };

  const handleShowCreateForm = () => {
    setEditingNews(null); // Đảm bảo không có tin tức nào đang sửa khi tạo mới
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingNews(null);
    fetchNews(); // Tải lại danh sách sau khi thêm/sửa thành công
  };

  if (loading) return <p>Loading news...</p>;
  if (error) return <p style={{ color: 'red' }}>Error fetching news: {error}</p>;

  return (
    <div>
      <h2>News Articles</h2>
      {/* {isAdmin && ( // Chỉ hiển thị nút này cho Admin */}
        <button onClick={handleShowCreateForm}>Add New News</button>
      {/* )} */}

      {showForm && (
        <NewsForm
          existingNews={editingNews}
          onSuccess={handleFormSuccess}
          onCancel={() => { setShowForm(false); setEditingNews(null); }}
        />
      )}

      {newsList.length === 0 && !loading && <p>No news articles found.</p>}
      <ul>
        {newsList.map((news) => (
          <li key={news.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h3>{news.title}</h3>
            <p>{news.content?.substring(0, 100)}...</p> {/* Hiển thị một phần nội dung */}
            <p><em>Author: {news.author}</em></p>
            <p><small>Date: {new Date(news.date).toLocaleDateString()}</small></p>
            {news.imageUrl && <img src={news.imageUrl} alt={news.title} style={{ maxWidth: '200px' }} />}
            {/* Link to view full news item - cần React Router */}
            {/* <Link to={`/news/${news.id}`}>Read More</Link> */}
            <br />
            {/* {isAdmin && ( // Chỉ hiển thị các nút này cho Admin */}
              <>
                <button onClick={() => handleEdit(news)}>Edit</button>
                <button onClick={() => handleDelete(news.id)} style={{ marginLeft: '10px' }}>Delete</button>
              </>
            {/* )} */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsList;