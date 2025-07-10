import "../fade.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../store/userSlice";
import Swal from "sweetalert2";

const Booking = () => {
  const { concertId } = useParams();
  const [qty, setQty] = useState<string>("");
  const [available, setAvailable] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchConcert = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8002/concerts/${concertId}`
        );
        setAvailable(res.data.available_tickets);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal mengambil data konser",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConcert();
  }, [concertId]);

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

  const handleBooking = async () => {
    if (!qty) {
      Swal.fire({
        icon: "warning",
        title: "Uppss!!",
        text: "Jumlah pemesanan harus diisi!",
      });
      return;
    }

    const parsedQty = Number(qty);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Uppss!!",
        text: "Jumlah harus lebih dari 0.",
      });
      return;
    }

    if (available !== null && parsedQty > available) {
      Swal.fire({
        icon: "warning",
        title: "Tiket tidak cukup",
        text: `Tiket tersedia hanya ${available}, silakan kurangi jumlah pesanan.`,
      });
      return;
    }

    try {
      await axios.post(
        "http://localhost:8002/book",
        {
          concert_id: Number(concertId),
          quantity: parsedQty,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Booking Ticket Berhasil. Silakan lakukan pembayaran!",
      });

      navigate("/history");
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Booking Ticket Gagal!",
      });
      return;
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
                <a className="nav-link" aria-current="page" href="/history">
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
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header text-center">
                <h3>Pemesanan Tiket</h3>
              </div>
              <div className="card-body">
                <div className="col-lg-4 offset-lg-4">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Jumlah Pemesanan:</label>
                      <input
                        type="number"
                        className="form-control"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        min="0"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleBooking}
                      className="btn btn-success col-lg-12"
                      disabled={loading}
                    >
                      {loading ? "Memuat..." : "Pesan"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
