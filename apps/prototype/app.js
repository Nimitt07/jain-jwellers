const STORAGE_KEY = "jain-jewellers-state-v1";

const defaultRates = {
  gold22: 6890,
  gold18: 5640,
  silver: 92.5
};

const productNames = [
  ["Rings", "Temple Lakshmi Ring", "22K Gold", "gold22", 5.42, 1250, 10, "Hand-finished temple ring with antique curves.", "Bestseller"],
  ["Rings", "Classic Solitaire Ring", "18K Gold", "gold18", 3.18, 1800, 14, "Diamond-look centerpiece ring for daily elegance.", "New"],
  ["Rings", "Peacock Filigree Ring", "22K Gold", "gold22", 6.1, 1450, 12, "Openwork peacock pattern with a polished top.", "Festive"],
  ["Rings", "Ruby Halo Ring", "18K Gold", "gold18", 4.25, 2100, 15, "Ruby-tone halo ring with bright stone detailing.", "Premium"],
  ["Rings", "Minimal Band Ring", "22K Gold", "gold22", 2.8, 750, 8, "Slim gold band made for everyday wear.", ""],
  ["Rings", "Royal Cluster Ring", "18K Gold", "gold18", 5.15, 2300, 16, "Cluster setting with high-shine gold shoulders.", "Premium"],
  ["Rings", "Twisted Vine Ring", "22K Gold", "gold22", 4.65, 1150, 10, "Vine-inspired textured ring with soft curves.", ""],
  ["Necklaces", "Mango Mala Necklace", "22K Gold", "gold22", 38.5, 8200, 13, "Traditional mango motif necklace for weddings.", "Bridal"],
  ["Necklaces", "Pearl Drop Necklace", "18K Gold", "gold18", 18.75, 5200, 16, "Pearl-style drops on a refined gold chain.", "New"],
  ["Necklaces", "Antique Choker", "22K Gold", "gold22", 44.2, 9600, 14, "Statement antique choker with temple detailing.", "Bridal"],
  ["Necklaces", "Floral Pendant Set", "18K Gold", "gold18", 12.4, 3600, 15, "Floral pendant with matching lightweight chain.", ""],
  ["Necklaces", "Layered Gold Haram", "22K Gold", "gold22", 55.8, 12200, 13, "Layered haram inspired by classic South Indian craft.", "Festive"],
  ["Necklaces", "Daily Wear Chain Set", "22K Gold", "gold22", 15.6, 2400, 9, "Simple chain and pendant pairing for everyday use.", ""],
  ["Necklaces", "Emerald Line Necklace", "18K Gold", "gold18", 22.35, 6400, 17, "Emerald-tone line necklace with a graceful fall.", "Premium"],
  ["Earrings", "Jhumka Bell Earrings", "22K Gold", "gold22", 9.85, 2200, 12, "Bell jhumkas with bead accents and warm polish.", "Bestseller"],
  ["Earrings", "Pearl Stud Earrings", "18K Gold", "gold18", 3.8, 950, 11, "Compact pearl-style studs for office and occasion.", ""],
  ["Earrings", "Chandbali Earrings", "22K Gold", "gold22", 12.7, 2800, 13, "Crescent chandbalis with ornate filigree work.", "Festive"],
  ["Earrings", "Hoop Earrings", "22K Gold", "gold22", 6.5, 1200, 9, "Lightweight gold hoops with a smooth finish.", ""],
  ["Earrings", "Diamond-Cut Drops", "18K Gold", "gold18", 5.25, 1750, 14, "Drop earrings with diamond-cut sparkle.", "New"],
  ["Earrings", "Navratna Tops", "22K Gold", "gold22", 7.1, 1650, 12, "Colorful navratna-style tops in polished gold.", "Premium"],
  ["Earrings", "Kids Heart Studs", "18K Gold", "gold18", 2.2, 650, 10, "Small heart studs with a secure screw back.", ""],
  ["Bangles", "Rajwadi Gold Bangles", "22K Gold", "gold22", 28.4, 5400, 12, "Pair of Rajwadi bangles with carved edges.", "Bridal"],
  ["Bangles", "Daily Wear Bangles", "22K Gold", "gold22", 18.25, 2800, 9, "Clean pair of bangles for regular wear.", ""],
  ["Bangles", "Stone Kada", "18K Gold", "gold18", 16.6, 4200, 15, "Stone-studded kada with a premium clasp.", "Premium"],
  ["Bangles", "Antique Broad Kada", "22K Gold", "gold22", 32.75, 7200, 14, "Broad antique kada for festive outfits.", "Festive"],
  ["Bangles", "Floral Baby Bangle", "22K Gold", "gold22", 8.25, 1450, 10, "Adjustable baby bangle with floral engraving.", ""],
  ["Bangles", "Meenakari Bangle", "22K Gold", "gold22", 21.3, 4700, 13, "Color enamel inspired meenakari bangle.", "New"],
  ["Bangles", "Diamond-Cut Bracelet", "18K Gold", "gold18", 9.9, 2500, 15, "Bracelet-style bangle with diamond-cut texture.", ""],
  ["Chains", "Rope Gold Chain", "22K Gold", "gold22", 11.4, 1700, 8, "Rope-pattern chain with a secure hook.", "Bestseller"],
  ["Chains", "Box Chain", "22K Gold", "gold22", 8.85, 1350, 8, "Neat box chain for pendants and daily wear.", ""],
  ["Chains", "Figaro Chain", "18K Gold", "gold18", 10.2, 1850, 11, "Modern Figaro links in 18K gold.", "New"],
  ["Chains", "Baby Nazariya Chain", "22K Gold", "gold22", 5.35, 900, 8, "Light nazariya chain with black bead accents.", ""],
  ["Chains", "Thick Curb Chain", "22K Gold", "gold22", 24.8, 3900, 10, "Bold curb chain with a rich gold profile.", "Premium"],
  ["Chains", "Singapore Chain", "18K Gold", "gold18", 7.6, 1450, 12, "Sparkling Singapore chain with twisted links.", ""],
  ["Chains", "Mangalsutra Chain", "22K Gold", "gold22", 13.75, 2100, 9, "Black-bead mangalsutra chain with gold stations.", "Bestseller"],
  ["Silver", "Silver Anklet Pair", "Silver", "silver", 32.6, 580, 18, "Classic silver anklet pair with tiny bells.", "Bestseller"],
  ["Silver", "Oxidised Silver Kada", "Silver", "silver", 42.2, 720, 20, "Oxidised kada with carved traditional texture.", "New"],
  ["Silver", "Silver Toe Rings", "Silver", "silver", 7.4, 180, 16, "Comfortable toe ring pair with floral top.", ""],
  ["Silver", "Silver Pooja Coin", "Silver", "silver", 10, 120, 8, "Pure silver coin for gifting and pooja.", ""],
  ["Silver", "Silver Baby Bracelet", "Silver", "silver", 12.5, 260, 15, "Soft-finish bracelet for children.", ""],
  ["Silver", "Silver Payal Heavy", "Silver", "silver", 58.8, 980, 20, "Heavy payal pair with rich traditional work.", "Premium"],
  ["Silver", "Silver Chain", "Silver", "silver", 18.6, 320, 14, "Minimal silver chain for daily wear.", ""],
  ["Necklaces", "Bridal Rani Haar", "22K Gold", "gold22", 68.4, 15500, 14, "Grand rani haar with layered royal detailing.", "Bridal"],
  ["Earrings", "Temple Drop Earrings", "22K Gold", "gold22", 10.45, 2400, 13, "Temple drops shaped for bridal sets.", "Bridal"],
  ["Rings", "Men's Signet Ring", "22K Gold", "gold22", 8.75, 1700, 10, "Bold signet ring with a polished face.", ""],
  ["Chains", "Pendant Chain Combo", "18K Gold", "gold18", 9.35, 1950, 13, "18K pendant and chain combo with modern styling.", "New"],
  ["Bangles", "Two-Tone Gold Bangle", "22K Gold", "gold22", 19.8, 4100, 12, "Two-tone finish with engraved leaf accents.", "Premium"],
  ["Silver", "Silver Dinner Spoon", "Silver", "silver", 64.5, 1150, 18, "Gift-ready silver spoon with engraved handle.", ""],
  ["Earrings", "Gold Ear Cuffs", "18K Gold", "gold18", 4.7, 1300, 14, "Contemporary ear cuffs with a snug curve.", ""],
  ["Necklaces", "Kids Pendant Chain", "22K Gold", "gold22", 6.9, 1100, 9, "Lightweight pendant chain designed for children.", ""]
];

