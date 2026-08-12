import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NavBar from "./components/NavBar/NavBar";
import Home from "./Pages/Home";
import AddProduct from "./Pages/AddProduct";
import ProductDetail from "./Pages/ProductDetail";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

function Layout() {
  const { user } = useAuth();
  return (
    <>
      {user && <NavBar />}
      {user ? (
        <div className="main-content">
          <header className="topbar">
            <span className="topbar-title">StockBase</span>
            <div className="topbar-actions">
              <span style={{fontSize:12,color:"var(--text-muted)"}}>Inventory Manager</span>
            </div>
          </header>
          <main className="page-body">
            <Routes>
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/add" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
              <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="bottom-right" />
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}
