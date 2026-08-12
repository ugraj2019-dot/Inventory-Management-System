import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState(null);
  async function submit(e){
    e.preventDefault();setError(null);
    try{await login({username,password});navigate("/");}
    catch(err){setError(err.message || "Unable to sign in");}
  }
  return <div id="login-page">
    <div className="login-card">
      <div className="login-header">
        <div className="login-logo-wrap"><i className="ti ti-package"></i></div>
        <h1 className="login-title">StockBase</h1>
        <p className="login-sub">Sign in to manage your inventory</p>
      </div>
      {error && <div className="alert alert-danger"><i className="ti ti-alert-circle"></i><span>{error}</span></div>}
      <form onSubmit={submit}>
        <div className="form-group" style={{marginBottom:"1rem"}}><label>Username</label><input type="text" value={username} onChange={e=>setUsername(e.target.value)} autoComplete="username" required /></div>
        <div className="form-group" style={{marginBottom:"1.5rem"}}><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required /></div>
        <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}}><i className="ti ti-login"></i> Sign in</button>
      </form>
      <p className="login-hint">New here? <Link className="auth-link" to="/register">Create an account</Link></p>
    </div>
  </div>;
}
