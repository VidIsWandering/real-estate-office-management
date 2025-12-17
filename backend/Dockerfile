# ----- Tầng 1: Tầng Build (Build Stage) -----
# Sử dụng một image Node.js 18 (Alpine) làm base
FROM node:18-alpine AS builder

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào trước
# Điều này tận dụng Docker cache, giúp build nhanh hơn
COPY package.json package-lock.json ./

# Cài đặt 'npm ci' (Clean Install) thay vì 'npm install'
# 'ci' nhanh hơn và an toàn hơn cho production/build
RUN npm ci

# Sao chép toàn bộ phần code còn lại của backend vào
COPY . .

# (Tùy chọn - Nếu bạn có bước build Typescript, hãy thêm vào đây)
# RUN npm run build


# ----- Tầng 2: Tầng Production (Production Stage) -----
# Sử dụng một image Node.js 18 (Alpine) mới, sạch sẽ
FROM node:18-alpine

WORKDIR /app

# Chỉ sao chép các file cần thiết từ tầng 'builder'
# 1. Sao chép thư mục node_modules đã được cài đặt
COPY --from=builder /app/node_modules ./node_modules

# 2. Sao chép code đã được sao chép ở tầng builder
COPY --from=builder /app ./

# Mở cổng (port) mà ứng dụng Node.js của bạn sẽ chạy
# (Giả sử bạn chạy ở cổng 8080, hãy đổi nếu cần)
EXPOSE 8080

# Lệnh để khởi động ứng dụng
# (Chúng ta sẽ dùng 'npm start' làm chuẩn, bạn cần đảm bảo 'package.json' có script này)
CMD [ "npm", "start" ]