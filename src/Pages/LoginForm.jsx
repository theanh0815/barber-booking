import React, { useState } from "react";

// Nhận props onSwitchToRegister và onLoginSuccess từ App.jsx
const LoginForm = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Gửi API đăng nhập tại đây và kiểm tra kết quả
    // Giả sử đăng nhập thành công:
    alert(`🟢 Đăng nhập thành công với email: ${form.email}`);
    console.log("Login form data:", form);
    if (onLoginSuccess) {
      onLoginSuccess(); // Gọi hàm này để App.jsx cập nhật state isLoggedIn
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">🔐 Đăng nhập khách hàng</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Đăng nhập
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Chưa có tài khoản?{" "}
          {/* 👇 THAY ĐỔI: Sử dụng button hoặc a với onClick */}
          <button
            type="button" // Quan trọng: để không submit form
            onClick={onSwitchToRegister} // Gọi hàm được truyền từ App.jsx
            className="text-blue-500 underline hover:text-blue-700 focus:outline-none"
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;