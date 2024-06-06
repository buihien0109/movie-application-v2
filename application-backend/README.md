# Trang Web Xem Phim Trực Tuyến

**Link demo**: 
- Trang người dùng: [Link](http://103.237.144.171:8888/)
- Trang đăng nhập: [Link](http://103.237.144.171:8888/dang-nhap)

**Tài khoản thử nghiệm:**

- **ROLE_ADMIN**
  - Email: admin@gmail.com
  - Mật khẩu: 123

- **ROLE_USER**
  - Email: duy@gmail.com
  - Mật khẩu: 123

## Mục lục
1. [Giới thiệu](#giới-thiệu)
2. [Tính năng](#tính-năng)
3. [Công nghệ sử dụng](#công-nghệ-sử-dụng)
4. [Sơ đồ thiết kế cơ sở dữ liệu](#sơ-đồ-thiết-kế-cơ-sở-dữ-liệu)
5. [Bắt đầu](#bắt-đầu)
    - [Yêu cầu](#yêu-cầu)
    - [Cài đặt](#cài-đặt)
    - [Chạy ứng dụng trên local](#chạy-ứng-dụng-trên-local)
    - [Triển khai với Docker](#triển-khai-với-docker)
6. [Liên hệ](#liên-hệ)

## Giới thiệu

**Web Xem Phim Trực Tuyến** - một nền tảng giúp bạn dễ dàng tìm kiếm, xem và quản lý các bộ phim yêu thích. Ứng dụng này được phát triển với mục tiêu cung cấp trải nghiệm người dùng mượt mà và an toàn cho cả người dùng thông thường và quản trị viên.

## Tính năng

### Người dùng
- Tìm kiếm phim theo danh mục, thể loại, quốc gia
- Xem thông tin chi tiết phim
- Xem phim trực tuyến
- Xem thông tin các bài viết
- Đăng ký tài khoản, đăng nhập, đăng xuất
- Quản lý thông tin cá nhân
- Review phim, thêm phim vào danh sách yêu thích, xem lịch sử xem phim, quản lý đơn hàng, ...
- Tìm kiếm, xem, mua phim trả phí

### Quản trị viên
- Xem các thông số thống kê tổng quan
- Quản lý phim
- Quản lý thể loại
- Quản lý tin tức
- Quản lý người dùng
- Quản lý diễn viên
- Quản lý đạo diễn
- Quản lý đơn hàng
- ...

## Công nghệ sử dụng

- Spring Boot
- Spring Security
- Spring Data JPA
- Thymeleaf
- MySQL
- Docker
- Docker Compose
- ...

## Sơ đồ thiết kế cơ sở dữ liệu

- [Sơ đồ cơ sở dữ liệu](https://dbdiagram.io/d/db-movie-app-659cc597ac844320ae80c2f9)

## Bắt đầu

### Yêu cầu

- Java 8 trở lên
- Cơ sở dữ liệu MySQL
- Docker (nếu triển khai với Docker)

### Cài đặt

1. **Cloning repository:**
    ```bash
    git clone https://github.com/buihien0109/movie-application.git
    ```

### Chạy ứng dụng trên local

1. Di chuyển vào thư mục backend:
    ```bash
    cd movie-application
    ```
2. Cấu hình kết nối cơ sở dữ liệu trong `src/main/resources/application.properties`:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/your_db_name
    spring.datasource.username=your_username
    spring.datasource.password=your_password
    ```
3. Xây dựng và chạy backend:
    ```bash
    mvn clean install
    mvn spring-boot:run
    ```

### Triển khai với Docker
Trong thư mục root của ứng dụng, sử dụng Docker Compose để triển khai ứng dụng.

Chạy các containers:

```bash
docker-compose up -d
```

## Liên hệ

Email - [buivanhien19tb@gmail.com](mailto:buivanhien19tb@gmail.com)