import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { createProduct } from "../../services/productService";

const initial = { name:"", sku:"", category:"", quantity:"0", reorderLevel:"5", unitPrice:"0", supplier:"" };

export default function ProductForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const change = e => setForm({...form,[e.target.name]:e.target.value});

  async function submit(e) {
    e.preventDefault(); setSubmitting(true);
    try {
      await createProduct({...form,quantity:Number(form.quantity),reorderLevel:Number(form.reorderLevel),unitPrice:Number(form.unitPrice)},token);
      toast.success("Product added to inventory"); navigate("/");
    } catch(err) { toast.error(err.message || "Could not add product"); }
    finally { setSubmitting(false); }
  }

  return (
    <>
      <div className="page-hdr">
        <div className="page-hdr-left">
          <button className="back-btn" onClick={()=>navigate("/")}><i className="ti ti-arrow-left"></i> Back</button>
          <div><h2>Add product</h2><p>Create a new item in your inventory.</p></div>
        </div>
      </div>
      <div className="card form-card">
        <div className="card-title">Product information</div>
        <form onSubmit={submit} className="form-grid">
          <div className="form-group"><label>Product name</label><input name="name" value={form.name} onChange={change} required placeholder="e.g. Wireless Keyboard" /></div>
          <div className="form-group"><label>SKU</label><input name="sku" value={form.sku} onChange={change} required placeholder="e.g. KB-1001" /></div>
          <div className="form-group"><label>Category</label><input name="category" value={form.category} onChange={change} required placeholder="e.g. Electronics" /></div>
          <div className="form-group"><label>Supplier</label><input name="supplier" value={form.supplier} onChange={change} placeholder="Optional supplier" /></div>
          <div className="form-group"><label>Quantity</label><input name="quantity" type="number" min="0" value={form.quantity} onChange={change} required /></div>
          <div className="form-group"><label>Reorder level</label><input name="reorderLevel" type="number" min="0" value={form.reorderLevel} onChange={change} required /></div>
          <div className="form-group"><label>Unit price</label><input name="unitPrice" type="number" min="0" step="0.01" value={form.unitPrice} onChange={change} required /></div>
          <div className="form-actions full"><button className="btn btn-primary" disabled={submitting}><i className="ti ti-device-floppy"></i>{submitting ? "Saving..." : "Save product"}</button><button className="btn" type="button" onClick={()=>navigate("/")}>Cancel</button></div>
        </form>
      </div>
    </>
  );
}
