/* ─────────────────────────────────────────────
   StockBase — Inventory Management System
   All data stored in localStorage.
   Passwords hashed with FNV-1a.
───────────────────────────────────────────── */

/* ── Hash ────────────────────────────────────── */
function fnv1a(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(16);
}

/* ── State ───────────────────────────────────── */
const S = {
  session: null,
  page: "dashboard",
  editId: null,
  viewId: null,
};

const DB = {
  get users() {
    return JSON.parse(localStorage.getItem("sb_users") || "[]");
  },
  get products() {
    return JSON.parse(localStorage.getItem("sb_products") || "[]");
  },
  get suppliers() {
    return JSON.parse(localStorage.getItem("sb_suppliers") || "[]");
  },
  setUsers(v) {
    localStorage.setItem("sb_users", JSON.stringify(v));
  },
  setProducts(v) {
    localStorage.setItem("sb_products", JSON.stringify(v));
  },
  setSuppliers(v) {
    localStorage.setItem("sb_suppliers", JSON.stringify(v));
  },
};

/* ── Seed data ───────────────────────────────── */
function seed() {
  if (!DB.users.length) {
    DB.setUsers([
      {
        id: 1,
        username: "admin",
        hash: fnv1a("admin123"),
        role: "Administrator",
      },
    ]);
  }
  if (!DB.suppliers.length) {
    DB.setSuppliers([
      {
        id: 1,
        name: "TechVend Co.",
        email: "sales@techvend.co",
        phone: "+1 555-0101",
      },
      {
        id: 2,
        name: "Global Parts Ltd",
        email: "orders@globalparts.io",
        phone: "+1 555-0202",
      },
      {
        id: 3,
        name: "Apex Supplies",
        email: "hello@apexsupplies.com",
        phone: "+1 555-0303",
      },
    ]);
  }
  if (!DB.products.length) {
    DB.setProducts([
      {
        id: 1,
        name: "Wireless Keyboard",
        description: "Compact Bluetooth keyboard with 3-device pairing.",
        price: 49.99,
        qty: 12,
        supplierId: 1,
        img: null,
      },
      {
        id: 2,
        name: "USB-C Hub",
        description: "7-port hub — USB-A, HDMI, SD card, PD charging.",
        price: 29.99,
        qty: 3,
        supplierId: 2,
        img: null,
      },
      {
        id: 3,
        name: "Monitor Stand",
        description: "Adjustable ergonomic stand, 15–45 cm height.",
        price: 34.99,
        qty: 0,
        supplierId: 1,
        img: null,
      },
      {
        id: 4,
        name: "Webcam 1080p",
        description: "Full HD webcam with built-in noise-cancelling mic.",
        price: 59.99,
        qty: 8,
        supplierId: 3,
        img: null,
      },
      {
        id: 5,
        name: "Desk Lamp LED",
        description: "Touch-control lamp, 3 colour temperatures.",
        price: 22.5,
        qty: 4,
        supplierId: 2,
        img: null,
      },
    ]);
  }
}

