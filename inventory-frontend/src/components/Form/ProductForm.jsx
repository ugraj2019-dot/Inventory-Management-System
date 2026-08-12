import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { createProduct } from "../../services/productService";

const initialProduct = {
  name: "",
  sku: "",
  category: "",
  supplier: "",
  quantity: "0",
  reorderLevel: "5",
  unitPrice: "0",
};

export default function ProductForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialProduct);
  const [submitting, setSubmitting] = useState(false);

  function change(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await createProduct({
        ...form,
        name: form.name.trim(),
        sku: form.sku.trim(),
        category: form.category.trim(),
        supplier: form.supplier.trim(),
        quantity: Number(form.quantity),
        reorderLevel: Number(form.reorderLevel),
        unitPrice: Number(form.unitPrice),
      }, token);
      toast.success("Product added to inventory");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Could not add product");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="page-hdr">
        <div className="page-hdr-left">
          <button className="back-btn" type="button" onClick={() => navigate("/")}>
            <i className="ti ti-arrow-left"></i> Back to dashboard
          </button>
          <div>
            <h2>Add product</h2>
            <p>Add the details below to keep your inventory accurate.</p>
          </div>
        </div>
      </div>

      <div className="card form-card product-form-card">
        <div className="product-form-heading">
          <div className="product-form-icon"><i className="ti ti-package"></i></div>
          <div>
            <div className="card-title">New product</div>
            <p>Fields marked with <span aria-hidden="true">*</span> are required.</p>
          </div>
        </div>

        <form onSubmit={submit}>
          <section className="form-section" aria-labelledby="product-details-heading">
            <div className="form-section-heading">
              <h3 id="product-details-heading">Product details</h3>
              <p>Use a clear name and SKU so this item is easy to find later.</p>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="product-name">Product name <span className="required-mark">*</span></label>
                <input id="product-name" name="name" value={form.name} onChange={change} required placeholder="e.g. Wireless Keyboard" />
              </div>
              <div className="form-group">
                <label htmlFor="product-sku">SKU <span className="required-mark">*</span></label>
                <input id="product-sku" name="sku" value={form.sku} onChange={change} required placeholder="e.g. KB-1001" />
              </div>
              <div className="form-group">
                <label htmlFor="product-category">Category <span className="required-mark">*</span></label>
                <input id="product-category" name="category" value={form.category} onChange={change} required placeholder="e.g. Electronics" />
              </div>
              <div className="form-group">
                <label htmlFor="product-supplier">Supplier</label>
                <input id="product-supplier" name="supplier" value={form.supplier} onChange={change} placeholder="Optional supplier" />
              </div>
            </div>
          </section>

          <section className="form-section" aria-labelledby="stock-details-heading">
            <div className="form-section-heading">
              <h3 id="stock-details-heading">Stock and pricing</h3>
              <p>Set the current stock, restock alert level, and unit cost.</p>
            </div>
            <div className="form-grid stock-fields">
              <div className="form-group">
                <label htmlFor="product-quantity">Current quantity <span className="required-mark">*</span></label>
                <input id="product-quantity" name="quantity" type="number" min="0" step="1" value={form.quantity} onChange={change} required />
                <span className="field-hint">Items currently in stock</span>
              </div>
              <div className="form-group">
                <label htmlFor="product-reorder-level">Reorder level <span className="required-mark">*</span></label>
                <input id="product-reorder-level" name="reorderLevel" type="number" min="0" step="1" value={form.reorderLevel} onChange={change} required />
                <span className="field-hint">Show a low-stock alert at this level</span>
              </div>
              <div className="form-group">
                <label htmlFor="product-unit-price">Unit price <span className="required-mark">*</span></label>
                <div className="input-prefix">
                  <span aria-hidden="true">$</span>
                  <input id="product-unit-price" name="unitPrice" type="number" min="0" step="0.01" value={form.unitPrice} onChange={change} required />
                </div>
                <span className="field-hint">Enter a value of zero or more</span>
              </div>
            </div>
          </section>

          <div className="form-actions product-form-actions">
            <button className="btn" type="button" onClick={() => navigate("/")}>Cancel</button>
            <button className="btn btn-primary" disabled={submitting}>
              <i className="ti ti-device-floppy"></i>
              {submitting ? "Saving product..." : "Save product"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
