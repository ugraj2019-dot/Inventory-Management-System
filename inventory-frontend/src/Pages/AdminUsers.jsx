import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api";

export default function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setUsers(await apiRequest("/users", { token }));
    } catch (err) {
      toast.error(err.message || "Could not load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function changeRole(id, role) {
    try {
      await apiRequest(`/users/${id}/role`, {
        method: "PUT",
        token,
        body: { role },
      });
      toast.success("Role updated");
      load();
    } catch (err) {
      toast.error(err.message || "Could not update role");
    }
  }

  async function removeUser(id) {
    if (!window.confirm("Delete this user?")) return;
    try {
      await apiRequest(`/users/${id}`, { method: "DELETE", token });
      toast.success("User deleted");
      load();
    } catch (err) {
      toast.error(err.message || "Could not delete user");
    }
  }

  return (
    <div>
      <div className="page-hdr">
        <div>
          <h2>User Management</h2>
          <p>Administrator controls for inventory system users.</p>
        </div>
      </div>

      <div className="table-container">
        {loading ? <div className="empty-state">Loading users...</div> : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr><th>Name</th><th>Username</th><th>Role</th><th>Created</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.username}</td>
                    <td>
                      <span className={user.role === "admin" ? "badge badge-success" : "badge"}>
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-row">
                        <button className="btn btn-sm" onClick={() => changeRole(user.id, user.role === "admin" ? "staff" : "admin")}>
                          Make {user.role === "admin" ? "staff" : "admin"}
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => removeUser(user.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
