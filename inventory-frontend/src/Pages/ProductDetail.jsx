import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getProductById, updateProduct } from "../services/productService";

export default function ProductDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form,setForm] = useState(null);
  const [saving,setSaving] = useState(false);

  useEffect(() => {
    getProductById(id,token).then(setForm).catch(err=>toast.error(err.message || "Could not load product"));
  },[id,token]);

  if(!form) return <div className="empty-state"><i className="ti ti-loader-2"></i><p>Loading product...</p></div>;
  const change=e=>setForm({...form,[e.target.name]:e.target.value});

  async function save(e){
    e.preventDefault(); setSaving(true);
    try {
      const data=await updateProduct(id,{name:form.name,sku:form.sku,category:form.category,quantity:Number(form.quantity),reorderLevel:Number(form.reorderLevel),unitPrice:Number(form.unitPrice),supplier:form.supplier},token);
      setForm(data); toast.success("Inventory updated");
    } catch(err){toast.error(err.message || "Could not update product");}
    finally{setSaving(false);}
  }

  return (
    <>
      <div className="page-hdr">
        <div className="page-hdr-left">
          <button className="back-btn" onClick={()=>navigate("/")}><i className="ti ti-arrow-left"></i> Back</button>
          <div><h2>Edit product</h2><p>Update product and stock information.</p></div>
        </div>
      </div>
      <div className="card form-card">
        <div className="card-title">Product information</div>
        <form onSubmit={save} className="form-grid">
          {[
            ["name","Product name","text"],["sku","SKU","text"],["category","Category","text"],
            ["supplier","Supplier","text"],["quantity","Quantity","number"],["reorderLevel","Reorder level","number"],["unitPrice","Unit price","number"]
          ].map(([name,label,type])=><div className="form-group" key={name}><label>{label}</label><input name={name} type={type} min={type==="number"?"0":undefined} step={name==="unitPrice"?"0.01":undefined} value={form[name] ?? ""} onChange={change} required={name!=="supplier"} /></div>)}
          <div className="form-actions full"><button className="btn btn-primary" disabled={saving}><i className="ti ti-device-floppy"></i>{saving?"Saving...":"Save changes"}</button><button className="btn" type="button" onClick={()=>navigate("/")}>Cancel</button></div>
        </form>
      </div>
    </>
  );
}