/* ── Helpers ─────────────────────────────────── */
function uid() {
  return Date.now() + Math.floor(Math.random() * 9999);
}
function supplier(id) {
  return DB.suppliers.find((s) => s.id == id) || null;
}
function esc(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

let toastTimer;
function toast(msg, icon = "ti-check") {
  const el = document.getElementById("toast");
  el.innerHTML = `<i class="ti ${icon}"></i> ${msg}`;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
}

/* ── Router ──────────────────────────────────── */
function goTo(page, id) {
  S.page = page;
  S.editId = id || null;
  S.viewId = id || null;
  renderApp();
  window.scrollTo(0, 0);
}

/* ── Auth ────────────────────────────────────── */
function doLogin() {
  const u = document.getElementById("l-user").value.trim();
  const p = document.getElementById("l-pass").value;
  const user = DB.users.find((x) => x.username === u);
  const errEl = document.getElementById("login-err");
  if (!user || user.hash !== fnv1a(p)) {
    errEl.innerHTML = `<div class="alert alert-danger"><i class="ti ti-alert-circle"></i> Incorrect username or password.</div>`;
    return;
  }
  S.session = user;
  renderApp();
}

function doLogout() {
  S.session = null;
  S.page = "dashboard";
  renderApp();
}

/* ── Render root ─────────────────────────────── */
function renderApp() {
  const root = document.getElementById("root");
  if (!S.session) {
    root.innerHTML = renderLogin();
    return;
  }
  root.innerHTML = renderShell();
  attachNavHandlers();
}

/* ── Login page ──────────────────────────────── */
function renderLogin() {
  return `
  <div id="login-page">
    <div class="login-card">
      <div class="login-header">
        <div class="login-logo-wrap"><i class="ti ti-package"></i></div>
        <h1 class="login-title">StockBase</h1>
        <p class="login-sub">Sign in to manage your inventory</p>
      </div>
      <div id="login-err"></div>
      <div class="form-group" style="margin-bottom:1rem">
        <label for="l-user">Username</label>
        <input id="l-user" type="text" value="admin" autocomplete="username" placeholder="Username">
      </div>
      <div class="form-group" style="margin-bottom:1.5rem">
        <label for="l-pass">Password</label>
        <input id="l-pass" type="password" value="admin123" autocomplete="current-password" placeholder="Password"
          onkeydown="if(event.key==='Enter') doLogin()">
      </div>
      <button class="btn btn-primary" style="width:100%" onclick="doLogin()">
        <i class="ti ti-login"></i> Sign in
      </button>
      <p class="login-hint">Demo credentials: <strong>admin</strong> / <strong>admin123</strong></p>
    </div>
  </div>`;
}

/* ── Shell (sidebar + topbar + content) ──────── */
function renderShell() {
  const prods = DB.products;
  const lowCount = prods.filter((p) => p.qty < 5).length;

  const navItems = [
    { id: "dashboard", icon: "ti-layout-dashboard", label: "Dashboard" },
    { id: "products", icon: "ti-box", label: "Products", badge: lowCount || 0 },
    { id: "suppliers", icon: "ti-building-store", label: "Suppliers" },
  ];

  const pageTitle =
    {
      dashboard: "Dashboard",
      products: "Products",
      addProduct: "Add product",
      editProduct: "Edit product",
      viewProduct: "Product detail",
      suppliers: "Suppliers",
      addSupplier: "Add supplier",
      editSupplier: "Edit supplier",
    }[S.page] || "StockBase";

  return `
  <div id="app">
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-brand">
        <div class="brand-logo">
          <div class="logo-icon"><i class="ti ti-package"></i></div>
          StockBase
        </div>
        <p class="brand-sub">Inventory Manager</p>
      </div>

      <nav class="sidebar-nav">
        <p class="nav-section-label">Menu</p>
        ${navItems
          .map(
            (n) => `
          <button class="nav-item${S.page.startsWith(n.id.replace("add", "").replace("edit", "")) && n.id !== "dashboard" ? " active" : S.page === n.id ? " active" : ""}"
            onclick="goTo('${n.id}')">
            <i class="ti ${n.icon} nav-icon"></i>
            ${n.label}
            ${n.badge ? `<span class="nav-badge">${n.badge}</span>` : ""}
          </button>`,
          )
          .join("")}
      </nav>

      <div class="sidebar-footer">
        <div class="user-row">
          <div class="user-avatar">${S.session.username[0].toUpperCase()}</div>
          <div class="user-info">
            <p class="user-name">${esc(S.session.username)}</p>
            <p class="user-role">${esc(S.session.role)}</p>
          </div>
          <button class="btn-signout" onclick="doLogout()" title="Sign out">
            <i class="ti ti-logout"></i>
          </button>
        </div>
      </div>
    </aside>

    <div class="main-content">
      <header class="topbar">
        <span class="topbar-title">${pageTitle}</span>
        <div class="topbar-actions" id="topbar-actions"></div>
      </header>
      <main class="page-body" id="page-body">
        ${renderPage()}
      </main>
    </div>
  </div>
  <div id="toast"></div>`;
}

function attachNavHandlers() {
  // highlight active nav correctly
  document.querySelectorAll(".nav-item").forEach((el) => {
    el.classList.remove("active");
  });
  const pageBase = S.page
    .replace("add", "")
    .replace("edit", "")
    .replace("view", "")
    .toLowerCase();
  document.querySelectorAll(".nav-item").forEach((el) => {
    const onclick = el.getAttribute("onclick") || "";
    const match = onclick.match(/'([^']+)'/);
    if (match) {
      const target = match[1];
      if (
        target === S.page ||
        (S.page.toLowerCase().includes(target) && target !== "dashboard")
      ) {
        el.classList.add("active");
      }
      if (S.page === "dashboard" && target === "dashboard")
        el.classList.add("active");
    }
  });
}

