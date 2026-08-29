# Tài liệu Đặc tả API (API Specification) — EShop

> **Mục đích:** Tài liệu này cung cấp danh sách và cách sử dụng các Backend API của hệ thống EShop.
> Sinh viên có thể sử dụng Postman, cURL hoặc các công cụ tương tự để tương tác với API nhằm phục vụ quá trình kiểm thử phần mềm.
> **Base URL:** `http://localhost:3000`

---

## 1. Authentication (Xác thực)

### 1.1 Đăng ký tài khoản
- **Endpoint:** `POST /api/register`
- **Body (JSON):**
  ```json
  {
    "name": "Nguyen Van A",
    "email": "test@domain.com",
    "password": "Password123!"
  }
  ```
- **Phản hồi thành công (200 OK):** `{"message": "User registered successfully", "id": 1}`

### 1.2 Đăng nhập
- **Endpoint:** `POST /api/login`
- **Body (JSON):**
  ```json
  {
    "email": "test@domain.com",
    "password": "Password123!"
  }
  ```
- **Phản hồi thành công (200 OK):** Trả về chuỗi JWT `token` và thông tin `user`.

### 1.3 Quên mật khẩu (Lấy OTP)
- **Endpoint:** `POST /api/forgot-password`
- **Body (JSON):**
  ```json
  {
    "email": "test@domain.com"
  }
  ```
- **Phản hồi thành công (200 OK):** `{"message": "Mã đặt lại mật khẩu đã được tạo", "resetToken": "123456"}`

### 1.4 Đặt lại mật khẩu
- **Endpoint:** `POST /api/reset-password`
- **Body (JSON):**
  ```json
  {
    "email": "test@domain.com",
    "resetToken": "123456",
    "newPassword": "NewPassword123!"
  }
  ```

---

## 2. Người dùng (Users)

*Lưu ý: Các API dưới đây yêu cầu truyền Token ở Header: `Authorization: Bearer <token>`*

### 2.1 Lấy thông tin cá nhân
- **Endpoint:** `GET /api/users/me`

### 2.2 Cập nhật hồ sơ cá nhân
- **Endpoint:** `PUT /api/users/me`
- **Mô tả:** Chỉ cho phép cập nhật thông tin cá nhân cơ bản.
- **Body (JSON):**
  ```json
  {
    "name": "Nguyen Van A",
    "shipping_address": "123 Le Loi, Q1, TP.HCM",
    "phone": "0912345678"
  }
  ```

---

## 3. Sản phẩm (Products) & Danh mục (Categories)

### 3.1 Lấy danh sách sản phẩm
- **Endpoint:** `GET /api/products`
- **Query string (Tùy chọn):** `?search=keyword` để tìm kiếm sản phẩm theo tên.

### 3.2 Xem chi tiết một sản phẩm
- **Endpoint:** `GET /api/products/:id`

### 3.3 Thêm / Sửa / Xóa Sản phẩm (Dành cho Admin)
- **Thêm sản phẩm:** `POST /api/products`
- **Cập nhật:** `PUT /api/products/:id`
- **Xóa:** `DELETE /api/products/:id`
- **Body khi Thêm/Sửa (JSON):**
  ```json
  {
    "name": "Tên sản phẩm",
    "price": 100000,
    "description": "Mô tả",
    "imageUrl": "http://...",
    "category_id": 1
  }
  ```

### 3.4 Danh mục (Categories)
- **Lấy danh sách:** `GET /api/categories`
- **Thêm mới:** `POST /api/categories` *(Body: `{"name": "Tên DM"}`)*
- **Cập nhật:** `PUT /api/categories/:id`
- **Xóa:** `DELETE /api/categories/:id`

---

## 4. Giỏ hàng & Đơn hàng (Cart & Orders)

*Yêu cầu Header: `Authorization: Bearer <token>`*

### 4.1 Lấy giỏ hàng
- **Endpoint:** `GET /api/cart`

### 4.2 Thêm vào giỏ hàng
- **Endpoint:** `POST /api/cart`
- **Body (JSON):** 
  ```json
  {
    "id": 1,
    "name": "Sản phẩm A",
    "price": 100000,
    "quantity": 2
  }
  ```

### 4.3 Đặt hàng (Checkout)
- **Endpoint:** `POST /api/checkout`
- **Body (JSON):**
  ```json
  {
    "total_amount": 200000,
    "shipping_address": "123 Le Loi, TP.HCM"
  }
  ```

### 4.4 Lấy lịch sử đơn hàng cá nhân
- **Endpoint:** `GET /api/orders/my-orders`

### 4.5 Lấy chi tiết một đơn hàng
- **Endpoint:** `GET /api/orders/:id`

### 4.6 Hủy đơn hàng
- **Endpoint:** `PUT /api/orders/:id/cancel`
- **Mô tả:** Chuyển trạng thái đơn hàng sang `canceled`. Chỉ được thực hiện khi đơn hàng chưa giao.

---

## 5. Mã Giảm Giá (Coupons)

