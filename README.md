# 📺 SKTK V12 – Ứng dụng Phòng Sân Khấu Tạp Kỹ
## Ban Văn Nghệ – Đài Truyền hình Việt Nam

---

## 🗂 CẤU TRÚC THƯ MỤC

```
sktk-v12/
├── index.html          ← Toàn bộ ứng dụng (1 file)
├── manifest.json       ← Cấu hình PWA (cài lên điện thoại)
├── sw.js               ← Service Worker (offline support)
├── js/
│   └── app.js          ← Logic nghiệp vụ toàn bộ ứng dụng
├── icons/              ← Icon cho mọi thiết bị (đã tạo sẵn)
│   ├── icon-32.png
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-180.png
│   ├── icon-192.png
│   └── icon-512.png
├── generate_icons.py   ← Script tạo icon (đã chạy sẵn)
└── README.md           ← Tài liệu này
```

---

## 🚀 CÁCH SỬ DỤNG

### 1. Dùng luôn trên máy tính (không cần server)
- Mở file `index.html` bằng bất kỳ trình duyệt nào
- Chrome, Edge, Firefox, Safari đều chạy được
- **Lưu ý:** Một số tính năng PWA cần chạy qua server

### 2. Upload lên hosting (khuyến nghị)
Upload toàn bộ thư mục lên bất kỳ hosting nào:
- **Netlify** (miễn phí): kéo thả thư mục vào netlify.com/drop
- **GitHub Pages** (miễn phí): push lên GitHub repo
- **Vercel** (miễn phí): `vercel --prod`
- **Apache/Nginx**: copy vào thư mục web root

### 3. Cài đặt như app thật (PWA)
Sau khi upload lên hosting HTTPS:

**Android Chrome:**
1. Mở trình duyệt Chrome → truy cập URL
2. Nhấn menu (⋮) → "Thêm vào màn hình chính"
3. Hoặc đợi banner "Cài đặt" xuất hiện tự động

**iOS Safari:**
1. Mở Safari → truy cập URL
2. Nhấn nút Chia sẻ (□↑)
3. Chọn "Thêm vào màn hình chính"
4. Nhấn "Thêm"

**Windows/Mac Chrome/Edge:**
1. Truy cập URL
2. Nhấn icon cài đặt (⊕) trên thanh địa chỉ
3. Hoặc nhấn menu → "Cài đặt SKTK V12"

---

## ⚙️ ĐỒNG BỘ NHIỀU THIẾT BỊ (Backend)

Để đồng bộ dữ liệu giữa nhiều thiết bị, cần backend:

### Option A: Firebase (Đơn giản nhất – miễn phí)
```javascript
// Thêm vào index.html trước </body>:
<script src="https://www.gstatic.com/firebasejs/10.x/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.x/firebase-firestore-compat.js"></script>
<script>
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  projectId: "YOUR_PROJECT_ID",
  // ... config từ Firebase Console
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Lưu giao dịch công đoàn:
db.collection('unionTx').add(txData);

// Lấy dữ liệu:
db.collection('unionTx').onSnapshot(snapshot => {
  APP.unionTx = snapshot.docs.map(d => ({id:d.id,...d.data()}));
  renderUnionTable();
});
</script>
```

### Option B: Supabase (PostgreSQL, miễn phí)
```bash
npm install @supabase/supabase-js
```

### Option C: Node.js + MongoDB (tự host)
```bash
# api/ folder cần thêm:
# api/server.js  – Express.js REST API
# api/routes/    – auth, attendance, union, photos
# api/.env       – MONGO_URI, JWT_SECRET
```

---

## 📱 TÍNH TƯƠNG THÍCH

| Nền tảng | Hỗ trợ | Ghi chú |
|---|---|---|
| iOS Safari (iPhone/iPad) | ✅ | PWA qua "Thêm vào màn hình chính" |
| Android Chrome | ✅ | Cài đặt như app thật |
| Windows Chrome/Edge | ✅ | PWA Desktop |
| macOS Safari/Chrome | ✅ | |
| Firefox | ✅ | PWA hạn chế một số tính năng |
| Samsung Internet | ✅ | |

---

## 🔐 PHÂN QUYỀN

| Vai trò | Điểm danh | Công đoàn Thu/Chi | Thông báo | Quản lý NV |
|---|---|---|---|---|
| Lãnh đạo | ✅ Xem + Sửa | ✅ Toàn quyền | ✅ Tạo + Xóa | ✅ |
| Trợ lý | ✅ Xem + Sửa | ✅ Nhập + Xem | ✅ Tạo | ✅ Xem |
| Nhân viên | 👁 Chỉ xem | 👁 Chỉ xem tổng | 👁 Xem | ❌ |
| Admin | ✅ Toàn quyền | ✅ Toàn quyền | ✅ Toàn quyền | ✅ Toàn quyền |

---

## 📤 XUẤT DỮ LIỆU

- **Excel (.xlsx):** Dùng thư viện SheetJS – xuất bảng số liệu
- **Word (.doc):** Xuất báo cáo định dạng HTML-Word
- **In:** Sử dụng `window.print()` – tối ưu cho A4

---

## 🆕 PHIÊN BẢN

- **V12.0** (05/2026): PWA + Album ảnh + Công đoàn Thu/Chi + Xuất Excel/Word
- **V11.x**: Giao diện cũ

---

## 📞 HỖ TRỢ

Phòng Sân Khấu Tạp Kỹ – Ban Văn Nghệ VTV  
📧 sktk@vtv.vn | 🌐 vtv.vn