/* ── Page dispatcher ─────────────────────────── */
function renderPage() {
  switch (S.page) {
    case "dashboard":
      return pageDashboard();
    case "products":
      return pageProducts();
    case "addProduct":
      return pageProductForm(false);
    case "editProduct":
      return pageProductForm(true);
    case "viewProduct":
      return pageViewProduct();
    case "suppliers":
      return pageSuppliers();
    case "addSupplier":
      return pageSupplierForm(false);
    case "editSupplier":
      return pageSupplierForm(true);
    default:
      return "<p>Page not found.</p>";
  }
}

/* ── Dashboard ───────────────────────────────── */
function pageDashboard() {
  const prods = DB.products;
  const sups = DB.suppliers;
  const total = prods.length;
  const low = prods.filter((p) => p.qty < 5);
  const outOf = prods.filter((p) => p.qty === 0);
  const totalVal = prods.reduce((a, p) => a + p.price * p.qty, 0);

  return `
  <div class="stats-row">
    <div class="stat-card">
      <div class="stat-icon green"><i class="ti ti-box"></i></div>
      <p class="stat-val">${total}</p>
      <p class="stat-lbl">Total products</p>
    </div>
    <div class="stat-card${low.length ? " danger" : ""}">
      <div class="stat-icon red"><i class="ti ti-alert-triangle"></i></div>
      <p class="stat-val">${low.length}</p>
      <p class="stat-lbl">Low stock items</p>
    </div>
    <div class="stat-card">
      <div class="stat-icon amber"><i class="ti ti-building-store"></i></div>
      <p class="stat-val">${sups.length}</p>
      <p class="stat-lbl">Suppliers</p>
    </div>
    <div class="stat-card">
      <div class="stat-icon blue"><i class="ti ti-currency-dollar"></i></div>
      <p class="stat-val">$${totalVal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
      <p class="stat-lbl">Stock value</p>
    </div>
  </div>

  ${
    low.length
      ? `
  <div class="alert alert-warn">
    <i class="ti ti-alert-triangle"></i>
    <span><strong>${low.length} item${low.length > 1 ? "s" : ""}</strong> below 5 units —
      ${low.map((p) => `<strong>${esc(p.name)}</strong> (${p.qty})`).join(", ")}.
      <button class="btn btn-sm" style="margin-left:8px" onclick="goTo('products')">View products</button>
    </span>
  </div>`
      : ""
  }

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem">
    <div class="card">
      <h3 style="font-size:15px;font-weight:600;margin-bottom:1rem">Recent products</h3>
      ${prods
        .slice(-5)
        .reverse()
        .map((p) => {
          const sp = supplier(p.supplierId);
          return `<div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--border)">
          ${
            p.img
              ? `<img class="product-thumb" src="${p.img}" alt="${esc(p.name)}">`
              : `<div class="thumb-ph"><i class="ti ti-photo"></i></div>`
          }
          <div style="flex:1;min-width:0">
            <p style="font-size:14px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(p.name)}</p>
            <p style="font-size:12px;color:var(--text-muted)">${sp ? esc(sp.name) : "—"}</p>
          </div>
          <span class="badge ${p.qty === 0 ? "badge-danger" : p.qty < 5 ? "badge-warn" : "badge-success"}">${p.qty}</span>
        </div>`;
        })
        .join("")}
    </div>
    <div class="card">
      <h3 style="font-size:15px;font-weight:600;margin-bottom:1rem">Stock by supplier</h3>
      ${sups
        .map((s) => {
          const count = prods.filter((p) => p.supplierId === s.id).length;
          const pct = total ? Math.round((count / total) * 100) : 0;
          return `<div style="margin-bottom:14px">
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
            <span>${esc(s.name)}</span><span style="color:var(--text-muted)">${count} products</span>
          </div>
          <div style="height:6px;background:var(--surface2);border-radius:4px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:var(--accent);border-radius:4px;transition:width .4s"></div>
          </div>
        </div>`;
        })
        .join("")}
    </div>
  </div>`;
}

