# 🎫 Concert Ticket Booking System

Sistem pemesanan tiket konser berbasis **microservices** menggunakan **Golang** (Gin) dan **React.js**. Sistem ini terdiri dari tiga layanan utama:

- `user-service` - Autentikasi dan manajemen pengguna
- `booking-service` - Pemesanan tiket konser
- `payment-service` - Simulasi pembayaran tiket

Frontend dibangun menggunakan **React** + **Redux Toolkit** dan berkomunikasi dengan backend melalui **REST API**.

---

## 🚀 Fitur Utama

### ✅ Frontend (React.js)

- Halaman Login, Dashboard, Pemesanan Tiket, Riwayat Transaksi
- React Router + Lazy Loading + Code Splitting
- Protected Route (auth check via JWT token)
- SweetAlert2 untuk notifikasi UI
- Bootstrap untuk styling
- Redux Toolkit untuk state global
- Validasi form dan error handling

### ✅ Backend (Golang - Gin)

- Microservice terpisah (user, booking, payment)
- MySQL untuk database
- Swagger documentation untuk setiap service
- CORS, logging, dan middleware JWT

---

## 🗂️ Struktur Microservices

```bash
backend/
├── user-service/
│   ├── controller/
│   ├── model/
│   ├── util/
│   ├── config/
│   └── main.go
├── booking-service/
│   └── ...
├── payment-service/
│   └── ...
```

## 🛠️ Cara Menjalankan (Tanpa Docker)

Untuk menjalankan project secara lokal (tanpa Docker), ikuti langkah-langkah berikut:

### 🧩 1. Jalankan Backend Services

📍 **user-service**

```bash
    cd backend/user-service
    go mod tidy
    go run main.go
```

📍 **booking-service** dan **payment-service**
Langkahnya hampir sama:

```bash
    cd backend/booking-service
    go mod tidy
    go run main.go
```

```bash
    cd backend/payment-service
    go mod tidy
    go run main.go
```

📝 Pastikan MySQL sudah aktif dan database sudah disiapkan.

### 💻 2. Jalankan Frontend (React.js)

```bash
    cd frontend/concert-ticket-app
    npm install
    npm start
```

Frontend akan berjalan di:
🔗 **http://localhost:3000**

## 🐳 Menjalankan via Docker

- Clone repository:

```bash
    git clone git@github.com:Candrawjy/INA17.git
    cd concert-booking
```

- Build dan jalankan semua service:

```bash
    docker-compose up --build
```

- Frontend dapat diakses di http://localhost:3000

## 🧪 Dokumentasi API (Swagger)

Setiap service memiliki dokumentasi Swagger yang bisa diakses melalui endpoint:

- User Service: http://localhost:8001/swagger/index.html
- Booking Service: http://localhost:8002/swagger/index.html
- Payment Service: http://localhost:8003/swagger/index.html

## 📬 Postman API Collection

Saya menyediakan koleksi API dalam format Postman Collection untuk memudahkan testing semua endpoint dari service:

- User Service
- Booking Service
- Payment Service

## 📌 Lokasi Collection Postman

```bash
    /postman/Concert Ticket.postman_collection.json
```