### 5.1 Áp dụng mã giảm giá
- **Endpoint:** `POST /api/apply-coupon`
- **Mô tả:** Tính toán tổng tiền sau khi giảm. Trả về cấu trúc JSON chứa `discount_amount` và `final_amount`.
- **Body (JSON):**
  ```json
  {
    "code": "SAVE10",
    "total_amount": 500000,
    "user_id": 1
  }
  ```

### 5.2 Lấy danh sách mã giảm giá (Dành cho Admin)
- **Endpoint:** `GET /api/coupons`
- **Header:** `Authorization: Bearer <token>`

---

## 6. API Dành cho Admin

*Tất cả API dưới đây yêu cầu `Authorization: Bearer <token>` và tài khoản phải có quyền Admin.*

### 6.1 Quản lý Người dùng
- **Lấy danh sách người dùng:** `GET /api/admin/users`
- **Xóa người dùng:** `DELETE /api/admin/users/:id`

### 6.2 Quản lý Đơn hàng (Toàn hệ thống)
- **Lấy danh sách đơn hàng:** `GET /api/admin/orders`
- **Cập nhật trạng thái đơn hàng:** `PUT /api/admin/orders/:id/status`
  - **Body (JSON):** `{"status": "confirmed"}` (Các trạng thái: `pending`, `confirmed`, `shipping`, `delivered`, `canceled`).

### 6.3 Import Sản phẩm từ CSV (JSON Array)
- **Endpoint:** `POST /api/admin/import-products`
- **Body (JSON):**
  ```json
  {
    "products": [
      {
        "name": "SP 1",
        "price": 10000,
        "description": "Mô tả 1",
        "imageUrl": "",
        "category_id": 1
      }
    ]
  }
  ```

### 6.4 Quản lý Mã Giảm Giá
- **Thêm mới mã:** `POST /api/admin/coupons`
  - **Body (JSON):**
    ```json
    {
      "code": "TET2025",
      "type": "percent", 
      "discount_value": 15,
      "min_order_amount": 200000,
      "expired_at": "2025-01-31",
      "max_uses_per_user": 1
    }
    ```
- **Xóa mã:** `DELETE /api/admin/coupons/:id`
# Đặc tả Yêu cầu Hệ thống (System Requirements Specification)

# EShop — Phiên bản dành cho Kiểm thử Phần mềm

> **Phạm vi tài liệu**: Mô tả **yêu cầu nghiệp vụ đúng** của hệ thống EShop.
> Sinh viên sử dụng tài liệu này làm cơ sở thiết kế test case, sau đó kiểm thử hệ thống thực để tìm ra các điểm triển khai không tuân thủ đặc tả.

---

## 1. Tổng quan Hệ thống

Hệ thống EShop là nền tảng thương mại điện tử bao gồm 4 thành phần:

| Thành phần   | Công nghệ                   | URL mặc định            |
| ------------ | --------------------------- | ----------------------- |
| Backend API  | Node.js + Express + SQLite  | `http://localhost:3000` |
| Frontend Web | React + Vite + Tailwind CSS | `http://localhost:5173` |
| Web Admin    | React + Vite + Tailwind CSS | `http://localhost:5174` |
| Mobile App   | React Native + Expo         | IP LAN của máy chủ      |

**Tài khoản mặc định:**

- Admin: `admin@eshop.com` / `Admin123!`
- User test: `test@eshop.com` / `Test1234!`

---

## 2. Quản lý Tài khoản (Authentication & Authorization)

### FR-01: Đăng ký tài khoản

- Người dùng phải cung cấp: **Họ Tên**, **Email**, **Mật khẩu**.
- Email phải có định dạng hợp lệ (`user@domain.com`) và là duy nhất trong hệ thống.
- **Yêu cầu mật khẩu mạnh**: Tối thiểu 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt (`@`, `$`, `!`, `%`, `*`, `?`, `&`).
- Phải có trường **Xác nhận mật khẩu** — hệ thống từ chối nếu hai trường không khớp.
- Sau khi đăng ký thành công, người dùng được chuyển tới trang Đăng nhập.

### FR-02: Đăng nhập & Khóa tài khoản

- Người dùng nhập Email và Mật khẩu.
- Sau mỗi lần đăng nhập sai, hệ thống tăng bộ đếm lên **đúng 1 đơn vị**.
- Nếu đăng nhập sai từ **3 lần trở lên** liên tiếp, tài khoản bị tạm khóa **30 giây** (môi trường demo). Hệ thống trả về thông báo lỗi phù hợp; không để lộ chi tiết nguyên nhân.
- Đăng nhập thành công trả về JWT Token. Token được lưu phía client và gửi kèm tất cả các yêu cầu có xác thực qua header `Authorization: Bearer <token>`.
- Trường email phải dùng `type="email"` (có validate HTML5 format).

### FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)

**Bước 1 — Lấy mã OTP:**

- Người dùng nhập địa chỉ Email đã đăng ký.
- Hệ thống sinh mã OTP **6 chữ số ngẫu nhiên** và gửi qua Email (trong môi trường demo: hiển thị trực tiếp trên màn hình).
- Giao diện phải hiển thị **chỉ báo bước (Step Indicator)** — ví dụ: "Bước 1 / 2".
- Có nút **Quay lại đăng nhập**.

