import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false); // still keeping the toggle here
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

      if (isRegister) {
        await api.post(endpoint, credentials);
        setIsRegister(false);
        setError("Registration successful! Please login.");
        setCredentials({ username: "", password: "" });
      } else {
        const response = await api.post(endpoint, credentials);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setAuth({
          token: response.data.token,
          user: response.data.user,
          isAuthenticated: true,
        });

        navigate("/tasks");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-container ${loading ? "loading" : ""}`}>
      <h2>{isRegister ? "Register" : "Login"}</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <div className="spinner" />
          ) : isRegister ? (
            "Register"
          ) : (
            "Login"
          )}
        </button>
      </form>
      <hr></hr>
      <p className="mt-4">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link
          to="#"
          className="text-blue-500 underline cursor-pointer"
          onClick={(e) => {
            e.preventDefault(); // prevent page jump
            setIsRegister(!isRegister);
          }}
        >
          {isRegister ? "Login" : "Register"}
        </Link>
      </p>
    </div>
  );
};

export default Login;