/* ── Products list ───────────────────────────── */
function pageProducts() {
  const q = (window._pSearch || "").toLowerCase();
  const sf = window._pFilter || "";
  const prods = DB.products.filter((p) => {
    const nm = p.name.toLowerCase().includes(q);
    const sp = sf ? String(p.supplierId) === String(sf) : true;
    return nm && sp;
  });
  const sups = DB.suppliers;

  return `
  ${
    DB.products.filter((p) => p.qty < 5).length
      ? `
  <div class="alert alert-danger">
    <i class="ti ti-alert-triangle"></i>
    <span>${DB.products.filter((p) => p.qty < 5).length} product(s) are low on stock (below 5 units).</span>
  </div>`
      : ""
  }

  <div style="display:flex;justify-content:flex-end;margin-bottom:1.25rem">
    <button class="btn btn-primary" onclick="goTo('addProduct')">
      <i class="ti ti-plus"></i> Add product
    </button>
  </div>

  <div class="table-container">
    <div class="table-toolbar">
      <div class="search-wrap" style="flex:1;max-width:280px">
        <i class="ti ti-search"></i>
        <input type="text" id="p-search" placeholder="Search products…"
          value="${esc(window._pSearch || "")}"
          oninput="window._pSearch=this.value;refreshProducts()">
      </div>
      <select id="p-filter" style="width:auto;min-width:160px"
        onchange="window._pFilter=this.value;refreshProducts()">
        <option value="">All suppliers</option>
        ${sups.map((s) => `<option value="${s.id}"${sf == s.id ? " selected" : ""}>${esc(s.name)}</option>`).join("")}
      </select>
      <span style="font-size:13px;color:var(--text-muted);margin-left:auto">${prods.length} result${prods.length !== 1 ? "s" : ""}</span>
    </div>

    ${
      prods.length === 0
        ? `
    <div class="empty-state">
      <i class="ti ti-box-off"></i>
      <p>No products found${q || sf ? " for this filter" : ""}.</p>
    </div>`
        : `
    <table>
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Supplier</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${prods
          .map((p) => {
            const sp = supplier(p.supplierId);
            const isLow = p.qty < 5;
            return `<tr class="${isLow ? "low-stock" : ""}">
            <td>${
              p.img
                ? `<img class="product-thumb" src="${p.img}" alt="${esc(p.name)}">`
                : `<div class="thumb-ph"><i class="ti ti-photo"></i></div>`
            }
            </td>
            <td>
              <span style="font-weight:500">${esc(p.name)}</span>
              ${isLow ? `<span class="badge badge-danger" style="margin-left:8px">${p.qty === 0 ? "Out of stock" : "Low stock"}</span>` : ""}
            </td>
            <td>$${Number(p.price).toFixed(2)}</td>
            <td>${p.qty}</td>
            <td style="color:var(--text-muted)">${sp ? esc(sp.name) : "—"}</td>
            <td>
              <div class="td-actions">
                <button class="btn btn-sm btn-icon" onclick="goTo('viewProduct',${p.id})" title="View">
                  <i class="ti ti-eye"></i>
                </button>
                <button class="btn btn-sm btn-icon" onclick="goTo('editProduct',${p.id})" title="Edit">
                  <i class="ti ti-edit"></i>
                </button>
                <button class="btn btn-sm btn-icon btn-danger" onclick="deleteProduct(${p.id})" title="Delete">
                  <i class="ti ti-trash"></i>
                </button>
              </div>
            </td>
          </tr>`;
          })
          .join("")}
      </tbody>
    </table>`
    }
  </div>`;
}

function refreshProducts() {
  document.getElementById("page-body").innerHTML = pageProducts();
}

function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;
  DB.setProducts(DB.products.filter((p) => p.id !== id));
  toast("Product deleted.", "ti-trash");
  goTo("products");
}

