import "../fade.css";
import { useState, useEffect } from "react";
import API from "../api/axios";
import { useDispatch } from "react-redux";
import { setToken } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Register - Concert Ticket";
  }, []);

  const handleRegister = async () => {
    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Uppss!!",
        text: "Email dan password harus diisi!",
      });
      return;
    }

    try {
      const res = await API.post("/register", { email, password });
      navigate("/login");

      Swal.fire({
        icon: "success",
        title: "Register Berhasil!",
        text: "Silakan Login",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: any) {
      if (err.response?.status === 500) {
        Swal.fire({
          icon: "error",
          title: "Akun sudah ada",
          text: "Email sudah terdaftar. Silakan login atau gunakan email lain.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal register",
          text: "Periksa email dan password",
        });
      }
    }
  };

  return (
    <div className="container mt-5 fade-in">
      <div className="row">
        <div className="col-lg-6 offset-lg-3 text-center">
          <div className="card">
            <div className="card-header">
              <h3>Register</h3>
              <h5>Masukkan data Anda</h5>
            </div>
            <div className="card-body col-lg-8 offset-lg-2">
              <div className="mb-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email *"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password *"
                  className="form-control"
                />
              </div>
              <button
                onClick={handleRegister}
                className="btn btn-primary col-lg-6"
              >
                Register
              </button>

              <hr />
              <p>
                Sudah punya akun?{" "}
                <a
                  href="/login"
                  className="link-underline link-underline-opacity-0"
                >
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
