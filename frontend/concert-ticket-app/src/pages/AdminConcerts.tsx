import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import { formatWIB } from "../utils/time";
import { useDispatch } from "react-redux";
import { logout } from "../store/userSlice";

const AdminConcerts = () => {
  const [concerts, setConcerts] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    location: "",
    date: "",
    available_tickets: "",
    price: "",
    is_active: "Y",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const fetchConcerts = async () => {
    try {
      const res = await axios.get("http://localhost:8002/all_concerts");
      if (Array.isArray(res.data)) {
        setConcerts(res.data);
      } else {
        setConcerts([]);
      }
    } catch (err) {
      console.error("Gagal fetch konser:", err);
      setConcerts([]);
    }
  };

  useEffect(() => {
    fetchConcerts();
  }, []);

  const handleSubmit = async () => {
    const { name, location, date, available_tickets, price } = form;

    if (!name || !location || !date || !available_tickets || !price) {
      Swal.fire({
        icon: "warning",
        title: "Oops!",
        text: "Semua field harus diisi!",
      });
      return;
    }

    if (isNaN(Number(available_tickets)) || isNaN(Number(price))) {
      Swal.fire({
        icon: "warning",
        title: "Oops!",
        text: "Tiket dan harga harus berupa angka!",
      });
      return;
    }

    try {
      const payload = {
        ...form,
        available_tickets: parseInt(form.available_tickets),
        price: parseInt(form.price),
      };

      if (editId) {
        await axios.put(`http://localhost:8002/concerts/${editId}`, payload);
        Swal.fire("Berhasil", "Konser diperbarui", "success");
      } else {
        await axios.post("http://localhost:8002/concerts", payload);
        Swal.fire("Berhasil", "Konser ditambahkan", "success");
      }

      setForm({
        name: "",
        location: "",
        date: "",
        available_tickets: "",
        price: "",
        is_active: "Y",
      });
      setEditId(null);
      fetchConcerts();
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan data", "error");
    }
  };

  const handleEdit = (concert: any) => {
    setEditId(concert.id);
    setForm({
      name: concert.name,
      location: concert.location,
      date: concert.date?.substring(0, 16),
      available_tickets: String(concert.available_tickets),
      price: String(concert.price),
      is_active: concert.is_active || "Y",
    });
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Hapus konser?",
      text: "Data tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
    });

    if (confirm.isConfirmed) {
      await axios.delete(`http://localhost:8002/concerts/${id}`);
      fetchConcerts();
    }
  };

  const toggleStatus = async (concertId: number, currentStatus: string) => {
    try {
      await axios.patch(`http://localhost:8002/concerts/${concertId}/status`, {
        is_active: currentStatus === "Y" ? "N" : "Y",
      });
      Swal.fire({
        icon: "success",
        title: "Status konser diubah!",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchConcerts();
    } catch {
      Swal.fire("Gagal", "Gagal mengubah status konser", "error");
    }
  };

  const columns = [
    { name: "Nama", selector: (row: any) => row.name, sortable: true },
    { name: "Lokasi", selector: (row: any) => row.location },
    {
      name: "Tanggal",
      selector: (row: any) => {
        return formatWIB(row.date);
      },
      sortable: true,
    },
    { name: "Tiket", selector: (row: any) => row.available_tickets },
    {
      name: "Harga",
      selector: (row: any) =>
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(row.price),
    },
    {
      name: "Status",
      cell: (row: any) => (row.is_active === "Y" ? "Aktif" : "Nonaktif"),
    },
    {
      name: "Aksi",
      cell: (row: any) => (
        <div className="d-flex flex-column gap-1 p-2">
          <button
            className="btn btn-sm btn-warning"
            onClick={() => handleEdit(row)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDelete(row.id)}
          >
            Hapus
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => toggleStatus(row.id, row.is_active)}
          >
            {row.is_active === "Y" ? "Nonaktifkan" : "Aktifkan"}
          </button>
        </div>
      ),
    },
  ];

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
          <div className="col-lg-4">
            <div className="card">
              <div className="card-header text-center">
                <h3>Manajemen Data Konser</h3>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <input
                    placeholder="Nama"
                    className="form-control mb-2"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    placeholder="Lokasi"
                    className="form-control mb-2"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                  />
                  <input
                    placeholder="Tanggal"
                    type="datetime-local"
                    className="form-control mb-2"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                  <input
                    placeholder="Jumlah Tiket"
                    type="number"
                    className="form-control mb-2"
                    value={form.available_tickets}
                    onChange={(e) =>
                      setForm({ ...form, available_tickets: e.target.value })
                    }
                  />
                  <input
                    placeholder="Harga"
                    type="number"
                    className="form-control mb-2"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />
                  <button
                    className="btn btn-primary col-lg-12"
                    onClick={handleSubmit}
                  >
                    {editId ? "Update Konser" : "Tambah Konser"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card">
              <div className="card-header text-center">
                <h3>Data Konser</h3>
              </div>
              <div className="card-body">
                <DataTable
                  columns={columns}
                  data={concerts}
                  pagination
                  highlightOnHover
                  responsive
                  striped
                  noDataComponent="Belum ada data konser"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConcerts;
