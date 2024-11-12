// Mengimpor Express, Sentry, dan dotenv untuk mengelola environment variables
const express = require("express");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
require("dotenv").config(); // Mengambil variabel dari .env file ke dalam process.env

const app = express();

// Inisialisasi Sentry untuk error handling dan performance tracing
Sentry.init({
  dsn: process.env.SENTRY_DSN, // URL DSN Sentry yang digunakan untuk identifikasi proyek di Sentry
  environment: process.env.NODE_ENV, // Menentukan lingkungan aplikasi (misalnya: 'development' atau 'production')
  tracesSampleRate: 1.0, // Mengatur persentase sample untuk tracing (1.0 = 100%)
  integrations: [new Tracing.Integrations.Express({ app })], // Integrasi Sentry dengan aplikasi Express
});

// Middleware untuk menangani request dan tracing Sentry
app.use(Sentry.Handlers.requestHandler()); // Middleware menangkap semua permintaan dan melaporkan ke Sentry
app.use(Sentry.Handlers.tracingHandler()); // Middleware mengaktifkan tracing untuk setiap request

// Route untuk endpoint root, mengembalikan pesan sederhana
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Route untuk endpoint error, mensimulasikan error dengan melempar exception
app.get("/error", (req, res) => {
  throw new Error("Simulasi Error!"); // Memicu error yang akan ditangani oleh Sentry
});

// Middleware untuk menangani error dengan Sentry
app.use(Sentry.Handlers.errorHandler()); // Middleware untuk menangkap dan melaporkan error ke Sentry

// Middleware akhir untuk menangani semua error lain dan mengirimkan respon JSON
app.use((err, req, res, next) => {
  console.error(err); // Menampilkan error di console
  res.status(500).json({ message: "Internal Server Error" }); // Mengirim respon JSON untuk error
});

// Menentukan port dan menjalankan server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`); // Menampilkan pesan bahwa server berjalan di port 3000
});
