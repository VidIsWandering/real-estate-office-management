# ----- Tầng 1: Tầng Build (Build Stage) -----
# Sử dụng một image Node.js 18 (Alpine) làm base
FROM node:18-alpine AS builder

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào trước
COPY package.json package-lock.json ./

# Cài đặt 'npm ci' (Clean Install)
RUN npm ci

# Sao chép toàn bộ phần code còn lại của frontend vào
COPY . .

# Chạy lệnh build của Create React App
# Điều này sẽ tạo ra một thư mục 'build' chứa các file tĩnh (HTML, CSS, JS)
RUN npm run build


# ----- Tầng 2: Tầng Production (Serving Stage) -----
# Sử dụng một image Nginx (web server) siêu nhẹ để phục vụ file
FROM nginx:1.25-alpine

# Mở cổng 80 (cổng HTTP mặc định)
EXPOSE 80

# Sao chép các file tĩnh đã được build ở Tầng 1
# từ thư mục '/app/build' của Tầng 1
# vào thư mục phục vụ web mặc định của Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# (Tùy chọn) Sao chép file cấu hình Nginx nếu bạn có file custom
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx sẽ tự động khởi động khi container chạy