/* ── Product form ────────────────────────────── */
function pageProductForm(isEdit) {
  const p = isEdit ? DB.products.find((x) => x.id === S.editId) : {};
  if (isEdit && !p)
    return `<div class="alert alert-danger"><i class="ti ti-alert-circle"></i> Product not found.</div>`;

  const sups = DB.suppliers;

  return `
  <div class="page-hdr">
    <div class="page-hdr-left">
      <button class="back-btn" onclick="goTo('products')">
        <i class="ti ti-arrow-left"></i> Back
      </button>
      <h2>${isEdit ? "Edit product" : "Add product"}</h2>
    </div>
  </div>

  <div class="card" style="max-width:580px">
    <div id="form-err"></div>
    <div class="form-grid">
      <div class="form-group full">
        <label for="f-name">Name *</label>
        <input id="f-name" type="text" value="${esc(p.name || "")}" placeholder="Product name">
        <span class="field-error" id="e-name"></span>
      </div>
      <div class="form-group full">
        <label for="f-desc">Description</label>
        <textarea id="f-desc" rows="2" style="resize:vertical" placeholder="Optional description…">${esc(p.description || "")}</textarea>
      </div>
      <div class="form-group">
        <label for="f-price">Price ($) *</label>
        <input id="f-price" type="number" min="0" step="0.01" value="${p.price !== undefined ? p.price : ""}" placeholder="0.00">
        <span class="field-error" id="e-price"></span>
      </div>
      <div class="form-group">
        <label for="f-qty">Quantity *</label>
        <input id="f-qty" type="number" min="0" step="1" value="${p.qty !== undefined ? p.qty : ""}" placeholder="0">
        <span class="field-error" id="e-qty"></span>
      </div>
      <div class="form-group full">
        <label for="f-sup">Supplier</label>
        <select id="f-sup">
          <option value="">— No supplier —</option>
          ${sups.map((s) => `<option value="${s.id}"${p.supplierId == s.id ? " selected" : ""}>${esc(s.name)}</option>`).join("")}
        </select>
      </div>
      <div class="form-group full">
        <label>Product image</label>
        <div class="upload-zone" onclick="document.getElementById('f-img').click()">
          <i class="ti ti-cloud-upload"></i>
          <span>Click to upload an image from your computer</span>
          <input id="f-img" type="file" accept="image/*" style="display:none" onchange="previewProductImg(this,'${isEdit && p.img ? p.img : ""}')">
          <div id="img-preview">${p && p.img ? `<img src="${p.img}" alt="Current image">` : ""}</div>
        </div>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-primary" onclick="saveProduct(${isEdit ? p.id : "null"})">
        <i class="ti ti-device-floppy"></i> ${isEdit ? "Save changes" : "Add product"}
      </button>
      <button class="btn" onclick="goTo('products')">Cancel</button>
    </div>
  </div>`;
}

function previewProductImg(input, existingImg) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById("img-preview").innerHTML =
      `<img src="${e.target.result}" alt="Preview" style="max-height:130px;border-radius:6px;margin-top:10px">`;
  };
  reader.readAsDataURL(file);
}

function saveProduct(id) {
  const name = document.getElementById("f-name").value.trim();
  const desc = document.getElementById("f-desc").value.trim();
  const price = document.getElementById("f-price").value;
  const qty = document.getElementById("f-qty").value;
  const supId = document.getElementById("f-sup").value;

  // Validate
  let valid = true;
  const setErr = (field, msg) => {
    const el = document.getElementById("e-" + field);
    if (el) el.textContent = msg;
    if (msg) valid = false;
  };
  setErr("name", !name ? "Name is required." : "");
  setErr(
    "price",
    price === ""
      ? "Price is required."
      : Number(price) < 0
        ? "Price cannot be negative."
        : "",
  );
  setErr(
    "qty",
    qty === ""
      ? "Quantity is required."
      : Number(qty) < 0
        ? "Quantity cannot be negative."
        : !Number.isInteger(Number(qty))
          ? "Quantity must be a whole number."
          : "",
  );
  if (!valid) return;

  const imgFile = document.getElementById("f-img").files[0];

  function finish(imgData) {
    const prods = DB.products;
    const existing = id ? prods.find((x) => x.id === id) : null;
    const finalImg = imgData || (existing ? existing.img : null);

    if (id) {
      const idx = prods.findIndex((x) => x.id === id);
      prods[idx] = {
        ...prods[idx],
        name,
        description: desc,
        price: Number(Number(price).toFixed(2)),
        qty: Number(qty),
        supplierId: supId ? Number(supId) : null,
        img: finalImg,
      };
    } else {
      prods.push({
        id: uid(),
        name,
        description: desc,
        price: Number(Number(price).toFixed(2)),
        qty: Number(qty),
        supplierId: supId ? Number(supId) : null,
        img: finalImg,
      });
    }
    DB.setProducts(prods);
    toast(id ? "Product updated." : "Product added.", "ti-check");
    goTo("products");
  }

  if (imgFile) {
    const reader = new FileReader();
    reader.onload = (e) => finish(e.target.result);
    reader.readAsDataURL(imgFile);
  } else {
    finish(null);
  }
}