**Bước 2 — Đặt lại mật khẩu:**

- Người dùng nhập OTP, Mật khẩu mới, và **Xác nhận mật khẩu mới**.
- Mật khẩu mới phải tuân thủ điều kiện như FR-01.
- Hai trường mật khẩu phải khớp nhau.
- OTP chỉ hợp lệ cho email đã yêu cầu, không thể dùng cho email khác.

### FR-04: Quản lý hồ sơ cá nhân

- Người dùng đã đăng nhập có thể cập nhật: **Họ Tên**, **Số điện thoại**, **Địa chỉ giao hàng mặc định**.
- **Số điện thoại hợp lệ**: bắt đầu bằng số `0`, từ 10–11 chữ số.
- Email không được phép thay đổi qua giao diện.
- Người dùng chỉ có thể cập nhật hồ sơ của chính mình; không thể tự thay đổi thuộc tính `role`.

---

## 3. Danh mục & Sản phẩm

### FR-05: Xem danh sách & Tìm kiếm sản phẩm

- Trang chủ hiển thị danh sách tất cả sản phẩm dạng lưới (grid).
- Mỗi sản phẩm hiển thị: **Ảnh** (tỷ lệ chuẩn, có alt text mô tả), **Tên sản phẩm**, **Giá** (đơn vị: ₫, định dạng phân cách hàng nghìn).
- Thanh tìm kiếm tìm theo tên sản phẩm. Từ khóa tìm kiếm phải được **hiển thị an toàn** (không render HTML).
- Khi đang tải dữ liệu phải hiển thị trạng thái **loading**.
- Khi không có kết quả tìm kiếm phải hiển thị thông báo **empty state** phù hợp.
- Trang chủ chỉ có **đúng một thẻ `<h1>`**.
- Mỗi trang chỉ có 1 `<h1>` duy nhất.

### FR-06: Xem chi tiết sản phẩm

- Hiển thị đầy đủ: Ảnh lớn, Tên, Giá, Mô tả, Danh mục.
- Có ô nhập **Số lượng** (chỉ nhận số nguyên dương, tối thiểu là 1).
- Nút **Thêm vào giỏ hàng** — sau khi bấm hiển thị phản hồi trực quan (toast notification hoặc badge cập nhật).

---

## 4. Giỏ hàng & Thanh toán

### FR-07: Giỏ hàng (Shopping Cart)

- Hiển thị danh sách sản phẩm với các cột: **Sản phẩm**, **Đơn giá**, **Số lượng** (có nút +/- để chỉnh), **Thành tiền**, **Thao tác**.
- Thêm cùng một sản phẩm vào giỏ sẽ tăng số lượng, không tạo dòng mới.
- Nút **Xóa sản phẩm** phải có dialog xác nhận trước khi thực hiện.
- Có nút **Tiếp tục mua sắm** để quay về trang chủ.
- Tổng tiền hiển thị nhãn chính xác: **"Tổng cộng"** (không phải "Tổng tạm tính").
- Giỏ hàng trống phải có hình minh họa và thông báo rõ ràng.

### FR-08: Thanh toán (Checkout)

- Chỉ người dùng **đã đăng nhập** mới tiến hành thanh toán được.
- **Tổng tiền thanh toán** được tính tự động từ giỏ hàng và không cho phép người dùng chỉnh sửa trực tiếp.
- Giao diện hiển thị đầy đủ danh sách sản phẩm đặt mua.
- Backend phải tự tính lại tổng tiền; không chấp nhận giá trị `total_amount` do client gửi lên.
- Sau thanh toán thành công, giỏ hàng được xóa.

### FR-09: Mã Giảm Giá (Coupon)

Tại bước Checkout, người dùng có thể nhập mã giảm giá. Hệ thống áp dụng giảm giá dựa trên **5 điều kiện** sau, tất cả phải thỏa mãn:

| #   | Điều kiện              | Mô tả                                                       |
| --- | ---------------------- | ----------------------------------------------------------- |
| C1  | **Mã tồn tại**         | Mã phải có trong CSDL và đang hoạt động (`is_active = 1`)   |
| C2  | **Còn hạn sử dụng**    | Ngày hiện tại phải trước `expired_at`                       |
| C3  | **Đủ ngưỡng đơn hàng** | Tổng đơn hàng **>= (lớn hơn hoặc bằng)** `min_order_amount` |
| C4  | **Đã đăng nhập**       | Người dùng phải có JWT Token hợp lệ                         |
| C5  | **Chưa dùng hết lượt** | Số lần đã dùng mã này của user < `max_uses_per_user`        |

**Công thức tính giảm giá:**

- Loại `percent`: `discount_amount = total × discount_value / 100`
- Loại `fixed`: `discount_amount = discount_value`
- `final_amount = total - discount_amount`

**Mã giảm giá mẫu trong hệ thống:**

