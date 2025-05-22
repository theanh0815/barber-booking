import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

// Danh sách kiểu tóc mẫu
const hairstyles = [
  {
    name: "Fade hiện đại",
    image: "https://th.bing.com/th/id/OIP.MOajT3epzRxmS-WBfiyu8QHaE8?rs=1&pid=ImgDetMain",
    description: "Kiểu cắt fade gọn gàng, hiện đại, phù hợp với mọi độ tuổi.",
  },
  {
    name: "Undercut cổ điển",
    image: "https://th.bing.com/th/id/OIP.oSMPzC7_v5IrZld6_oXtSAHaJQ?rs=1&pid=ImgDetMain",
    description: "Undercut với mái dài vuốt ngược – phong cách lịch lãm.",
  },
  {
    name: "Buzz Cut",
    image: "https://netstorage-tuko.akamaized.net/images/5887ac8a42fbbdd2.jpg",
    description: "Cực gọn và mát mẻ – lựa chọn số 1 mùa hè.",
  },
];

const BookingForm = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "",
    barber: "",
    datetime: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`✅ Đặt lịch thành công cho ${form.name} vào lúc ${form.datetime}`);
    console.log("Dữ liệu gửi:", form);
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white rounded-xl shadow-xl">
      {/* CAROUSEL */}
      <Swiper
        modules={[Navigation]}
        navigation
        loop
        spaceBetween={10}
        slidesPerView={1}
        className="mb-6 rounded-xl overflow-hidden shadow-md"
      >
        {hairstyles.map((style, index) => (
          <SwiperSlide key={index}>
            <div className="relative">
              <img
                src={style.image}
                alt={style.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4">
                <h3 className="text-lg font-semibold">{style.name}</h3>
                <p className="text-sm">{style.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* FORM ĐẶT LỊCH */}
      <h2 className="text-2xl font-bold mb-4 text-center">💈 Đặt lịch cắt tóc</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Họ tên"
          className="w-full p-2 border rounded"
          required
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Số điện thoại"
          className="w-full p-2 border rounded"
          required
        />

        <select
          name="service"
          value={form.service}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Chọn dịch vụ</option>
          <option value="cat-toc">Cắt tóc</option>
          <option value="goi-dau">Gội đầu</option>
          <option value="nhuom">Nhuộm tóc</option>
        </select>

        <select
          name="barber"
          value={form.barber}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Chọn thợ</option>
          <option value="anh-a">Anh A</option>
          <option value="chi-b">Chị B</option>
          <option value="anh-c">Anh C</option>
        </select>

        <input
          name="datetime"
          type="datetime-local"
          value={form.datetime}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Đặt lịch
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
