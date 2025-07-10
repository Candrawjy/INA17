import "../fade.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/userSlice";
import Swal from "sweetalert2";

interface Concert {
  id: number;
  name: string;
  location: string;
  date: string;
  available_tickets: number;
  price: number;
}

const Dashboard = () => {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Dashboard - Concert Ticket";
  }, []);

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
    axios
      .get("http://localhost:8002/concerts")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setConcerts(res.data);
        } else {
          setConcerts([]);
        }
      })
      .catch((err) => console.error("Error fetching concerts:", err));
  }, []);

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
                <a className="nav-link active" aria-current="page" href="/">
                  Beranda
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="/history">
                  Riwayat
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link text-muted"
                  aria-current="page"
                  href="/admin/concerts"
                >
                  Admin
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
                <h3>Daftar Konser</h3>
              </div>
              <div className="card-body">
                {concerts?.length === 0 && (
                  <p className="text-muted">Tidak ada konser tersedia ...</p>
                )}

                <div className="row">
                  <div className="d-flex justify-content-start">
                    {concerts.map((c) => (
                      <div className="col-lg-3 text-center p-3">
                        <div className="card">
                          <div className="card-header">
                            <h5>{c.name}</h5>
                            <p className="small">
                              {new Date(c.date).toLocaleString()}
                            </p>
                          </div>
                          <div className="card-body">
                            <p>Lokasi: {c.location}</p>
                            <p>
                              Harga:{" "}
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                              }).format(c.price)}
                            </p>
                            <p>
                              Tiket tersedia: <b>{c.available_tickets}</b>
                            </p>

                            <button
                              onClick={() => navigate(`/book/${c.id}`)}
                              className="btn btn-primary"
                            >
                              Pesan Tiket
                            </button>
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

export default Dashboard;