| Mã        | Loại    | Giá trị   | Ngưỡng tối thiểu | Hạn dùng   | Số lần/người |
| --------- | ------- | --------- | ---------------- | ---------- | ------------ |
| `SAVE10`  | percent | 10%       | 300,000 ₫        | 2099-12-31 | 1            |
| `BIGBUY`  | fixed   | 50,000 ₫  | 500,000 ₫        | 2099-12-31 | 1            |
| `VIP100`  | fixed   | 100,000 ₫ | 300,000 ₫        | 2099-12-31 | 2            |
| `EXPIRED` | percent | 20%       | 100,000 ₫        | 2020-01-01 | 1            |

---

## 5. Quản lý Đơn hàng

### FR-10: Trạng thái Đơn hàng (Order State Machine)

Đơn hàng có **5 trạng thái** và phải tuân theo sơ đồ chuyển đổi sau:

```
                 [Admin xác nhận]          [Admin giao hàng]      [Admin hoàn tất]
  ┌──────────┐ ─────────────────► ┌───────────┐ ──────────────► ┌──────────┐ ──────────► ┌───────────┐
  │ pending  │                    │ confirmed │                  │ shipping │             │ delivered │
  └──────────┘                    └───────────┘                  └──────────┘             └───────────┘
       │                               │
       │ [User/Admin hủy]              │ [User/Admin hủy]
       ▼                               ▼
  ┌──────────┐                    ┌──────────┐
  │ canceled │                    │ canceled │
  └──────────┘                    └──────────┘
```

**Ràng buộc trạng thái kết thúc (Final States):**

- Trạng thái `delivered` và `canceled` là **trạng thái kết thúc** — không được phép chuyển sang bất kỳ trạng thái nào khác.
- Khi đơn hàng đã ở trạng thái `shipping`, **User không được phép tự hủy** — chỉ Admin mới có thể thao tác.
- Mọi chuyển đổi không hợp lệ phải trả về lỗi với thông báo phù hợp.

### FR-11: Xem lịch sử đơn hàng (User)

- Người dùng chỉ xem được đơn hàng của chính mình.
- Hiển thị: Mã đơn, Ngày đặt, Tổng tiền, Trạng thái hiện tại.
- Trạng thái phải được dịch sang tiếng Việt rõ ràng và phân biệt màu sắc.

---

## 6. Phân hệ Web Admin

### FR-12: Kiểm soát truy cập (Access Control)

- Phân hệ Admin chỉ dành cho tài khoản có `role = 'admin'`.
- **Tất cả** các API Admin (`/api/admin/*`) và các API có tính ảnh hưởng dữ liệu (`POST/PUT/DELETE /api/products`, `/api/categories`, `/api/coupons`) đều phải yêu cầu:
  1. Token JWT hợp lệ.
  2. `role = 'admin'` trong Token.

### FR-13: Dashboard

- Hiển thị tổng doanh thu: Chỉ tính tổng `total_amount` của các đơn có `status = 'delivered'`.
- Hiển thị tổng số đơn hàng.

### FR-14: Quản lý Danh mục (Category CRUD)

- Admin có thể Thêm / Xem / Xóa danh mục.
- Tên danh mục là bắt buộc, không được để trống.

### FR-15: Quản lý Sản phẩm (Product CRUD)

- Admin có thể Thêm / Xem / Sửa / Xóa sản phẩm.
- **Ràng buộc đầu vào:**
  - Tên sản phẩm: bắt buộc, tối đa 255 ký tự.
  - Giá: bắt buộc, phải là số **dương** (> 0).
  - Danh mục: bắt buộc, phải chọn từ danh sách có sẵn.
- Khi Sửa một sản phẩm, chỉ sản phẩm đó bị thay đổi — các sản phẩm khác giữ nguyên.

### FR-16: Import Sản phẩm từ CSV

- Admin có thể tải lên file CSV để import nhiều sản phẩm cùng lúc.
- **Yêu cầu file CSV:**
  - Đuôi file phải là `.csv`.
  - Dòng đầu tiên là header: `name,price,description,imageUrl,category_id`.
  - Hỗ trợ các trường có chứa dấu phẩy nếu được bọc trong dấu nháy kép (RFC 4180).
- **Validation trước khi import:**
  - `name` không được rỗng.
  - `price` phải là số dương.
- Nếu có lỗi ở bất kỳ dòng nào, toàn bộ import phải được **rollback** (giao dịch nguyên tử — all-or-nothing).
- Hệ thống hiển thị báo cáo rõ ràng: bao nhiêu dòng thành công, bao nhiêu dòng lỗi và lý do.

### FR-17: Quản lý Mã Giảm Giá (Coupon CRUD)

- Admin có thể Thêm / Xem / Xóa mã giảm giá.
- Các trường bắt buộc: `code` (duy nhất), `type` (percent/fixed), `discount_value` (dương), `expired_at`, `min_order_amount` (>= 0), `max_uses_per_user` (>= 1).

### FR-18: Quản lý Đơn hàng (Admin)

- Admin xem toàn bộ đơn hàng của tất cả người dùng.
- Admin có thể chuyển đổi trạng thái đơn hàng theo đúng State Machine đã định nghĩa ở FR-10.
- Địa chỉ giao hàng phải được hiển thị **an toàn** (không render HTML).