const defaultProducts = productNames.map((item, index) => ({
  id: `JJ-${String(index + 1).padStart(3, "0")}`,
  category: item[0],
  name: item[1],
  purity: item[2],
  metal: item[3],
  weight: item[4],
  labour: item[5],
  makingPercent: item[6],
  gstPercent: 3,
  description: item[7],
  badge: item[8]
}));

let state = loadState();
let currentFilter = "All";
let searchTerm = "";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return { rates: defaultRates, products: defaultProducts, cart: [] };
  }

  try {
    const parsed = JSON.parse(saved);
    return {
      rates: { ...defaultRates, ...parsed.rates },
      products: Array.isArray(parsed.products) ? parsed.products : defaultProducts,
      cart: Array.isArray(parsed.cart) ? parsed.cart : []
    };
  } catch {
    return { rates: defaultRates, products: defaultProducts, cart: [] };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function money(value) {
  return currency.format(Math.round(value));
}

function rateLabel(key) {
  return {
    gold22: "22K Gold",
    gold18: "18K Gold",
    silver: "Silver"
  }[key];
}

function calculatePrice(product) {
  const rate = Number(state.rates[product.metal] || 0);
  const metalValue = Number(product.weight) * rate;
  const makingCharge = metalValue * (Number(product.makingPercent) / 100);
  const subTotal = metalValue + makingCharge + Number(product.labour);
  const gst = subTotal * (Number(product.gstPercent) / 100);

  return {
    rate,
    metalValue,
    makingCharge,
    gst,
    total: subTotal + gst
  };
}

function productImage(product) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 430;
  const ctx = canvas.getContext("2d");
  const isSilver = product.metal === "silver";
  const base = isSilver ? "#d8dde1" : "#d49b2d";
  const dark = isSilver ? "#858d95" : "#8f5e16";
  const accent = product.category === "Silver" ? "#565d66" : "#7d1730";

  const grad = ctx.createLinearGradient(0, 0, 640, 430);
  grad.addColorStop(0, "#fff8ec");
  grad.addColorStop(1, isSilver ? "#eef2f5" : "#f6dfaa");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 430);

  ctx.fillStyle = "rgba(255,255,255,0.52)";
  ctx.beginPath();
  ctx.arc(525, 74, 96, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(92, 356, 124, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = base;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (product.category === "Rings") {
    ctx.lineWidth = 34;
    ctx.beginPath();
    ctx.ellipse(320, 230, 112, 92, 0, 0, Math.PI * 2);
    ctx.stroke();
    drawGem(ctx, 320, 116, accent);
  } else if (product.category === "Necklaces") {
    ctx.lineWidth = 24;
    ctx.beginPath();
    ctx.arc(320, 95, 190, 0.18 * Math.PI, 0.82 * Math.PI);
    ctx.stroke();
    for (let i = 0; i < 9; i += 1) {
      drawBead(ctx, 190 + i * 32, 230 + Math.abs(4 - i) * 10, base, dark);
    }
    drawGem(ctx, 320, 275, accent);
  } else if (product.category === "Earrings") {
    drawEarring(ctx, 240, 180, base, dark, accent);
    drawEarring(ctx, 400, 180, base, dark, accent);
  } else if (product.category === "Bangles") {
    ctx.lineWidth = 30;
    ctx.beginPath();
    ctx.ellipse(320, 220, 170, 96, -0.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = dark;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.ellipse(320, 220, 122, 69, -0.2, 0, Math.PI * 2);
    ctx.stroke();
  } else if (product.category === "Chains") {
    for (let i = 0; i < 12; i += 1) {
      ctx.save();
      ctx.translate(116 + i * 38, 215 + Math.sin(i) * 15);
      ctx.rotate(i % 2 ? 0.75 : -0.75);
      ctx.lineWidth = 13;
      ctx.strokeStyle = i % 2 ? dark : base;
      ctx.beginPath();
      ctx.ellipse(0, 0, 28, 15, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  } else {
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(140, 220);
    ctx.bezierCurveTo(240, 140, 400, 140, 500, 220);
    ctx.stroke();
    for (let i = 0; i < 9; i += 1) {
      drawBead(ctx, 160 + i * 40, 230 + (i % 2) * 18, base, dark);
    }
  }

  ctx.fillStyle = "rgba(33,23,15,0.72)";
  ctx.font = "700 24px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(product.purity, 320, 380);

  return canvas.toDataURL("image/png");
}

function drawGem(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - 36);
  ctx.lineTo(x + 42, y);
  ctx.lineTo(x, y + 46);
  ctx.lineTo(x - 42, y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 4;
  ctx.stroke();
}

function drawBead(ctx, x, y, base, dark) {
  const bead = ctx.createRadialGradient(x - 8, y - 8, 4, x, y, 22);
  bead.addColorStop(0, "#fff6cc");
  bead.addColorStop(0.45, base);
  bead.addColorStop(1, dark);
  ctx.fillStyle = bead;
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill();
}

function drawEarring(ctx, x, y, base, dark, accent) {
  ctx.strokeStyle = base;
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.arc(x, y, 46, 0, Math.PI * 2);
  ctx.stroke();
  drawBead(ctx, x, y + 82, base, dark);
  drawGem(ctx, x, y + 20, accent);
}

function renderRates() {
  document.getElementById("rateCards").innerHTML = Object.entries(state.rates)
    .map(([key, value]) => `
      <article class="rate-card">
        <span>${rateLabel(key)} rate per gram</span>
        <strong>${money(value)}</strong>
      </article>
    `)
    .join("");

  const form = document.getElementById("ratesForm");
  form.gold22.value = state.rates.gold22;
  form.gold18.value = state.rates.gold18;
  form.silver.value = state.rates.silver;
}

function renderProducts() {
  const products = state.products.filter((product) => {
    const matchesFilter = currentFilter === "All" || product.category === currentFilter;
    const haystack = `${product.name} ${product.category} ${product.description} ${product.purity}`.toLowerCase();
    return matchesFilter && haystack.includes(searchTerm.toLowerCase());
  });

  const grid = document.getElementById("productGrid");
  grid.innerHTML = products.map((product) => {
    const price = calculatePrice(product);
    return `
      <article class="product-card">
        <div class="product-art">
          ${product.badge ? `<span class="badge">${product.badge}</span>` : ""}
          <img src="${productImage(product)}" alt="${product.name}" />
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="meta">${product.description}</p>
          <p class="meta">${product.purity} - ${product.weight}g - Labour ${money(product.labour)} - Making ${product.makingPercent}%</p>
          <div class="price">
            <strong>${money(price.total)}</strong>
            <span>incl. ${product.gstPercent}% GST</span>
          </div>
          <button class="add-button" type="button" data-add="${product.id}">Add to cart</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderAdminRows() {
  const rows = document.getElementById("adminRows");
  rows.innerHTML = state.products.map((product) => {
    const price = calculatePrice(product);
    return `
      <tr>
        <td><strong>${product.name}</strong><br><span class="meta">${product.category}</span></td>
        <td>${product.purity}</td>
        <td>${product.weight}g</td>
        <td>${money(product.labour)}</td>
        <td>${product.makingPercent}%</td>
        <td>${money(price.total)}</td>
        <td>
          <div class="row-actions">
            <button class="small-button" type="button" data-edit="${product.id}">Edit</button>
            <button class="small-button danger" type="button" data-delete="${product.id}">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function renderCart() {
  const count = state.cart.reduce((sum, line) => sum + line.qty, 0);
  document.getElementById("cartCount").textContent = count;

  const lines = document.getElementById("cartLines");
  if (!state.cart.length) {
    lines.innerHTML = `<p class="empty">Your cart is empty.</p>`;
    document.getElementById("cartTotal").textContent = money(0);
    return;
  }

  let total = 0;
  lines.innerHTML = state.cart.map((line) => {
    const product = state.products.find((item) => item.id === line.id);
    if (!product) return "";
    const lineTotal = calculatePrice(product).total * line.qty;
    total += lineTotal;
    return `
      <div class="cart-line">
        <div>
          <strong>${product.name}</strong>
          <p class="meta">${product.weight}g ${product.purity} - ${money(calculatePrice(product).total)} each</p>
          <div class="qty">
            <button type="button" data-dec="${product.id}">-</button>
            <span>${line.qty}</span>
            <button type="button" data-inc="${product.id}">+</button>
          </div>
        </div>
        <strong>${money(lineTotal)}</strong>
      </div>
    `;
  }).join("");

  document.getElementById("cartTotal").textContent = money(total);
}

function renderAll() {
  renderRates();
  renderProducts();
  renderAdminRows();
  renderCart();
}

function addToCart(id) {
  const line = state.cart.find((item) => item.id === id);
  if (line) {
    line.qty += 1;
  } else {
    state.cart.push({ id, qty: 1 });
  }
  saveState();
  renderCart();
  toggleCart(true);
}

function updateCart(id, delta) {
  const line = state.cart.find((item) => item.id === id);
  if (!line) return;
  line.qty += delta;
  state.cart = state.cart.filter((item) => item.qty > 0);
  saveState();
  renderCart();
}

function toggleCart(force) {
  const drawer = document.getElementById("cartDrawer");
  const scrim = document.getElementById("scrim");
  const open = typeof force === "boolean" ? force : !drawer.classList.contains("open");
  drawer.classList.toggle("open", open);
  scrim.classList.toggle("open", open);
  drawer.setAttribute("aria-hidden", String(!open));
}

function fillProductForm(product) {
  const form = document.getElementById("productForm");
  form.id.value = product?.id || "";
  form.name.value = product?.name || "";
  form.category.value = product?.category || "Rings";
  form.metal.value = product?.metal || "gold22";
  form.weight.value = product?.weight || "";
  form.labour.value = product?.labour || "";
  form.makingPercent.value = product?.makingPercent || "";
  form.gstPercent.value = product?.gstPercent ?? 3;
  form.badge.value = product?.badge || "";
  form.description.value = product?.description || "";
  document.getElementById("productFormTitle").textContent = product ? `Edit ${product.id}` : "Add new product";
}

document.getElementById("ratesForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  state.rates = {
    gold22: Number(form.gold22.value),
    gold18: Number(form.gold18.value),
    silver: Number(form.silver.value)
  };
  saveState();
  renderAll();
});

document.getElementById("productForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const product = {
    id: form.id.value || `JJ-${Date.now()}`,
    name: form.name.value.trim(),
    category: form.category.value,
    purity: rateLabel(form.metal.value),
    metal: form.metal.value,
    weight: Number(form.weight.value),
    labour: Number(form.labour.value),
    makingPercent: Number(form.makingPercent.value),
    gstPercent: Number(form.gstPercent.value),
    badge: form.badge.value.trim(),
    description: form.description.value.trim()
  };

  const index = state.products.findIndex((item) => item.id === product.id);
  if (index >= 0) {
    state.products[index] = product;
  } else {
    state.products.unshift(product);
  }

  saveState();
  fillProductForm(null);
  renderAll();
});

document.getElementById("catalog").addEventListener("click", (event) => {
  const id = event.target.dataset.add;
  if (id) addToCart(id);
});

document.getElementById("adminRows").addEventListener("click", (event) => {
  const editId = event.target.dataset.edit;
  const deleteId = event.target.dataset.delete;
  if (editId) {
    const product = state.products.find((item) => item.id === editId);
    fillProductForm(product);
    document.getElementById("productForm").scrollIntoView({ behavior: "smooth", block: "center" });
  }
  if (deleteId) {
    state.products = state.products.filter((item) => item.id !== deleteId);
    state.cart = state.cart.filter((item) => item.id !== deleteId);
    saveState();
    renderAll();
  }
});

document.getElementById("cartLines").addEventListener("click", (event) => {
  if (event.target.dataset.inc) updateCart(event.target.dataset.inc, 1);
  if (event.target.dataset.dec) updateCart(event.target.dataset.dec, -1);
});

document.getElementById("searchInput").addEventListener("input", (event) => {
  searchTerm = event.target.value;
  renderProducts();
});

document.querySelector(".collection-strip").addEventListener("click", (event) => {
  if (!event.target.matches(".chip")) return;
  currentFilter = event.target.dataset.filter;
  document.querySelectorAll(".chip").forEach((chip) => chip.classList.toggle("active", chip === event.target));
  renderProducts();
});

document.getElementById("cartToggle").addEventListener("click", () => toggleCart());
document.getElementById("closeCart").addEventListener("click", () => toggleCart(false));
document.getElementById("scrim").addEventListener("click", () => toggleCart(false));
document.getElementById("cancelEdit").addEventListener("click", () => fillProductForm(null));
document.getElementById("resetData").addEventListener("click", () => {
  state = { rates: defaultRates, products: defaultProducts, cart: [] };
  saveState();
  fillProductForm(null);
  renderAll();
});

renderAll();
