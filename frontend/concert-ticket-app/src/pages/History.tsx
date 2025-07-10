import "../fade.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logout } from "../store/userSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

const History = () => {
  const [history, setHistory] = useState<any[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Yakin ingin logout?",
      text: "Anda akan keluar dari Aplikasi.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        localStorage.removeItem("token");
        navigate("/");
      }
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Unauthorized", "Silakan login terlebih dahulu", "warning");
      navigate("/");
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8002/my-bookings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const rawData = res.data;

      if (!rawData || !Array.isArray(rawData)) {
        setHistory([]);
        return;
      }

      const bookings = rawData.map((b: any) => ({
        ...b,
        amount: b.quantity * b.price,
        paid: false,
      }));

      for (let booking of bookings) {
        try {
          const res = await axios.get(
            `http://localhost:8003/status/${booking.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          booking.paid = res.data.status === "PAID";
        } catch {
          booking.paid = false;
        }
      }

      setHistory(bookings);
    } catch (err: any) {
      console.error("Fetch failed:", err.response?.status, err.response?.data);
      if (err.response?.status === 401) {
        Swal.fire(
          "Unauthorized",
          "Sesi Anda telah habis. Silakan login kembali.",
          "error"
        );
        dispatch(logout());
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  const handlePay = async (bookingId: number, amount: number) => {
    try {
      await axios.post(
        "http://localhost:8003/pay",
        { booking_id: bookingId, amount },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Pembayaran Berhasil!",
        text: "Tiket yang dipesan berhasil dibayar.",
      });
      fetchData();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Pembayaran Gagal!",
        text: "Tiket yang dipesan gagal dibayar.",
      });
    }
  };

  return (
    <div className="fade-in">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Concert Ticket
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="/">
                  Beranda
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="/history"
                >
                  Riwayat
                </a>
              </li>
            </ul>
            <div className="d-flex">
              <button onClick={handleLogout} className="btn btn-sm btn-primary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="card">
              <div className="card-header">
                <h3>Riwayat Pemesanan</h3>
              </div>
              <div className="card-body">
                {history?.length === 0 && (
                  <p className="text-muted">
                    Tidak ada riwayat pemesanan. Silakan lakukan pemesanan tiket
                    terlebih dahulu.
                  </p>
                )}

                <div className="row">
                  <div className="d-flex justify-content-start">
                    {history.map((b) => (
                      <div key={b.id} className="col-lg-3 text-center p-3">
                        <div className="card">
                          <div className="card-header">
                            <h5>{b.concert}</h5>
                          </div>
                          <div className="card-body">
                            <p>Jumlah Pemesanan: {b.quantity} tiket</p>
                            <p>
                              Total Harga:{" "}
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                              }).format(b.amount)}
                            </p>
                            <p>
                              Status Pembayaran:{" "}
                              <b>
                                {b.paid ? "Sudah Dibayar" : "Belum Dibayar"}
                              </b>
                            </p>

                            {!b.paid && (
                              <button
                                onClick={() => handlePay(b.id, b.amount)}
                                className="btn btn-primary"
                              >
                                Bayar Sekarang
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
