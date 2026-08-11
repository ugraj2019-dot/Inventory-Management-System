import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../api";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) { setToken(savedToken); setUser(JSON.parse(savedUser)); }
    setIsLoading(false);
  }, []);
  function persistSession(data) {
    const loggedInUser = { id:data.id, username:data.username, fullName:data.fullName, role:data.role || "staff" };
    localStorage.setItem("token", data.token); localStorage.setItem("user", JSON.stringify(loggedInUser));
    setToken(data.token); setUser(loggedInUser);
  }
  async function register(body) { persistSession(await apiRequest("/auth/register", {method:"POST", body})); }
  async function login(body) { persistSession(await apiRequest("/auth/login", {method:"POST", body})); }
  async function logout() {
    try { if (token) await apiRequest("/auth/logout", {method:"POST", token}); }
    finally { localStorage.removeItem("token"); localStorage.removeItem("user"); setToken(null); setUser(null); }
  }
  return <AuthContext.Provider value={{user, token, isLoading, register, login, logout}}>{children}</AuthContext.Provider>;
}
export function useAuth() { const c=useContext(AuthContext); if(!c) throw new Error("useAuth must be used within an AuthProvider"); return c; }
