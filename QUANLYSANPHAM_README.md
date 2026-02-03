# Ứng dụng Quản lý Đơn hàng và Sản phẩm

Ứng dụng web quản lý đơn hàng và sản phẩm được xây dựng với **ReactJS**, **UmiJS** và **Ant Design**.

## 🎯 Tính năng chính

### 1. Quản lý Sản phẩm
- ✅ Hiển thị danh sách sản phẩm với bảng Ant Design
- ✅ Thêm, sửa, xóa sản phẩm
- ✅ Phân loại sản phẩm theo danh mục
- ✅ Hiển thị trạng thái sản phẩm (Còn hàng, Sắp hết, Hết hàng)
- ✅ Phân trang 5 sản phẩm/trang

### 2. Tìm kiếm và Lọc Sản phẩm
- ✅ Tìm kiếm theo tên sản phẩm
- ✅ Lọc theo danh mục
- ✅ Lọc theo khoảng giá (Slider)
- ✅ Lọc theo trạng thái sản phẩm
- ✅ Sắp xếp theo: Tên, Giá, Số lượng

### 3. Quản lý Đơn hàng
- ✅ Tạo đơn hàng mới
- ✅ Chọn nhiều sản phẩm với số lượng tuỳ ý
- ✅ Tự động tính tổng tiền
- ✅ Validation dữ liệu (số điện thoại 10-11 chữ số)
- ✅ Hiển thị danh sách đơn hàng
- ✅ Cập nhật trạng thái đơn hàng
- ✅ Xem chi tiết đơn hàng trong Modal

### 4. Tìm kiếm và Lọc Đơn hàng
- ✅ Tìm kiếm theo tên khách hàng hoặc mã đơn hàng
- ✅ Lọc theo trạng thái (Chờ xử lý, Đang giao, Hoàn thành, Đã hủy)
- ✅ Lọc theo khoảng ngày (DatePicker.RangePicker)
- ✅ Sắp xếp theo ngày tạo

### 5. Thống kê và Dashboard
- ✅ Hiển thị tổng số sản phẩm
- ✅ Hiển thị tổng giá trị tồn kho
- ✅ Hiển thị tổng số đơn hàng
- ✅ Hiển thị doanh thu (từ đơn hàng hoàn thành)
- ✅ Hiển thị số sản phẩm còn hàng/hết hàng
- ✅ Hiển thị số đơn hàng theo trạng thái

### 6. Quản lý Kho
- ✅ Tự động trừ số lượng tồn kho khi đơn hàng "Hoàn thành"
- ✅ Tự động hoàn trả số lượng khi đơn hàng "Đã hủy"
- ✅ Validation số lượng đặt không vượt quá tồn kho

## 🛠 Công nghệ sử dụng

- **React Hooks**: useState, useEffect, useMemo, useCallback
- **Ant Design**: Table, Form, Modal, Select, Input, Button, Card, Statistic, v.v.
- **localStorage**: Lưu trữ dữ liệu sản phẩm và đơn hàng
- **TypeScript**: Đảm bảo an toàn kiểu dữ liệu
- **dayjs**: Xử lý ngày tháng

## 📂 Cấu trúc thư mục

```
src/
├── pages/quanlysanpham/
│   ├── index.tsx                 # Trang chính
│   ├── ProductTable.tsx          # Bảng sản phẩm với tìm kiếm/lọc
│   ├── CreateOrderForm.tsx       # Form tạo đơn hàng
│   └── OrderTable.tsx            # Bảng đơn hàng với tìm kiếm/lọc
└── models/quanlysanpham/
    ├── types.ts                  # Định nghĩa kiểu dữ liệu
    ├── useProduct.ts             # Hook quản lý sản phẩm
    └── useOrder.ts               # Hook quản lý đơn hàng
```

## 💾 Lưu trữ dữ liệu

Ứng dụng sử dụng **localStorage** để lưu trữ:
- **products_data**: Danh sách sản phẩm
- **orders_data**: Danh sách đơn hàng

Dữ liệu sẽ được khôi phục tự động khi tải lại trang.

## 📊 Dữ liệu mẫu

### Sản phẩm mẫu (8 sản phẩm)
- Laptop Dell XPS 13 - 25,000,000 VND (15 cái)
- iPhone 15 Pro Max - 30,000,000 VND (8 cái)
- Samsung Galaxy S24 - 22,000,000 VND (20 cái)
- iPad Air M2 - 18,000,000 VND (5 cái)
- MacBook Air M3 - 28,000,000 VND (12 cái)
- AirPods Pro 2 - 6,000,000 VND (0 cái - hết hàng)
- Samsung Galaxy Tab S9 - 15,000,000 VND (7 cái)
- Logitech MX Master 3 - 2,500,000 VND (25 cái)

### Đơn hàng mẫu (1 đơn hàng)
- Mã: DH001
- Khách hàng: Nguyễn Văn A
- Số điện thoại: 0912345678
- Địa chỉ: 123 Nguyễn Huệ, Q1, TP.HCM
- Tổng tiền: 25,000,000 VND
- Trạng thái: Chờ xử lý

## 🚀 Hướng dẫn sử dụng

### 1. Quản lý Sản phẩm
- Nhấn "Thêm sản phẩm" để thêm sản phẩm mới
- Nhập tên, danh mục, giá và số lượng
- Nhấn "Sửa" để chỉnh sửa sản phẩm
- Nhấn "Xóa" để xóa sản phẩm
- Sử dụng các filter để tìm kiếm sản phẩm

### 2. Quản lý Đơn hàng
- Chuyển sang tab "Quản lý Đơn hàng"
- Nhập thông tin khách hàng (Tên, SĐT, Địa chỉ)
- Chọn sản phẩm từ dropdown và nhập số lượng
- Sử dụng nút + và - để điều chỉnh số lượng
- Nhấn "Tạo đơn hàng" để lưu đơn hàng
- Thay đổi trạng thái trong bảng đơn hàng
- Nhấn "Chi tiết" để xem đầy đủ thông tin đơn hàng

## ✅ Kiểm tra khi sử dụng

1. **Tìm kiếm sản phẩm**: Nhập tên sản phẩm, kết quả được lọc tức thì
2. **Lọc giá**: Kéo slider để lọc theo khoảng giá
3. **Trạng thái sản phẩm**:
   - Xanh (Còn hàng): Số lượng > 10
   - Cam (Sắp hết): Số lượng 1-10
   - Đỏ (Hết hàng): Số lượng = 0
4. **Tạo đơn hàng**: Số lượng đặt không thể vượt quá tồn kho
5. **Cập nhật kho**: Khi đơn hàng "Hoàn thành", số lượng tồn kho tự động giảm
6. **Dữ liệu lưu trữ**: Làm mới trang, dữ liệu vẫn được giữ lại

## 📝 Ghi chú

- Tất cả dữ liệu được lưu trữ trong localStorage của trình duyệt
- Xóa cache sẽ xóa tất cả dữ liệu (có thể khôi phục lại dữ liệu mẫu)
- Ứng dụng hỗ trợ responsive design cho các thiết bị khác nhau
- Form validation tự động kiểm tra tất cả trường bắt buộc

## 🔍 Kiểm tra lỗi

Nếu gặp lỗi:
1. Kiểm tra console (F12) để xem thông báo lỗi
2. Xóa localStorage nếu dữ liệu bị hỏng: `localStorage.clear()`
3. Tải lại trang (Ctrl+F5)

---

**Được xây dựng bởi:** Student
**Phiên bản:** 1.0.0
**Cập nhật lần cuối:** Tháng 2, 2026
