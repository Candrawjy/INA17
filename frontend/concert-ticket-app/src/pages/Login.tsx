import "../fade.css";
import { useState, useEffect } from "react";
import API from "../api/axios";
import { useDispatch } from "react-redux";
import { setToken } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login - Concert Ticket";
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Uppss!!",
        text: "Email dan password harus diisi!",
      });
      return;
    }

    try {
      const res = await API.post("/login", { email, password });
      dispatch(setToken(res.data.token));
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");

      Swal.fire({
        icon: "success",
        title: "Login Berhasil!",
        text: "Selamat Datang",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal login!",
        text: "Periksa email dan password",
      });
    }
  };

  return (
    <div className="container mt-5 fade-in">
      <div className="row">
        <div className="col-lg-6 offset-lg-3 text-center">
          <div className="card">
            <div className="card-header">
              <h3>Selamat Datang!</h3>
              <h5>Silakan login menggunakan akun Anda</h5>
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
                onClick={handleLogin}
                className="btn btn-primary col-lg-6"
              >
                Login
              </button>

              <hr />
              <p>
                Belum punya akun?{" "}
                <a
                  href="/register"
                  className="link-underline link-underline-opacity-0"
                >
                  Register
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
