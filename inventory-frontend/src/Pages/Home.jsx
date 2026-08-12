import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getInventorySummary, getProducts, deleteProduct } from "../services/productService";

function ProductRow({ product, onDelete, isAdmin }) {
  const low = Number(product.quantity) <= Number(product.reorderLevel);
  const out = Number(product.quantity) === 0;
  return (
    <tr className={low ? "low-stock" : ""}>
      <td>
        <div className="table-product">
          <div className="thumb-ph"><i className="ti ti-package"></i></div>
          <div>
            <div className="product-name">{product.name}</div>
            <div className="product-sku">{product.sku}</div>
          </div>
        </div>
      </td>
      <td><span className="category-text">{product.category}</span></td>
      <td><span className={out ? "badge badge-danger" : low ? "badge badge-warn" : "badge badge-success"}>{out ? "Out of stock" : low ? "Low stock" : "In stock"}</span></td>
      <td><span className="qty">{product.quantity}</span> <span style={{color:"var(--text-faint)",fontSize:12}}> / {product.reorderLevel}</span></td>
      <td className="price">${Number(product.unitPrice).toFixed(2)}</td>
      <td>{product.supplier || <span style={{color:"var(--text-faint)"}}>—</span>}</td>
      <td>
        <div className="action-row">
          <Link className="btn btn-sm btn-icon" to={`/product/${product.id}`} title="Edit"><i className="ti ti-pencil"></i></Link>
          {isAdmin && <button className="btn btn-sm btn-icon btn-danger" onClick={() => onDelete(product.id)} title="Delete"><i className="ti ti-trash"></i></button>}
        </div>
      </td>
    </tr>
  );
}

export default function Home() {
  const { token, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (query = "") => {
    setLoading(true);
    try {
      const [items, stats] = await Promise.all([getProducts(token, query), getInventorySummary(token)]);
      setProducts(items);
      setSummary(stats);
    } catch (err) {
      toast.error(err.message || "Could not load inventory");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchQuery(search.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => { load(searchQuery); }, [load, searchQuery]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this product from inventory?")) return;
    try {
      await deleteProduct(id, token);
      toast.success("Product deleted");
      load(searchQuery);
    } catch (err) { toast.error(err.message || "Could not delete product"); }
  }

  const lowCount = Number(summary?.lowStock ?? 0);
  const totalValue = Number(summary?.inventoryValue ?? 0);

  return (
    <>
      <div className="page-hdr">
        <div>
          <h2>Dashboard</h2>
          <p>Overview of your inventory and stock levels.</p>
        </div>
        <Link className="btn btn-primary" to="/add"><i className="ti ti-plus"></i> Add product</Link>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon green"><i className="ti ti-box"></i></div>
          <p className="stat-val">{summary?.totalProducts ?? "—"}</p>
          <p className="stat-lbl">Total products</p>
        </div>
        <div className={`stat-card ${lowCount ? "danger" : ""}`}>
          <div className="stat-icon red"><i className="ti ti-alert-triangle"></i></div>
          <p className="stat-val">{summary?.lowStock ?? "—"}</p>
          <p className="stat-lbl">Low stock items</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><i className="ti ti-stack-2"></i></div>
          <p className="stat-val">{summary?.totalUnits ?? "—"}</p>
          <p className="stat-lbl">Total units</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><i className="ti ti-currency-dollar"></i></div>
          <p className="stat-val">${totalValue.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0})}</p>
          <p className="stat-lbl">Stock value</p>
        </div>
      </div>

      {lowCount > 0 && (
        <div className="alert alert-warn">
          <i className="ti ti-alert-triangle"></i>
          <span><strong>{lowCount} item{lowCount !== 1 ? "s" : ""}</strong> are at or below their reorder level. Review the Products list and restock where needed.</span>
        </div>
      )}

      <div className="table-container">
        <div className="table-toolbar">
          <div>
            <strong style={{fontSize:15}}>Products</strong>
            <div style={{fontSize:12,color:"var(--text-faint)"}}>{products.length} result{products.length !== 1 ? "s" : ""}</div>
          </div>
          <div className="search-wrap toolbar-search">
            <i className="ti ti-search"></i>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, SKU or category..."
              aria-label="Search products"
            />
          </div>
        </div>

        {loading ? (
          <div className="empty-state"><i className="ti ti-loader-2"></i><p>Loading inventory...</p></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <i className="ti ti-package-off"></i>
            <p>No products found.</p>
            <Link className="btn btn-primary" style={{marginTop:12}} to="/add">Add product</Link>
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead><tr><th>Product</th><th>Category</th><th>Status</th><th>Stock</th><th>Unit price</th><th>Supplier</th><th></th></tr></thead>
              <tbody>{products.map(p => <ProductRow key={p.id} product={p} onDelete={handleDelete} isAdmin={user?.role === "admin"} />)}</tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
