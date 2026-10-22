# LUMI - Living World 3D
**Thế Giới Sống 3D - Trò Chơi Mô Phỏng Cuộc Sống**

![LUMI Preview](https://via.placeholder.com/800x450/5D4037/FFFFFF?text=LUMI+Living+World+3D)

---

## 🎮 **Giới Thiệu**
LUMI là một trò chơi mô phỏng cuộc sống 3D **miễn phí**, chạy hoàn toàn trên trình duyệt web (không cần cài đặt). Trò chơi cho phép bạn:
- 🏡 Khám phá **LUMI VALLEY** - một thung lũng xanh mát với ngôi nhà ấm cúng
- 🪑 Tương tác với đồ nội thất (ngồi trên ghế sofa, ngủ trên giường, bật/tắt đèn)
- 🌿 Chăm sóc cây cối, tưới nước cho vườn
- ⏰ Trải nghiệm chu kỳ ngày/đêm với hệ thống ánh sáng động
- 🎨 Tùy chỉnh nội thất và trang trí ngôi nhà
- 💾 Lưu và tải tiến độ chơi
- 📱 Tối ưu hoàn toàn cho **Android Chrome** (và các trình duyệt mobile khác)

---

## 🚀 **Cách Chạy Trò Chơi**

### **1. Chạy Local (Trên Máy Tính)**
1. Tảiिकी zip project
2. Giải nén vào thư mục bất kỳ
3. Mở file `index.html` bằng trình duyệt (Chrome, Firefox, Edge)
4. Chờ tải xong và bắt đầu chơi!

### **2. Chạy Trên Android**
1. **Phương pháp 1 - Sử dụng GitHub Pages (Khuyến nghị)**
   - Tạo repository mới trên [GitHub](https://github.com)
   - Upload toàn bộ thư mục `LUMI-Living-World` lên repository
   - Vào **Settings → Pages**
   - Chọn **main branch** và thư mục `/root`
   - Sau vài phút, mở link `https://[username].github.io/[repo-name]/`

2. **Phương pháp 2 - Sử dụng Netlify**
   - Vào [Netlify Drop](https://app.netlify.com/drop)
   - Kéo thả thư mục `LUMI-Living-World` vào
   - Netlify sẽ tự động deploy
   - Sau khi deploy xong, mở link được cung cấp

3. **Phương pháp 3 - Sử dụng Local Server (Nếu GitHub Pages/Netlify không hoạt động)**
   - Cài đặt **Python** trên máy tính
   - Mở Terminal/Command Prompt trong thư mục project
   - Chạy lệnh:
     ```bash
     python -m http.server 8000
     ```
   - Mở trình duyệt và truy cập `http://localhost:8000`
   - **Trên Android**: Kết nối cùng mạng WiFi với máy tính, truy cập `http://[IP-máy-tính]:8000`

4. **Phương pháp 4 - Chạy trực tiếp trên điện thoại**
   - Sử dụng app **Terminal** (Termux) trên Android:
     ```bash
     pkg install python
     cd /sdcard/Download/LUMI-Living-World
     python -m http.server 8080
     ```
   - Mở Chrome và truy cập `http://localhost:8080`

---

## 🎯 **Điều Khiển Trò Chơi**

| Thao Tác | Mô Tả |
|----------|-------|
| **Joystick ảo** | Di chuyển nhân vật |
| **Kéo trên màn hình** | Xoay camera |
| **Nút 🔍** | Tương tác với vật thể (khi gần) |
| **Nút ↑** | Nhảy (tính năng dự phòng) |
| **Menu (góc trên bên phải)** | Mở menu tạm dừng |
| **WASD (Desktop)** | Di chuyển |
| **Chuột (Desktop)** | Xoay camera |

---

## ⚙️ **Cài Đặt & Tùy Chỉnh**

### **1. Cài Đặt Đồ Họa**
Trò chơi có 3 chế độ đồ họa:
- **Hiệu suất**: Tối ưu cho thiết bị yếu (30+ FPS)
- **Cân bằng**: Mức trung bình (45+ FPS)
- **Chất lượng**: Đẹp nhất (60 FPS trên thiết bị mạnh)

**Khuyến nghị**: Chọn **Cân bằng** cho hầu hết thiết bị

### **2. Âm Thanh**
- Bật/Tắt âm thanh qua menu **Cài đặt**
- Âm thanh bao gồm: tiếng chim, gió, bước chân, tương tác

---
---
## 🌍 **Thế Giới Trò Chơi**

### **1. Ngôi Nhà (LUMI HOME)**
- **Phòng khách**: Ghế sofa, bàn cà phê, đèn, kệ sách
- **Phòng ngủ**: Giường, tủ quần áo
- **Bếp**: Tủ lạnh, bếp, bồn rửa
- **Cửa ra vào**: Tương tác để mở/đóng

### **2. Khu Vườn (LUMI GARDEN)**
- Cây cối, hoa, đá cuội
- Đường đi, đèn vườn
- Ao nước nhỏ (nếu thiết bị đủ mạnh)

### **3. Bầu Trời & Môi Trường**
- Chu kỳ ngày/đêm mượt mà
- Ánh sáng mặt trời thực tế
- Bầu trời gradient đẹp mắt

---
---
## 📊 **Hệ Thống Mô Phỏng**

### **1. Trạng Thái Nhân Vật**
| Trạng Thái | Mô Tả | Tác Động |
|------------|-------|----------|
| **Năng lượng (⚡)** | Giảm khi chạy, hồi phục khi ngồi/ngủ | Cần > 20% để chạy |
| **Đói (🍗)** | Giảm theo thời gian | Cần ăn uống (tương lai) |
| **Hạnh phúc (😊)** | Tăng khi nghỉ ngơi, giảm khi đói | Ảnh hưởng đến tốc độ |

### **2. Hoạt Động**
| Hoạt Động | Cách Thực Hiện | Hiệu Ứng |
|-----------|----------------|-----------|
| **Ngồi** | Đi gần ghế sofa/ghế và nhấn 🔍 | Hồi phục năng lượng |
| **Ngủ** | Đi gần giường và nhấn 🔍 | Hồi phục toàn bộ |
| **Bật/Tắt Đèn** | Đi gần đèn và nhấn 🔍 | Thay đổi ánh sáng |
| **Tưới Cây** | Đi gần cây và nhấn 🔍 | Cây phát triển |
| **Mở Cửa** | Đi gần cửa và nhấn 🔍 | Vào/ra khỏi nhà |

---
---
## 💾 **Hệ Thống Lưu Trữ**

### **1. Tự Động Lưu**
- Trò chơi **tự động lưu** sau mỗi 30 giây
- Lưu: vị trí, trạng thái, thời gian, tùy chỉnh

### **2. Lưu Thủ Công**
- Nhấn **Lưu Trình Trạng** trong menu tạm dừng
- Thông báo xác nhận sẽ xuất hiện

### **3. Tải Trình Trạng**
- Nhấn **Tải Trình Trạng** trong menu chính
- Chỉ hoạt động nếu có dữ liệu đã lưu

### **4. Xóa Dữ Liệu**
- Xóa **LocalStorage** qua DevTools (F12 → Application → LocalStorage)
- Hoặc nhấn **Bắt Đầu Lại** trong menu tạm dừng

---
---
## 📱 **Tối Ưu Hoá Cho Mobile**

✅ **Hoạt động trên:**
- Android 8.0+ (Chrome, Firefox, Samsung Internet)
- iOS 12+ (Safari - có thể chậm hơn)

🎯 **Thiết bị khuyến nghị:**
- **Tối thiểu**: Snapdragon 430 / 2GB RAM
- **Tốt**: Snapdragon 625 / 4GB RAM
- **Tuyệt vời**: Snapdragon 710+ / 6GB RAM

⚡ **Mẹo tăng hiệu suất:**
1. Chọn chế độ **Hiệu suất** trong cài đặt
2. Đóng các tab không dùng đến
3. Sử dụnng trình duyệt **Chrome** (tối ưu nhất)
4. Kết nối WiFi 5GHz (nếu online)

---
---
## ⚠️ **Hạn Chế Hiện Tại**

| Tính Năng | Trạng Thái | Lý Do |
|-----------|------------|-------|
| **Âm thanh** | ⚠️ Cần tương tác | Chính sách trình duyệt chặn auto-play |
| **Ao nước** | ⚠️ Tùy thiết bị | Tắt trên thiết bị yếu để tiết kiệm FPS |
| ** Đa ngôn ngữ** | 🟡 Phát triển | Hiện chỉ có Tiếng Việt & English |
| **Nhân vật 3D** | ✅ Hoạt động | Sử dụng hình học procedural |
| **Shadow** | ⚠️ Giảm chất lượng | Tối ưu cho mobile |
| **Multiplayer** | ❌ Chưa có | Chưa triển khai |

---
---
## 🐞 **Khắc Phục Sự Cố**

### **1. Màn hình đen khi mở trò chơi**
- **Nguyên nhân**: WebGL không được hỗ trợ
- **Giải pháp**:
  - Cập nhật trình duyệt
  - Thử trình duyệt khác (Chrome → Firefox)
  - Kích hoạt WebGL: `chrome://flags/#enable-webgl` → Enable

### **2. Trò chơi chậm, giật lag**
- **Giải pháp**:
  - Chuyển sang chế độ **Hiệu suất** trong cài đặt
  - Đóng các ứng dụng nền
  - Khởi động lại thiết bị

### **3. Không thể tương tác với vật thể**
- **Giải pháp**:
  - Đảm bảo đứng đủ gần vật thể
  - Kiểm tra xem có hiển thị prompt tương tác không
  - Thử nhấn lại nút 🔍

### **4. Lưu trò chơi không hoạt động**
- **Giải pháp**:
  - Kiểm tra xem có đủ dung lượng lưu trữ không
  - Thử xóa dữ liệu cũ và chơi lại
  - Sử dụng trình duyệt chế độ riêng tư (incognito) để test

---
---
## 📋 **Checklist Kiểm Tra (Smoke Test)**

| STT | Tính Năng | Trạng Thái |
|-----|-----------|------------|
| 1 | ✅ Mở trò chơi không bị màn hình đen | ✔️ |
| 2 | ✅ Hiển thị menu chính đúng cách | ✔️ |
| 3 | ✅ Nhấn "Bắt Đầu" vào được trò chơi | ✔️ |
| 4 | ✅ Di chuyển bằng joystick ảo | ✔️ |
| 5 | ✅ Xoay camera bằng chạm | ✔️ |
| 6 | ✅ Nhân vật va chạm với tường | ✔️ |
| 7 | ✅ Vào/ra khỏi nhà | ✔️ |
| 8 | ✅ Ngồi trên ghế sofa | ✔️ |
| 9 | ✅ Ngủ trên giường | ✔️ |
| 10 | ✅ Bật/tắt đèn | ✔️ |
| 11 | ✅ Tưới cây | ✔️ |
| 12 | ✅ Chu kỳ ngày/đêm thay đổi | ✔️ |
| 13 | ✅ HUD hiển thị đúng trạng thái | ✔️ |
| 14 | ✅ Menu tạm dừng hoạt động | ✔️ |
| 15 | ✅ Lưu/tải trò chơi | ✔️ |
| 16 | ✅ Cài đặt đồ họa/âm thanh | ✔️ |
| 17 | ✅ Chạy được trên Android Chrome | ✔️ |
| 18 | ✅ Hiển thị cảnh báo khi dựng điện thoại | ✔️ |

---
---
## 🔧 **Cách Đóng Góp**

Bạn có thể đóng góp cho dự án bằng cách:
1. **Báo lỗi**: Mở Issues trên GitHub
2. **Đề xuất tính năng**: Tạo Pull Request
3. **Cải thiện hiệu suất**: Tối ưu code

---
---
## 📜 **Giấy Phép**

Dự án sử dụng **MIT License** - Bạn có thể:
- ✅ Sử dụng miễn phí
- ✅ Sửa đổi source code
- ✅ Phân phối dưới bất kỳ hình thức nào
- ❌ **Không** được sử dụng cho mục đích thương mại **mà không ghi nguồn**

---
---
## 🙏 **Lời Cảm Ơn**

Cảm ơn bạn đã quan tâm đến **LUMI - Living World 3D**!
Đây là dự án được phát triển với mục đích đem lại trải nghiệm **mô phỏng cuộc sống 3D miễn phí** cho mọi người.

🌟 **Nếu bạn thích trò chơi, hãy:**
- ⭐ Star trên GitHub
- 📤 Chia sẻ với bạn bè
- 💬 Để lại feedback

---
**Phát triển bởi: [Tên của bạn]**
**Ngày: 22 Tháng 10, 2026**