/* ── View product ────────────────────────────── */
function pageViewProduct() {
  const p = DB.products.find((x) => x.id === S.viewId);
  if (!p)
    return `<div class="alert alert-danger"><i class="ti ti-alert-circle"></i> Product not found.</div>`;
  const sp = supplier(p.supplierId);

  return `
  <div class="page-hdr">
    <div class="page-hdr-left">
      <button class="back-btn" onclick="goTo('products')">
        <i class="ti ti-arrow-left"></i> Back
      </button>
      <h2>${esc(p.name)}</h2>
    </div>
    <button class="btn" onclick="goTo('editProduct', ${p.id})">
      <i class="ti ti-edit"></i> Edit
    </button>
  </div>

  <div class="card">
    <div class="view-grid">
      <div>
        ${
          p.img
            ? `<img class="view-img" src="${p.img}" alt="${esc(p.name)}">`
            : `<div class="view-img-ph"><i class="ti ti-photo"></i></div>`
        }
      </div>
      <div>
        <h3 style="font-size:20px;font-weight:600;margin-bottom:4px">${esc(p.name)}</h3>
        ${p.description ? `<p style="color:var(--text-muted);font-size:14px;margin-bottom:1.25rem">${esc(p.description)}</p>` : '<div style="margin-bottom:1.25rem"></div>'}
        <div class="detail-list">
          <div class="detail-row">
            <span class="detail-key">Price</span>
            <span class="detail-val">$${Number(p.price).toFixed(2)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-key">Quantity in stock</span>
            <span class="detail-val">
              <span class="badge ${p.qty === 0 ? "badge-danger" : p.qty < 5 ? "badge-warn" : "badge-success"}">
                ${p.qty === 0 ? "Out of stock" : p.qty < 5 ? `${p.qty} — low stock` : `${p.qty} in stock`}
              </span>
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-key">Supplier</span>
            <span class="detail-val">${sp ? esc(sp.name) : "—"}</span>
          </div>
          ${
            sp
              ? `
          <div class="detail-row">
            <span class="detail-key">Supplier email</span>
            <span class="detail-val"><a href="mailto:${esc(sp.email)}" style="color:var(--accent)">${esc(sp.email)}</a></span>
          </div>
          <div class="detail-row">
            <span class="detail-key">Supplier phone</span>
            <span class="detail-val">${esc(sp.phone)}</span>
          </div>`
              : ""
          }
          <div class="detail-row">
            <span class="detail-key">Stock value</span>
            <span class="detail-val">$${(p.price * p.qty).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

/* ── Suppliers list ──────────────────────────── */
function pageSuppliers() {
  const sups = DB.suppliers;
  const prods = DB.products;

  return `
  <div style="display:flex;justify-content:flex-end;margin-bottom:1.25rem">
    <button class="btn btn-primary" onclick="goTo('addSupplier')">
      <i class="ti ti-plus"></i> Add supplier
    </button>
  </div>

  <div class="table-container">
    ${
      sups.length === 0
        ? `
    <div class="empty-state">
      <i class="ti ti-building-store"></i>
      <p>No suppliers yet. Add one to get started.</p>
    </div>`
        : `
    <table>
      <thead>
        <tr><th>Name</th><th>Email</th><th>Phone</th><th>Products</th><th>Actions</th></tr>
      </thead>
      <tbody>
        ${sups
          .map((s) => {
            const cnt = prods.filter((p) => p.supplierId === s.id).length;
            return `<tr>
            <td style="font-weight:500">${esc(s.name)}</td>
            <td><a href="mailto:${esc(s.email)}" style="color:var(--accent)">${esc(s.email)}</a></td>
            <td style="color:var(--text-muted)">${esc(s.phone)}</td>
            <td><span class="badge ${cnt > 0 ? "badge-success" : "badge-neutral"}">${cnt} product${cnt !== 1 ? "s" : ""}</span></td>
            <td>
              <div class="td-actions">
                <button class="btn btn-sm btn-icon" onclick="goTo('editSupplier',${s.id})" title="Edit">
                  <i class="ti ti-edit"></i>
                </button>
                <button class="btn btn-sm btn-icon btn-danger" onclick="deleteSupplier(${s.id})" title="Delete">
                  <i class="ti ti-trash"></i>
                </button>
              </div>
            </td>
          </tr>`;
          })
          .join("")}
      </tbody>
    </table>`
    }
  </div>`;
}

function deleteSupplier(id) {
  const linked = DB.products.filter((p) => p.supplierId === id).length;
  const msg = linked
    ? `This supplier has ${linked} linked product(s). Delete anyway?`
    : "Delete this supplier?";
  if (!confirm(msg)) return;
  DB.setSuppliers(DB.suppliers.filter((s) => s.id !== id));
  toast("Supplier deleted.", "ti-trash");
  goTo("suppliers");
}

/* ── Supplier form ───────────────────────────── */
function pageSupplierForm(isEdit) {
  const s = isEdit ? DB.suppliers.find((x) => x.id === S.editId) : {};
  if (isEdit && !s)
    return `<div class="alert alert-danger"><i class="ti ti-alert-circle"></i> Supplier not found.</div>`;

  return `
  <div class="page-hdr">
    <div class="page-hdr-left">
      <button class="back-btn" onclick="goTo('suppliers')">
        <i class="ti ti-arrow-left"></i> Back
      </button>
      <h2>${isEdit ? "Edit supplier" : "Add supplier"}</h2>
    </div>
  </div>

  <div class="card" style="max-width:480px">
    <div id="form-err"></div>
    <div class="form-grid">
      <div class="form-group full">
        <label for="s-name">Company name *</label>
        <input id="s-name" type="text" value="${esc(s.name || "")}" placeholder="e.g. TechVend Co.">
        <span class="field-error" id="e-sname"></span>
      </div>
      <div class="form-group full">
        <label for="s-email">Contact email *</label>
        <input id="s-email" type="email" value="${esc(s.email || "")}" placeholder="contact@company.com">
        <span class="field-error" id="e-semail"></span>
      </div>
      <div class="form-group full">
        <label for="s-phone">Phone number</label>
        <input id="s-phone" type="text" value="${esc(s.phone || "")}" placeholder="+1 555-0000">
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-primary" onclick="saveSupplier(${isEdit ? s.id : "null"})">
        <i class="ti ti-device-floppy"></i> ${isEdit ? "Save changes" : "Add supplier"}
      </button>
      <button class="btn" onclick="goTo('suppliers')">Cancel</button>
    </div>
  </div>`;
}

function saveSupplier(id) {
  const name = document.getElementById("s-name").value.trim();
  const email = document.getElementById("s-email").value.trim();
  const phone = document.getElementById("s-phone").value.trim();

  let valid = true;
  const setErr = (field, msg) => {
    const el = document.getElementById("e-s" + field);
    if (el) el.textContent = msg;
    if (msg) valid = false;
  };
  setErr("name", !name ? "Company name is required." : "");
  setErr(
    "email",
    !email
      ? "Email is required."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? "Enter a valid email address."
        : "",
  );
  if (!valid) return;

  const sups = DB.suppliers;
  if (id) {
    const idx = sups.findIndex((x) => x.id === id);
    sups[idx] = { ...sups[idx], name, email, phone };
  } else {
    sups.push({ id: uid(), name, email, phone });
  }
  DB.setSuppliers(sups);
  toast(id ? "Supplier updated." : "Supplier added.", "ti-check");
  goTo("suppliers");
}

/* ── Boot ────────────────────────────────────── */
seed();
renderApp();