### FR-19: Quản lý Người dùng (Admin)

- Admin xem danh sách tất cả người dùng (không lộ mật khẩu).
- Admin có thể xóa người dùng, **ngoại trừ không được xóa chính tài khoản đang đăng nhập**.

---

## 7. Phân hệ Mobile (React Native)

### FR-20: Tính năng Mobile

- Đầy đủ các chức năng: Xem sản phẩm, Đăng nhập, Đăng xuất, Đăng ký, Giỏ hàng, Thanh toán, Hồ sơ, Lịch sử đơn hàng.
- Chức năng Hủy đơn hàng tuân theo đúng State Machine ở FR-10 (chỉ được hủy khi `pending` hoặc `confirmed`).

---

## 8. Yêu cầu Giao diện (GUI Requirements)

### FR-21: Tiêu chuẩn Giao diện Chung

- **Nhất quán ngôn ngữ**: Toàn bộ giao diện dùng tiếng Việt (trừ thuật ngữ kỹ thuật chuẩn).
- **Nhất quán màu sắc**: Các nút hành động tích cực (Submit, Mua hàng) dùng màu xanh dương. Các nút nguy hiểm/hủy bỏ dùng màu đỏ.
- **Nhất quán đơn vị tiền**: Luôn dùng ký hiệu `₫` với định dạng phân cách hàng nghìn.
- **Tiêu đề trang**: Mỗi trang có đúng 1 thẻ `<h1>` mô tả nội dung trang.
- **Tab Order**: Thứ tự focus theo Tab phải đi từ trên xuống dưới, trái sang phải.

### FR-22: Form Requirements

- Tất cả trường bắt buộc phải có ký hiệu `*` bên cạnh nhãn.
- Trường Email phải dùng `type="email"`.
- Trường Mật khẩu phải dùng `type="password"` (không hiển thị rõ).
- Thông báo lỗi phải xuất hiện **trên** nút submit, không phải bên dưới.
- Các form có từ 2 bước trở lên phải có **Step Indicator** rõ ràng.

### FR-23: Navigation Requirements

- Thanh điều hướng (Navbar) phải **highlight** trang đang được chọn.
- Link "Giỏ hàng" phải hiển thị **badge số lượng** sản phẩm trong giỏ.
- Nút Đăng xuất phải nhãn là "Đăng xuất" (không phải "Thoát").
- Breadcrumb bắt buộc có ở các trang con (Giỏ hàng, Thanh toán, Chi tiết sản phẩm).

### FR-24: Feedback & State Requirements

- Sau khi bấm "Thêm vào giỏ", phải có phản hồi trực quan (toast/badge).
- Khi xóa item khỏi giỏ phải có dialog xác nhận.
- Trang trống (Empty State) phải có icon/hình minh họa và message thân thiện.
- Tất cả ảnh sản phẩm phải có thuộc tính `alt` mô tả nội dung ảnh (không để rỗng).

---

## 9. Yêu cầu Bảo mật (Security Requirements — Tham khảo)

| ID     | Yêu cầu                                                                                                         |
| ------ | --------------------------------------------------------------------------------------------------------------- |
| SEC-01 | Mật khẩu **không** được lưu dưới dạng plaintext.                                                                |
| SEC-02 | Các API có tính bảo mật phải yêu cầu JWT Token hợp lệ.                                                          |
| SEC-03 | API Admin phải kiểm tra `role = 'admin'` trong Token, không chỉ kiểm tra sự tồn tại của Token.                  |
| SEC-04 | Mọi dữ liệu từ user nhập vào khi hiển thị trên UI phải được escape đúng cách, không dùng `innerHTML` trực tiếp. |
| SEC-05 | Truy vấn CSDL phải dùng Parameterized Query, không nối chuỗi trực tiếp.                                         |
| SEC-06 | API cập nhật hồ sơ không được cho phép thay đổi trường `role` từ client.                                        |
| SEC-07 | OTP đặt lại mật khẩu phải đủ entropy (tối thiểu 6 chữ số), có thời hạn và vô hiệu hóa sau khi dùng.             |

---

_Tài liệu này phục vụ cho mục đích học tập và thực hành Kiểm thử Phần mềm. Phiên bản: 2.0 — Cập nhật: 2026-05-14._


