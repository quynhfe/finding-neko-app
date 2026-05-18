🧩 FINDING NEKO – SCREEN FLOW BREAKDOWN (CHO DESIGNER)

🔵 FLOW 1 – ONBOARDING
1. Splash Screen
Mục đích:
Tạo ấn tượng đầu tiên, nhận diện thương hiệu.
Thành phần:
Logo Finding Neko (center)
Background pastel
Loading nhẹ 2–3s

2. Onboarding Screen 1
Mục đích:
Giới thiệu tính năng chia sẻ mèo.
Thành phần:
Illustration mèo
Title lớn
Subtitle ngắn
Nút “Tiếp tục”
Indicator 1/3

3. Onboarding Screen 2
Mục đích:
Giới thiệu cộng đồng hỗ trợ.
Thành phần:
Illustration cộng đồng
Title
Subtitle
Nút “Tiếp tục”
Indicator 2/3

4. Onboarding Screen 3
Mục đích:
Giới thiệu AI nhận diện.
Thành phần:
Illustration AI scan
Title
Subtitle
Nút Primary “Bắt đầu”
Indicator 3/3

🟢 FLOW 2 – AUTH
5. Đăng nhập
Mục đích:
Cho user vào hệ thống nhanh nhất.
Thành phần:
Logo nhỏ
Input email/SĐT
Input mật khẩu
Button “Đăng nhập”
Link “Tạo tài khoản”
Link “Quên mật khẩu”

6. Đăng ký
Mục đích:
Tạo tài khoản mới.
Thành phần:
Input tên
Input email/SĐT
Input mật khẩu
Button “Đăng ký”
Link quay lại đăng nhập

🟡 FLOW 3 – FEED (TRANG CHỦ)
7. Feed – Có bài đăng
Mục đích:
Tạo thói quen sử dụng hằng ngày.
Thành phần:
Header (Tên app + icon thông báo)
Danh sách card
Ảnh mèo
Tên mèo
Tên chủ
Thời gian
Nút ❤️
Bottom tab bar

8. Feed – Empty State
Mục đích:
Tránh cảm giác trống khi chưa có nội dung.
Thành phần:
Illustration nhỏ
Text “Chưa có bài đăng”
Button “Đăng bài đầu tiên”

🟣 FLOW 4 – CREATE POST
9. Chọn ảnh
Mục đích:
Cho user bắt đầu tạo bài.
Thành phần:
Camera / Gallery picker
Preview nhỏ

10. Tạo bài đăng
Mục đích:
Hoàn thiện bài trước khi đăng.
Thành phần:
Ảnh preview lớn
Input caption
Chọn mèo (dropdown)
Button “Đăng”

🟠 FLOW 5 – HỒ SƠ MÈO
11. Danh sách mèo
Mục đích:
Quản lý các mèo của user.
Thành phần:
Card mèo (ảnh + tên)
Button “Thêm mèo”

12. Tạo hồ sơ mèo
Mục đích:
Lưu thông tin nhận diện cho AI.
Thành phần:
Upload ảnh đại diện
Input tên
Input tuổi
Input giống
Input đặc điểm
Button “Lưu”

13. Hồ sơ mèo (Normal State)
Mục đích:
Xem thông tin và kích hoạt Lost Mode.
Thành phần:
Ảnh lớn
Tên mèo
Thông tin
Button Primary “Bật chế độ Mèo lạc”
Grid ảnh timeline

🔴 FLOW 6 – LOST MODE (QUAN TRỌNG NHẤT)
14. Form đăng mất mèo
Mục đích:
Cho chủ khai báo nhanh, rõ ràng.
Thành phần:
Ảnh mèo
Chọn vị trí (map preview nhỏ)
Input mô tả
Reward (optional)
Button “Đăng tin tìm mèo”

15. Đăng thành công
Mục đích:
Trấn an người dùng.
Thành phần:
Icon xác nhận
Text “Cộng đồng đang giúp bạn”
Button “Xem tin của tôi”

16. Trạng thái đang tìm
Mục đích:
Hiển thị mèo đang trong Lost Mode.
Thành phần:
Badge “Đang tìm”
Thông tin vị trí
Danh sách người báo đã thấy
Button “Đã tìm thấy”

17. Đã tìm thấy
Mục đích:
Tạo cảm xúc tích cực.
Thành phần:
Text lớn “Đã tìm thấy!”
Ảnh mèo
Tên người giúp
Button “Gửi lời cảm ơn”

🔵 FLOW 7 – RADAR (NGƯỜI KHÁC THẤY MÈO)
18. Danh sách mèo lạc gần bạn
Mục đích:
Cho cộng đồng hỗ trợ.
Thành phần:
List card:
Ảnh nhỏ
Tên mèo
Khoảng cách
Badge “Đang tìm”
Button “Tôi đã thấy”

19. Upload ảnh đã thấy
Mục đích:
Gửi bằng chứng cho AI.
Thành phần:
Upload ảnh
Button “Phân tích”

20. AI đang phân tích
Mục đích:
Tạo cảm giác hệ thống đang làm việc.
Thành phần:
Ảnh
Animation scanning
Text “Đang phân tích…”

21. Kết quả match
Mục đích:
Thông báo kết quả AI.
Nếu match cao:
Ảnh so sánh
% tương đồng
Button “Gửi cho chủ”
Nếu không match:
Text nhẹ nhàng
Button “Đóng”

🟣 FLOW 8 – LEADERBOARD (OPTIONAL MVP)
22. Bảng xếp hạng
Mục đích:
Tạo động lực cộng đồng.
Thành phần:
Top 3 nổi bật
List top 10
Avatar + sao

🎯 TỔNG SỐ MÀN MVP CẦN THIẾT KẾ
Khoảng 22 màn chính.

💡 NHẤN MẠNH CHO DESIGNER
Quan trọng nhất cần đầu tư:
Feed (vì dùng mỗi ngày)
Form mất mèo (vì rất nhạy cảm)
AI match (vì là core value)
Các màn còn lại giữ đơn giản, không overdesign.

Nếu bạn muốn, tôi có thể viết thêm:
Checklist review để đánh giá designer làm đúng chưa
Hoặc sắp xếp thứ tự ưu tiên thiết kế trước màn nào
Giờ bản này đủ chi tiết để designer hiểu rõ từng màn và mục đích UX của nó rồi.


