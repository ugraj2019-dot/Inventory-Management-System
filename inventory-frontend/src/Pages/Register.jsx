import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        password: form.password,
      });
      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to register. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div id="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-wrap">
            <i className="ti ti-user-plus"></i>
          </div>
          <h1 className="login-title">Create account</h1>
          <p className="login-sub">Set up your StockBase account</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <i className="ti ti-alert-circle"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submit} className="form-grid">
          <div className="form-group">
            <label>First name</label>
            <input name="firstName" value={form.firstName} onChange={change} required />
          </div>

          <div className="form-group">
            <label>Last name</label>
            <input name="lastName" value={form.lastName} onChange={change} required />
          </div>

          <div className="form-group full">
            <label>Username</label>
            <input name="username" value={form.username} onChange={change} required />
          </div>

          <div className="form-group full">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={change}
              minLength={4}
              required
            />
          </div>

          <div className="form-actions full">
            <button
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={saving}
            >
              {saving ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>

        <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.9rem" }}>
          Default administrator: <strong>admin / admin123</strong>
        </p>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link className="auth-link" to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
