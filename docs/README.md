# Tài liệu Thiết kế Hệ thống

Đây là nơi chứa các tài liệu thiết kế và đặc tả cho dự án.

## 1. Biểu đồ Use Case (PlantUML)

Biểu đồ dưới đây được render "live" từ file `diagrams/use_case_diagram.plantuml`.
Mọi thay đổi trên file `.plantuml` sẽ tự động được cập nhật ở đây khi push lên GitHub.

```plantuml
!include ./diagrams/use_case_diagram.plantuml
```

## 2. Cách lấy ảnh PNG cho Báo cáo

Khi bạn push file `.plantuml` lên, GitHub Action (CI) sẽ tự động chạy và tạo ra file `use_case_diagram.png` trong cùng thư mục `docs/diagrams/`.