Format: {
    "info": {
        "name": "FR7 Add To Cart API Test Collection",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [
        {
            "name": "TC-CART-001: Valid Cart Add Request",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 1,\n  \"name\": \"iPhone 15 Pro\",\n  \"price\": 999.99,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(200); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-002: Price Zero",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 2,\n  \"name\": \"Free Sample\",\n  \"price\": 0,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-003: Negative Price",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 3,\n  \"name\": \"Discount Item\",\n  \"price\": -10,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-004: Very Large Price (Exceeds Maximum)",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 4,\n  \"name\": \"Expensive Item\",\n  \"price\": 999999999.99,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-005: Price with Too Many Decimal Places",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 5,\n  \"name\": \"Precise Item\",\n  \"price\": 10.999,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-006: Negative Quantity",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 6,\n  \"name\": \"Test Product\",\n  \"price\": 50,\n  \"quantity\": -5\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-007: Zero Quantity",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 7,\n  \"name\": \"Test Product\",\n  \"price\": 50,\n  \"quantity\": 0\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-008: Very Large Quantity",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 8,\n  \"name\": \"Bulk Product\",\n  \"price\": 10,\n  \"quantity\": 999999\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-009: Quantity as Decimal/Float",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 9,\n  \"name\": \"Test Product\",\n  \"price\": 25,\n  \"quantity\": 1.5\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-010: Empty Product ID",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": \"\",\n  \"name\": \"Test Product\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-011: Null Product ID",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": null,\n  \"name\": \"Test Product\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-012: Non-Numeric ID",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": \"abc123\",\n  \"name\": \"Test Product\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-013: Empty Product Name",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 10,\n  \"name\": \"\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-014: Null Product Name",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 11,\n  \"name\": null,\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-015: Very Long Product Name",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 12,\n  \"name\": \"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-016: XSS Payload in Product Name",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 13,\n  \"name\": \"\u003cscript\u003ealert(\u0027XSS\u0027)\u003c/script\u003e\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-017: SQL Injection in Product Name",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 14,\n  \"name\": \"Product\u0027; DROP TABLE cart;--\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-018: SQL Injection in ID Field",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": \"1 OR 1=1\",\n  \"name\": \"Test Product\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-019: Missing ID Field",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"name\": \"Test Product\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-020: Missing Name Field",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 15,\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-021: Missing Price Field",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 16,\n  \"name\": \"Test Product\",\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-022: Missing Quantity Field",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 17,\n  \"name\": \"Test Product\",\n  \"price\": 25\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-023: Extra Unknown Field in Request",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 18,\n  \"name\": \"Test Product\",\n  \"price\": 25,\n  \"quantity\": 1,\n  \"extraField\": \"shouldBeIgnored\"\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(200); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-024: No Authentication Token",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 1,\n  \"name\": \"Product\",\n  \"price\": 10,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(401); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-025: Invalid Authentication Token Format",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "InvalidToken",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 1,\n  \"name\": \"Product\",\n  \"price\": 10,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(401); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-026: Expired Authentication Token",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzg3OTE2MTAxLCJpYXQiOjE3ODc5MTk3MDF9.KDSAjPQz9ed2Btxl4pazwsHNPpw1KN7FWxkWKmBiDco",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 1,\n  \"name\": \"Product\",\n  \"price\": 10,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(401); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-027: SQL Injection via Price Parameter",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 19,\n  \"name\": \"Test Product\",\n  \"price\": \"50; DROP TABLE users;--\",\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-028: SQL Injection via Quantity Parameter",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 20,\n  \"name\": \"Test Product\",\n  \"price\": 25,\n  \"quantity\": \"1; DELETE FROM cart;--\"\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-029: Price as String Instead of Number",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 21,\n  \"name\": \"Test Product\",\n  \"price\": \"fifty\",\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-030: Quantity as String Instead of Number",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 22,\n  \"name\": \"Test Product\",\n  \"price\": 25,\n  \"quantity\": \"one\"\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-031: Invalid JSON Format",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{id: 23, name: \"Test\", price: 25, quantity: 1}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-032: Empty Request Body",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-033: Non-Existent Product ID",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 999999,\n  \"name\": \"Non-existent Product\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(404); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-034: Adding Same Product Twice",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 24,\n  \"name\": \"Test Product\",\n  \"price\": 25,\n  \"quantity\": 2\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(200); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-035: Price Mismatch with Server",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 25,\n  \"name\": \"Product A\",\n  \"price\": 10,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-036: Unicode Characters in Product Name",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 26,\n  \"name\": \"Sáº£n Pháº©m Tiáº¿ng Viá»‡t\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(200); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-037: Duplicate Cart Item (Same ID, Different Name)",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 27,\n  \"name\": \"Different Name\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(200); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-038: Missing Authorization Header (Bearer Prefix)",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzg3OTE2MTAxLCJpYXQiOjE3ODc5MTk3MDF9.KDSAjPQz9ed2Btxl4pazwsHNPpw1KN7FWxkWKmBiDco",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 1,\n  \"name\": \"Product\",\n  \"price\": 10,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(401); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-039: Special Characters in Product Name",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 28,\n  \"name\": \"Product @#$%^\u0026*()\",\n  \"price\": 25,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(200); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-040: Floating Point Precision in Price",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 29,\n  \"name\": \"Precise Product\",\n  \"price\": 0.30000000000000004,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(200); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-041: Very Small Positive Price",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 30,\n  \"name\": \"Cheap Product\",\n  \"price\": 0.01,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(200); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-042: Negative Price via Type Coercion",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{authToken}}",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 31,\n  \"name\": \"Test Product\",\n  \"price\": \"-10.00\",\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(400); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        },
        {
            "name": "TC-CART-043: No Bearer Token (Basic Auth Instead)",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json",
                        "type": "text"
                    },
                    {
                        "key": "X-Student-Id",
                        "value": "{{studentId}}",
                        "type": "text"
                    },
                    {
                        "key": "Authorization",
                        "value": "Basic dXNlcjpwYXNz",
                        "type": "text"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"id\": 1,\n  \"name\": \"Product\",\n  \"price\": 10,\n  \"quantity\": 1\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/cart",
                    "host": [
                        "{{baseUrl}}"
                    ],
                    "path": [
                        "api",
                        "cart"
                    ]
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "exec": [
                            "pm.test(\"Status code is expected\", function () { pm.expect(pm.response.code).to.eql(401); });"
                        ],
                        "type": "text/javascript"
                    }
                }
            ]
        }
    ]
}
{
  "id": "fr7-add-to-cart-env",
  "name": "FR-7 Add To Cart - Local",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000",
      "type": "default",
      "enabled": true
    },
    {
      "key": "studentId",
      "value": "23127325",
      "type": "default",
      "enabled": true
    },
    {
      "key": "authToken",
      "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzg3OTE5NzAxfQ.K_VEn6_RwQ0CzbWVQDETKME84BAOqFYIU3Sds_djHB4",
      "type": "default",
      "enabled": true
    }
  ]
}


