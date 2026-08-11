import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <div className="logo-icon"><i className="ti ti-package"></i></div>
          StockBase
        </div>
        <p className="brand-sub">Inventory Manager</p>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-section-label">Menu</p>
        <NavLink to="/" end className={({isActive}) => `nav-item ${isActive ? "active" : ""}`}>
          <i className="ti ti-layout-dashboard nav-icon"></i> Dashboard
        </NavLink>
        <NavLink to="/products" className={({isActive}) => `nav-item ${isActive ? "active" : ""}`}>
          <i className="ti ti-box nav-icon"></i> Products
        </NavLink>
        <NavLink to="/add" className={({isActive}) => `nav-item ${isActive ? "active" : ""}`}>
          <i className="ti ti-circle-plus nav-icon"></i> Add Product
        </NavLink>

        {user.role === "admin" && (
          <>
            <p className="nav-section-label" style={{marginTop: "1.2rem"}}>Administration</p>
            <NavLink to="/admin/users" className={({isActive}) => `nav-item ${isActive ? "active" : ""}`}>
              <i className="ti ti-users nav-icon"></i> Manage Users
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-row">
          <div className="user-avatar">{(user.fullName || user.username || "U")[0].toUpperCase()}</div>
          <div className="user-info">
            <p className="user-name">{user.fullName || user.username}</p>
            <p className="user-role">{user.role === "admin" ? "Administrator" : "Staff"}</p>
          </div>
          <button className="btn-signout" onClick={handleLogout} title="Sign out">
            <i className="ti ti-logout"></i>
          </button>
        </div>
      </div>
    </aside>
  );
}
