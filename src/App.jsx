import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';

import BookingForm from "./components/BookingForm"; // Đảm bảo đường dẫn này chính xác
import LoginForm from "./Pages/LoginForm";
import RegisterForm from "./Pages/RegisterForm";

// Tạo một component con để có thể sử dụng hook useNavigate
function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate("/"); // Chuyển hướng đến trang chính (BookingForm) sau khi đăng nhập thành công
  };

  // Tùy chọn: Thêm hàm logout để dễ dàng kiểm thử
  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login"); // Chuyển về trang đăng nhập sau khi logout
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Bạn có thể đặt nút Logout ở đây hoặc trong BookingForm/Navbar */}
      {/* {isLoggedIn && (
        <button onClick={handleLogout} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded">
          Đăng xuất
        </button>
      )} */}

      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <BookingForm /> : <Navigate replace to="/login" />
          }
        />
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Navigate replace to="/" /> // Nếu đã đăng nhập, chuyển về trang chính
            )
          }
        />
        <Route
          path="/register"
          element={
            !isLoggedIn ? (
              <RegisterForm /> // Sau khi đăng ký, RegisterForm nên tự chuyển hướng người dùng
                               // đến trang đăng nhập hoặc tự động đăng nhập họ.
                               // Hiện tại, nó chỉ hiển thị form.
            ) : (
              <Navigate replace to="/" /> // Nếu đã đăng nhập, chuyển về trang chính
            )
          }
        />
        {/* Route bắt các đường dẫn không khớp, chuyển hướng về trang phù hợp */}
        <Route
          path="*"
          element={<Navigate replace to={isLoggedIn ? "/" : "/login"} />}
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    // Router được bọc ở ngoài cùng
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;