Data I Seed into Backend: const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to database');
    }
});

function initDatabase() {
    db.serialize(() => {
        db.run('DROP TABLE IF EXISTS coupon_usage');
        db.run('DROP TABLE IF EXISTS coupons');
        db.run('DROP TABLE IF EXISTS users');
        db.run('DROP TABLE IF EXISTS products');
        db.run('DROP TABLE IF EXISTS categories');
        db.run('DROP TABLE IF EXISTS orders');

        // Create Categories Table
        db.run(`CREATE TABLE categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        )`);

        // Create Coupons Table
        db.run(`CREATE TABLE coupons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE,
            type TEXT DEFAULT 'percent',
            discount_value INTEGER,
            min_order_amount INTEGER DEFAULT 0,
            expired_at DATETIME,
            is_active INTEGER DEFAULT 1,
            max_uses_per_user INTEGER DEFAULT 1
        )`);

        // Create Coupon Usage Table
        db.run(`CREATE TABLE coupon_usage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            coupon_id INTEGER,
            user_id INTEGER,
            used_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Create Users Table
        // Added columns for Phase 2 & 3: login_attempts, locked_until, reset_token, shipping_address, phone
        db.run(`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            password TEXT,
            role TEXT DEFAULT 'user',
            login_attempts INTEGER DEFAULT 0,
            locked_until DATETIME,
            reset_token TEXT,
            shipping_address TEXT,
            phone TEXT
        )`);

        // Create Products Table
        db.run(`CREATE TABLE products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price INTEGER,
            description TEXT,
            imageUrl TEXT,
            category_id INTEGER
        )`);

        // Create Orders Table
        db.run(`CREATE TABLE orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            total_amount INTEGER,
            status TEXT DEFAULT 'pending',
            shipping_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Seed Categories
        const insertCategory = db.prepare('INSERT INTO categories (name) VALUES (?)');
        insertCategory.run('Điện thoại');
        insertCategory.run('Laptop');
        insertCategory.run('Phụ kiện');
        insertCategory.finalize();

        // Seed Users
        const insertUser = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
        insertUser.run('Admin User', 'admin@eshop.com', 'Admin123!', 'admin');
        insertUser.run('User', 'lgbao23@clc.fitus.edu.vn', 'Admin123!', 'admin');
        insertUser.run('Test User', 'test@eshop.com', 'Test1234!', 'user');
        insertUser.finalize();

        // Seed Products
        const insertProduct = db.prepare('INSERT INTO products (name, price, description, imageUrl, category_id) VALUES (?, ?, ?, ?, ?)');
        insertProduct.run('iPhone 15 Pro Max', 30000000, 'Điện thoại cao cấp của Apple', 'https://placehold.co/300x300/png?text=iPhone+15', 1);
        insertProduct.run('Samsung Galaxy S24 Ultra', 28000000, 'Màn hình hiển thị xuất sắc, camera siêu zoom', 'https://placehold.co/300x300/png?text=Samsung+S24', 1);
        insertProduct.run('MacBook Pro M3', 45000000, 'Laptop chuyên nghiệp mạnh mẽ', 'https://placehold.co/300x300/png?text=Macbook+Pro', 2);
        insertProduct.run('Tai nghe AirPods Pro 2', 6000000, 'Chống ồn chủ động xuất sắc', 'https://placehold.co/300x300/png?text=AirPods+Pro', 3);
        insertProduct.run('Bàn phím cơ Keychron Q1', 4000000, 'Gõ cực sướng, thiết kế kim loại', 'https://placehold.co/300x300/png?text=Keychron+Q1', 3);
        insertProduct.finalize();

        // Seed Coupons
        const insertCoupon = db.prepare('INSERT INTO coupons (code, type, discount_value, min_order_amount, expired_at, is_active, max_uses_per_user) VALUES (?, ?, ?, ?, ?, ?, ?)');
        insertCoupon.run('SAVE10', 'percent', 10, 300000, '2099-12-31', 1, 1);   // 10% off, min 300k, valid
        insertCoupon.run('BIGBUY', 'fixed', 50000, 500000, '2099-12-31', 1, 1);  // 50k off, min 500k, valid
        insertCoupon.run('VIP100', 'fixed', 100000, 300000, '2099-12-31', 1, 2); // 100k off, min 300k, max 2 uses
        insertCoupon.run('EXPIRED', 'percent', 20, 100000, '2020-01-01', 1, 1);  // 20% off, EXPIRED
        insertCoupon.finalize();
        // Seed Orders
        // Seed Orders for BVA-FR11-05
        // Seed Orders for DT-FR13-01
        const insertOrder = db.prepare(`
    INSERT INTO orders (
        user_id,
        total_amount,
        status,
        shipping_address,
        created_at
    ) VALUES (?, ?, ?, ?, ?)
`);

        const address = '123 Nguyen Hue, District 1, Ho Chi Minh City';

        // 1 Delivered order (counts toward revenue)
        insertOrder.run(
            2,
            600000,
            'delivered',
            address,
            '2026-07-01 10:00:00'
        );

        // 1 Pending order
        insertOrder.run(
            2,
            100000,
            'pending',
            address,
            '2026-07-02 10:00:00'
        );

        // 1 Processing / Confirmed order
        insertOrder.run(
            2,
            100000,
            'shipping',      // change to 'confirmed' if your system uses confirmed
            address,
            '2026-07-03 10:00:00'
        );

        insertOrder.run(
            2,
            100000,
            'confirmed',         // change to 'shipping' if your system uses shipping
            address,
            '2026-07-04 10:00:00'
        );

        // 1 Cancelled order
        insertOrder.run(
            2,
            100000,
            'canceled',       // change to 'canceled' if your system uses canceled
            address,
            '2026-07-05 10:00:00'
        );

        // Additional orders for cancel_order testing (to avoid mutation conflict between test cases)
        // Order ID 6: pendingOrderIdXSS (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-06 10:00:00');
        // Order ID 7: pendingOrderIdExtra (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-07 10:00:00');
        // Order ID 8: pendingOrderIdInvalidJSON (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-08 10:00:00');
        // Order ID 9: pendingOrderIdMissingCT (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-09 10:00:00');
        // Order ID 10: pendingOrderIdExpiredSession (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-10 10:00:00');
        // Order ID 11: rateLimitOrderId (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-11 10:00:00');
        // Order ID 12: concurrentOrderId (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-12 10:00:00');
        // Order ID 13: transitionOrderId (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-13 10:00:00');
        // Order ID 14: schemaOrderId (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-14 10:00:00');
        // Order ID 15: verificationOrderId (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-15 10:00:00');
        // Order ID 16: concurrentUpdateOrderId (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-16 10:00:00');
        // Order ID 17: timestampOrderId (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-17 10:00:00');
        // Order ID 18: refundedOrderId (does not mutate because status is delivered, causing 400 Bad Request)
        insertOrder.run(2, 100000, 'delivered', address, '2026-07-18 10:00:00');
        // Order ID 19: expiredWindowOrderId (does not mutate because status is delivered, causing 400 Bad Request)
        insertOrder.run(2, 100000, 'delivered', address, '2026-07-19 10:00:00');
        // Order ID 20: otherUserOrderId (belongs to user 3, causing 404/403 when user 2 accesses it)
        insertOrder.run(3, 100000, 'pending', address, '2026-07-20 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-21 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-22 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-23 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-24 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-25 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-26 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-27 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-28 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-29 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-30 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-31 10:00:00');


        // const insertOrder = db.prepare(`
        //     INSERT INTO orders (
        //         user_id,
        //         total_amount,
        //         status,  
        //         shipping_address,
        //         created_at
        //     ) VALUES (?, ?, ?, ?, ?)
        // `);

        // insertOrder.run(
        //     2,
        //     30000000,
        //     'pending',
        //     '123 Nguyen Hue, District 1, Ho Chi Minh City',
        //     '2026-07-01 09:30:00'
        // );

        // insertOrder.run(
        //     2,
        //     34000000,
        //     'processing',
        //     '123 Nguyen Hue, District 1, Ho Chi Minh City',
        //     '2026-07-02 14:15:00'
        // );

        // insertOrder.run(
        //     2,
        //     45000000,
        //     'shipped',
        //     '123 Nguyen Hue, District 1, Ho Chi Minh City',
        //     '2026-07-03 10:45:00'
        // );

        // insertOrder.run(
        //     2,
        //     6000000,
        //     'delivered',
        //     '123 Nguyen Hue, District 1, Ho Chi Minh City',
        //     '2026-07-04 18:20:00'
        // );

        // insertOrder.run(
        //     1,
        //     28000000,
        //     'cancelled',
        //     '456 Le Loi, District 3, Ho Chi Minh City',
        //     '2026-07-05 11:00:00'
        // );

        insertOrder.finalize();
        console.log('Database initialized and seeded (Phase 2).');
    });
}

initDatabase();

module.exports = db;
