import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  Bell,
  ChartNoAxesCombined,
  Download,
  Gem,
  LogOut,
  MapPin,
  PackageCheck,
  ReceiptText,
  ShoppingBag,
  Trash2,
  Users,
  WalletCards
} from "lucide-react";
import {
  calculateProductPrice,
  currentDemoRate,
  formatINR,
  seedProducts,
  type GoldRate,
  type Product
} from "@jain-jewellers/shared";

const modules = [
  { id: "dashboard", label: "Analytics", icon: ChartNoAxesCombined },
  { id: "products", label: "Products", icon: Gem },
  { id: "orders", label: "Orders", icon: PackageCheck },
  { id: "schemes", label: "Schemes", icon: WalletCards },
  { id: "rates", label: "Gold Rates", icon: ReceiptText },
  { id: "showrooms", label: "Showrooms", icon: MapPin },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "users", label: "Users & Loyalty", icon: Users }
] as const;

type ModuleId = (typeof modules)[number]["id"];
type CartLine = { productId: string; qty: number };
type Order = { id: string; customer: string; phone: string; productId: string; qty: number; payment: string; status: string; total: number; date: string };
type Scheme = { id: string; customer: string; plan: string; monthlyAmount: number; paid: number; maturityDate: string; status: string };
type Showroom = { id: string; name: string; city: string; address: string; phone: string; hours: string; services: string };
type NotificationItem = { id: string; title: string; audience: string; channel: string; schedule: string; status: string };
type UserRecord = { id: string; name: string; phone: string; city: string; tier: string; points: number };
type AnalyticsNote = { id: string; title: string; metric: string; value: string; owner: string };

type GenericItem = Scheme | Showroom | NotificationItem | UserRecord | AnalyticsNote;
type GenericModule = "dashboard" | "schemes" | "showrooms" | "notifications" | "users";

const ADMIN_MOBILE = "9876543210";
const ADMIN_PASSWORD = "admin@123";
const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://jain-jwellers.onrender.com").replace(/\/$/, "");
type Role = "admin" | "viewer";

const productTemplate: Product = {
  id: "",
  name: "",
  category: "Gold",
  subCategory: "Rings",
  metal: "gold",
  purityKt: 22,
  grossWeight: 1,
  netWeight: 1,
  makingChargePct: 10,
  labourCharge: 0,
  stoneDetails: "No stones",
  images: [],
  stockQty: 1,
  hallmarkId: "",
  collectionName: "Jain Signature",
  occasion: "Daily wear",
  rating: 4.5,
  popularity: 50,
  description: "",
  createdAt: new Date().toISOString()
};

const defaultOrders: Order[] = [];
const defaultSchemes: Scheme[] = [
  { id: "SCH-001", customer: "Aarav Sharma", plan: "Golden Bloom", monthlyAmount: 15000, paid: 5, maturityDate: "2026-12-25", status: "Active" },
  { id: "SCH-002", customer: "Meera Jain", plan: "Golden Glow", monthlyAmount: 10000, paid: 8, maturityDate: "2026-09-15", status: "Active" }
];
const defaultShowrooms: Showroom[] = [
  { id: "SHR-001", name: "Jain Jewellers Flagship", city: "Mumbai", address: "MG Road, Borivali West", phone: "9876543210", hours: "10:30 AM - 8:30 PM", services: "Sales, Repair, Cleaning, Exchange" },
  { id: "SHR-002", name: "Jain Jewellers Bridal Studio", city: "Pune", address: "Laxmi Road", phone: "9876501234", hours: "11:00 AM - 8:00 PM", services: "Bridal, Appointment, Scheme Desk" }
];
const defaultNotifications: NotificationItem[] = [
  { id: "NTF-001", title: "Akshaya Tritiya offer", audience: "All customers", channel: "Push + SMS", schedule: "Today 6 PM", status: "Draft" }
];
const defaultUsers: UserRecord[] = [
  { id: "USR-001", name: "Aarav Sharma", phone: "9876543210", city: "Mumbai", tier: "Gold", points: 12450 },
  { id: "USR-002", name: "Meera Jain", phone: "9820012345", city: "Pune", tier: "Platinum", points: 36200 }
];
const defaultAnalytics: AnalyticsNote[] = [
  { id: "ANL-001", title: "Wedding conversion", metric: "Bridal sales", value: "₹18.4L", owner: "Store manager" },
  { id: "ANL-002", title: "Fast moving products", metric: "Top collection", value: "Rajwada Bridal", owner: "Merchandising" }
];

export function App() {
  const [role, setRole] = useState<Role | null>(() => {
    const saved = localStorage.getItem("jj-admin-role");
    return saved === "admin" || saved === "viewer" ? saved : null;
  });
  const [active, setActive] = useState<ModuleId>("dashboard");
  const [products, setProducts] = useState<Product[]>(() => readJson("jj-products", seedProducts));
  const [rate, setRate] = useState<GoldRate>(() => ({ ...currentDemoRate, ...readJson("jj-rate", currentDemoRate) }));
  const [cart, setCart] = useState<CartLine[]>(() => readJson("jj-cart", []));
  const [orders, setOrders] = useState<Order[]>(() => (
    role === "admin" ? readJson("jj-orders", defaultOrders) : readJson("jj-local-orders", [])
  ));
  const [schemes, setSchemes] = useState<Scheme[]>(() => readJson("jj-schemes", defaultSchemes));
  const [showrooms, setShowrooms] = useState<Showroom[]>(() => readJson("jj-showrooms", defaultShowrooms));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => readJson("jj-notifications", defaultNotifications));
  const [users, setUsers] = useState<UserRecord[]>(() => readJson("jj-users", defaultUsers));
  const [analytics, setAnalytics] = useState<AnalyticsNote[]>(() => readJson("jj-analytics", defaultAnalytics));
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [editingGeneric, setEditingGeneric] = useState<{ module: GenericModule; item: GenericItem } | null>(null);
  const [placingOrder, setPlacingOrder] = useState<Order | null>(null);
  const [notice, setNotice] = useState("Welcome to Jain Jewellers admin.");
  const [cartOpen, setCartOpen] = useState(false);
  const isAdmin = role === "admin";

  useEffect(() => {
    let cancelled = false;

    async function loadSharedData() {
      try {
        const [productsResponse, rateResponse, ordersData, analyticsData, schemesData, showroomsData, notificationsData, usersData] = await Promise.all([
          fetch(`${API_BASE_URL}/products`),
          fetch(`${API_BASE_URL}/gold-rates/current?city=${encodeURIComponent(rate.city)}`),
          isAdmin ? fetchAdminData("orders") : Promise.resolve(null),
          fetchAdminData("dashboard"),
          fetchAdminData("schemes"),
          fetchAdminData("showrooms"),
          fetchAdminData("notifications"),
          fetchAdminData("users")
        ]);

        if (!productsResponse.ok) throw new Error(`Products API returned ${productsResponse.status}`);
        if (!rateResponse.ok) throw new Error(`Rates API returned ${rateResponse.status}`);

        const productsData = await productsResponse.json() as { products: Product[] };
        const rateData = await rateResponse.json() as { rate: GoldRate };

        if (!cancelled) {
          if (Array.isArray(productsData.products)) {
            setProducts(productsData.products);
            localStorage.setItem("jj-products", JSON.stringify(productsData.products));
          }
          if (rateData.rate) {
            setRate(rateData.rate);
            localStorage.setItem("jj-rate", JSON.stringify(rateData.rate));
          }
          if (isAdmin) {
            applyOrPublishSharedItems("orders", "jj-orders", defaultOrders, ordersData, setOrders, setNotice, true);
          } else {
            setOrders(readJson("jj-local-orders", []));
          }
          applyOrPublishSharedItems("dashboard", "jj-analytics", defaultAnalytics, analyticsData, setAnalytics, setNotice, isAdmin);
          applyOrPublishSharedItems("schemes", "jj-schemes", defaultSchemes, schemesData, setSchemes, setNotice, isAdmin);
          applyOrPublishSharedItems("showrooms", "jj-showrooms", defaultShowrooms, showroomsData, setShowrooms, setNotice, isAdmin);
          applyOrPublishSharedItems("notifications", "jj-notifications", defaultNotifications, notificationsData, setNotifications, setNotice, isAdmin);
          applyOrPublishSharedItems("users", "jj-users", defaultUsers, usersData, setUsers, setNotice, isAdmin);
          setNotice("Shared admin data loaded from database.");
        }
      } catch {
        if (!cancelled) {
          setNotice("Using cached admin data. Backend may be waking up.");
        }
      }
    }

    void loadSharedData();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, rate.city]);

  const totals = useMemo(() => {
    const inventoryValue = products.reduce(
      (sum, product) => sum + calculateProductPrice(product, rate).total * product.stockQty,
      0
    );
    const cartTotal = cart.reduce((sum, line) => {
      const product = products.find((item) => item.id === line.productId);
      return product ? sum + calculateProductPrice(product, rate).total * line.qty : sum;
    }, 0);

    return {
      products: products.length,
      activeOrders: orders.filter((order) => order.status !== "Delivered").length,
      schemes: schemes.length,
      inventoryValue,
      cartTotal,
      cartCount: cart.reduce((sum, line) => sum + line.qty, 0)
    };
  }, [cart, orders, products, rate, schemes]);

  function persistProducts(next: Product[]) {
    if (!isAdmin) return;
    const previous = products;
    setProducts(next);
    localStorage.setItem("jj-products", JSON.stringify(next));
    void syncProductsToApi(previous, next, setNotice);
  }

  function persistRate(next: GoldRate) {
    if (!isAdmin) return;
    setRate(next);
    localStorage.setItem("jj-rate", JSON.stringify(next));
    void syncRateToApi(next, setNotice);
  }

  function persistCart(next: CartLine[]) {
    setCart(next);
    localStorage.setItem("jj-cart", JSON.stringify(next));
  }

  function persistOrders(next: Order[]) {
    setOrders(next);
    if (isAdmin) {
      localStorage.setItem("jj-orders", JSON.stringify(next));
      void syncAdminData("orders", next, setNotice);
    } else {
      localStorage.setItem("jj-local-orders", JSON.stringify(next));
    }
  }

  function persistGeneric(module: GenericModule, items: GenericItem[]) {
    if (!isAdmin) return;
    if (module === "dashboard") {
      setAnalytics(items as AnalyticsNote[]);
      localStorage.setItem("jj-analytics", JSON.stringify(items));
    }
    if (module === "schemes") {
      setSchemes(items as Scheme[]);
      localStorage.setItem("jj-schemes", JSON.stringify(items));
    }
    if (module === "showrooms") {
      setShowrooms(items as Showroom[]);
      localStorage.setItem("jj-showrooms", JSON.stringify(items));
    }
    if (module === "notifications") {
      setNotifications(items as NotificationItem[]);
      localStorage.setItem("jj-notifications", JSON.stringify(items));
    }
    if (module === "users") {
      setUsers(items as UserRecord[]);
      localStorage.setItem("jj-users", JSON.stringify(items));
    }
    void syncAdminData(module, items, setNotice);
  }

  function addToCart(productId: string) {
    const product = products.find((item) => item.id === productId);
    if (!product || product.stockQty <= 0) return;
    const existing = cart.find((line) => line.productId === productId);
    const nextCart = existing
      ? cart.map((line) => line.productId === productId ? { ...line, qty: line.qty + 1 } : line)
      : [...cart, { productId, qty: 1 }];
    persistCart(nextCart);
    setCartOpen(true);
    setNotice(`${product.name} added to cart.`);
  }

  function updateCart(productId: string, qty: number) {
    persistCart(cart.map((line) => line.productId === productId ? { ...line, qty } : line).filter((line) => line.qty > 0));
  }

  function handleCreateNew() {
    if (!isAdmin) {
      setNotice("Only admin can create records.");
      return;
    }
    if (active === "products") {
      setEditingProduct({ ...productTemplate, id: createProductId(products), hallmarkId: `HUID-JJ${Date.now().toString().slice(-6)}` });
      setNotice("Fill product details, including image, and save.");
      return;
    }
    if (active === "orders") {
      setPlacingOrder(createOrderDraft(products[0], rate));
      setNotice("Fill order details and place the order.");
      return;
    }
    if (active === "rates") {
      setNotice("Edit the rate fields and press Save rates.");
      return;
    }
    if (isGenericModule(active)) {
      setEditingGeneric({ module: active, item: createGenericDraft(active) });
      setNotice(`Create a new ${modules.find((module) => module.id === active)?.label} record.`);
    }
  }

  function saveGeneric(module: GenericModule, item: GenericItem) {
    if (!isAdmin) {
      setNotice("Only admin can edit records.");
      return;
    }
    const list = getGenericItems(module, { analytics, schemes, showrooms, notifications, users });
    const exists = list.some((entry) => entry.id === item.id);
    persistGeneric(module, exists ? list.map((entry) => entry.id === item.id ? item : entry) : [item, ...list]);
    setEditingGeneric(null);
    setNotice("Record saved successfully.");
  }

  function deleteGeneric(module: GenericModule, id: string) {
    if (!isAdmin) {
      setNotice("Only admin can delete records.");
      return;
    }
    const list = getGenericItems(module, { analytics, schemes, showrooms, notifications, users });
    persistGeneric(module, list.filter((entry) => entry.id !== id));
    setNotice("Record deleted.");
  }

  function placeOrder(order: Order) {
    if (!isAdmin) {
      setNotice("Only admin can place orders.");
      return;
    }
    const existingOrder = orders.some((item) => item.id === order.id);
    persistOrders(existingOrder ? orders.map((item) => item.id === order.id ? order : item) : [order, ...orders]);
    persistProducts(products.map((product) => (
      product.id === order.productId && !existingOrder
        ? { ...product, stockQty: Math.max(0, product.stockQty - order.qty) }
        : product
    )));
    setPlacingOrder(null);
    setActive("orders");
    setNotice(`Order ${order.id} saved to order database.`);
  }

  function placeCartOrder(customer = "Walk-in Customer", phone = "9999999999") {
    if (!cart.length) {
      setNotice("Cart is empty.");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const newOrders = cart.flatMap((line, index) => {
      const product = products.find((item) => item.id === line.productId);
      if (!product) return [];
      return [{
        id: `ORD-${Date.now().toString().slice(-6)}-${index + 1}`,
        customer: isAdmin ? customer : "My order",
        phone: isAdmin ? phone : "Local customer",
        productId: product.id,
        qty: line.qty,
        payment: isAdmin ? "UPI" : "Pending",
        status: "Placed",
        total: calculateProductPrice(product, rate).total * line.qty,
        date: today
      }];
    });
    if (!newOrders.length) {
      setNotice("No valid cart products found.");
      return;
    }
    persistOrders([...newOrders, ...orders]);
    if (isAdmin) {
      persistProducts(products.map((product) => {
        const orderedQty = cart
          .filter((line) => line.productId === product.id)
          .reduce((sum, line) => sum + line.qty, 0);
        return orderedQty ? { ...product, stockQty: Math.max(0, product.stockQty - orderedQty) } : product;
      }));
    }
    persistCart([]);
    setCartOpen(false);
    setActive("orders");
    setNotice(isAdmin
      ? `${newOrders.length} order record${newOrders.length > 1 ? "s" : ""} saved to order database.`
      : `${newOrders.length} local order${newOrders.length > 1 ? "s" : ""} saved on this device.`
    );
  }

  function downloadCsv() {
    const rows = [
      ["id", "name", "category", "subCategory", "purityKt", "netWeight", "makingChargePct", "stockQty", "hallmarkId"],
      ...products.map((product) => [
        product.id,
        product.name,
        product.category,
        product.subCategory,
        String(product.purityKt),
        String(product.netWeight),
        String(product.makingChargePct),
        String(product.stockQty),
        product.hallmarkId
      ])
    ];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "jain-jewellers-products.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function resetDemoData() {
    if (!isAdmin) {
      setNotice("Only admin can reset data.");
      return;
    }
    persistProducts(seedProducts);
    persistRate(currentDemoRate);
    persistCart([]);
    persistOrders(defaultOrders);
    persistGeneric("dashboard", defaultAnalytics);
    persistGeneric("schemes", defaultSchemes);
    persistGeneric("showrooms", defaultShowrooms);
    persistGeneric("notifications", defaultNotifications);
    persistGeneric("users", defaultUsers);
    setEditingProduct(null);
    setDetailProduct(null);
    setEditingGeneric(null);
    setPlacingOrder(null);
    setNotice("Demo data reset with corrected products, images and management records.");
  }

  if (!role) {
    return <LoginScreen onLogin={(nextRole) => {
      localStorage.setItem("jj-admin-role", nextRole);
      setOrders(nextRole === "admin" ? readJson("jj-orders", defaultOrders) : readJson("jj-local-orders", []));
      setRole(nextRole);
    }} />;
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-mark">JJ</div>
          <div>
            <strong>Jain Jewellers</strong>
            <small>Pure. Trusted. Timeless.</small>
          </div>
        </div>
        <nav className="nav" aria-label="Admin modules">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                className={active === module.id ? "active" : ""}
                onClick={() => {
                  setActive(module.id);
                  setEditingGeneric(null);
                  setEditingProduct(null);
                  setPlacingOrder(null);
                }}
                type="button"
              >
                <Icon size={18} />
                {module.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="main">
        <div className="topline">
          <div>
            <p className="eyebrow">Admin panel</p>
            <h1>{modules.find((module) => module.id === active)?.label}</h1>
            <p className="subtext">{isAdmin ? "Admin access: create, edit and delete enabled." : "Viewer access: read-only mode."}</p>
          </div>
          <div className="toolbar">
            <button className="button ghost" onClick={downloadCsv} type="button"><Download size={16} /> CSV</button>
            <button className="button" disabled={!isAdmin} onClick={handleCreateNew} type="button">Create new</button>
            <button className="button ghost" disabled={!isAdmin} onClick={resetDemoData} type="button">Reset data</button>
            <button className="button ghost" onClick={() => setCartOpen(true)} type="button">
              <ShoppingBag size={16} /> Cart {totals.cartCount}
            </button>
            <button className="button ghost" onClick={() => {
              localStorage.removeItem("jj-admin-role");
              setOrders([]);
              setRole(null);
            }} type="button">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        <div className="notice" role="status">{notice}</div>

        {active === "dashboard" ? (
          <Dashboard analytics={analytics} deleteGeneric={deleteGeneric} editGeneric={(item) => setEditingGeneric({ module: "dashboard", item })} isAdmin={isAdmin} rate={rate} totals={totals} />
        ) : null}
        {active === "products" ? (
          <Products
            addToCart={addToCart}
            editingProduct={editingProduct}
            products={products}
            rate={rate}
            setDetailProduct={setDetailProduct}
            setEditingProduct={setEditingProduct}
            setNotice={setNotice}
            setActive={setActive}
            setPlacingOrder={setPlacingOrder}
            setProducts={persistProducts}
            isAdmin={isAdmin}
          />
        ) : null}
        {active === "orders" ? (
          <Orders
            onSaveOrder={placeOrder}
            orders={orders}
            placingOrder={placingOrder}
            products={products}
            rate={rate}
            setOrders={persistOrders}
            setPlacingOrder={setPlacingOrder}
            setNotice={setNotice}
            isAdmin={isAdmin}
          />
        ) : null}
        {active === "rates" ? <Rates isAdmin={isAdmin} products={products} rate={rate} setNotice={setNotice} setRate={persistRate} /> : null}
        {active === "schemes" ? <GenericManager isAdmin={isAdmin} module="schemes" items={schemes} editItem={(item) => setEditingGeneric({ module: "schemes", item })} deleteItem={deleteGeneric} /> : null}
        {active === "showrooms" ? <GenericManager isAdmin={isAdmin} module="showrooms" items={showrooms} editItem={(item) => setEditingGeneric({ module: "showrooms", item })} deleteItem={deleteGeneric} /> : null}
        {active === "notifications" ? <GenericManager isAdmin={isAdmin} module="notifications" items={notifications} editItem={(item) => setEditingGeneric({ module: "notifications", item })} deleteItem={deleteGeneric} /> : null}
        {active === "users" ? <GenericManager isAdmin={isAdmin} module="users" items={users} editItem={(item) => setEditingGeneric({ module: "users", item })} deleteItem={deleteGeneric} /> : null}

        {editingGeneric ? (
          <GenericForm
            item={editingGeneric.item}
            module={editingGeneric.module}
            onCancel={() => setEditingGeneric(null)}
            onSave={(item) => saveGeneric(editingGeneric.module, item)}
          />
        ) : null}
      </main>

      <CartDrawer
        cart={cart}
        cartOpen={cartOpen}
        isAdmin={isAdmin}
        placeCartOrder={placeCartOrder}
        products={products}
        rate={rate}
        setCartOpen={setCartOpen}
        totals={totals}
        updateCart={updateCart}
      />

      {detailProduct ? (
        <ProductDetail product={detailProduct} rate={rate} onClose={() => setDetailProduct(null)} onEdit={() => {
          setEditingProduct(detailProduct);
          setDetailProduct(null);
        }} />
      ) : null}
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: (role: Role) => void }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const normalizedPhone = phone.replace(/\D/g, "");
    if (normalizedPhone === ADMIN_MOBILE && password === ADMIN_PASSWORD) {
      onLogin("admin");
      return;
    }
    if (normalizedPhone.length >= 10 && password.trim().length >= 4) {
      onLogin("viewer");
      return;
    }
    setError("Enter a 10 digit mobile number and at least 4 character password.");
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="login-mark">JJ</div>
        <p className="eyebrow">Pure. Trusted. Timeless.</p>
        <h1>Jain Jewellers Admin Login</h1>
        <p className="login-copy">Admin can manage records. Any other account can log in as read-only viewer.</p>
        <label>Mobile number
          <input inputMode="tel" onChange={(event) => setPhone(event.target.value)} placeholder={ADMIN_MOBILE} value={phone} />
        </label>
        <label>Password
          <input onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" type="password" value={password} />
        </label>
        <p className="subtext">Admin: {ADMIN_MOBILE} / {ADMIN_PASSWORD}. Any other valid mobile/password opens read-only mode.</p>
        {error ? <div className="error">{error}</div> : null}
        <button className="button" type="submit">Login</button>
      </form>
    </main>
  );
}

function Dashboard({
  analytics,
  deleteGeneric,
  editGeneric,
  isAdmin,
  rate,
  totals
}: {
  analytics: AnalyticsNote[];
  deleteGeneric: (module: GenericModule, id: string) => void;
  editGeneric: (item: AnalyticsNote) => void;
  isAdmin: boolean;
  rate: GoldRate;
  totals: { products: number; activeOrders: number; schemes: number; inventoryValue: number };
}) {
  return (
    <>
      <section className="grid" aria-label="Analytics summary">
        <Metric label="Products" value={String(totals.products)} />
        <Metric label="Active orders" value={String(totals.activeOrders)} />
        <Metric label="Saving schemes" value={String(totals.schemes)} />
        <Metric label="Inventory value" value={formatINR(totals.inventoryValue)} />
      </section>
      <section className="panel">
        <div className="panel-header">
          <h2>Today rate board</h2>
          <span className="status-pill">{rate.city} - {rate.date}</span>
        </div>
        <div className="form-grid">
          <Metric label="22K Gold" value={`${formatINR(rate.rate22k)} / g`} />
          <Metric label="24K Gold" value={`${formatINR(rate.rate24k)} / g`} />
          <Metric label="20K Gold" value={`${formatINR(rate.rate20k)} / g`} />
          <Metric label="18K Gold" value={`${formatINR(rate.rate18k)} / g`} />
          <Metric label="Silver" value={`${formatINR(rate.silverRate)} / g`} />
        </div>
      </section>
      <GenericManager isAdmin={isAdmin} module="dashboard" items={analytics} editItem={editGeneric} deleteItem={deleteGeneric} />
    </>
  );
}

function Products({
  addToCart,
  editingProduct,
  products,
  rate,
  setDetailProduct,
  setEditingProduct,
  setNotice,
  setActive,
  setPlacingOrder,
  setProducts,
  isAdmin
}: {
  addToCart: (productId: string) => void;
  editingProduct: Product | null;
  isAdmin: boolean;
  products: Product[];
  rate: GoldRate;
  setDetailProduct: (product: Product) => void;
  setEditingProduct: (product: Product | null) => void;
  setNotice: (notice: string) => void;
  setActive: (module: ModuleId) => void;
  setPlacingOrder: (order: Order) => void;
  setProducts: (products: Product[]) => void;
}) {
  const [query, setQuery] = useState("");
  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.category} ${product.subCategory} ${product.collectionName}`.toLowerCase().includes(query.toLowerCase())
  );

  function deleteProduct(productId: string) {
    if (!isAdmin) {
      setNotice("Only admin can delete products.");
      return;
    }
    const product = products.find((item) => item.id === productId);
    setProducts(products.filter((item) => item.id !== productId));
    setNotice(`${product?.name || "Product"} deleted.`);
  }

  return (
    <>
      {editingProduct ? (
        <ProductForm
          onCancel={() => setEditingProduct(null)}
          onSave={(product) => {
            if (!isAdmin) {
              setNotice("Only admin can edit products.");
              return;
            }
            const exists = products.some((item) => item.id === product.id);
            setProducts(exists ? products.map((item) => item.id === product.id ? product : item) : [product, ...products]);
            setEditingProduct(null);
            setNotice(`${product.name} saved successfully.`);
          }}
          product={editingProduct}
        />
      ) : null}

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Product management</h2>
            <p className="subtext">Click a product name/image to see details, reviews and price breakup.</p>
          </div>
          <input className="search" onChange={(event) => setQuery(event.target.value)} placeholder="Search products" value={query} />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Purity</th>
                <th>Weight</th>
                <th>Making</th>
                <th>Stock</th>
                <th>Live price</th>
                <th>Hallmark</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const price = calculateProductPrice(product, rate);
                return (
                  <tr key={product.id}>
                    <td>
                      <button className="product-cell product-link" onClick={() => setDetailProduct(product)} type="button">
                        <img className="product-thumb" src={getProductImage(product)} alt={product.name} />
                        <span>
                          <strong>{product.name}</strong><br />
                          <em>{product.collectionName}</em>
                        </span>
                      </button>
                    </td>
                    <td>{product.category} / {product.subCategory}</td>
                    <td>{product.purityKt}K</td>
                    <td>{product.netWeight}g</td>
                    <td>{product.makingChargePct}%</td>
                    <td>{product.stockQty}</td>
                    <td>{formatINR(price.total)}</td>
                    <td>{product.hallmarkId}</td>
                    <td>
                      <div className="row-actions">
                        <button className="small-button" onClick={() => addToCart(product.id)} type="button">Cart</button>
                        <button className="small-button" onClick={() => {
                          setPlacingOrder(createOrderDraft(product, rate));
                          setActive("orders");
                        }} type="button">Order</button>
                        <button className="small-button" disabled={!isAdmin} onClick={() => setEditingProduct(product)} type="button">Edit</button>
                        {isAdmin ? (
                          <button className="small-button danger" onClick={() => deleteProduct(product.id)} type="button"><Trash2 size={14} /></button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function ProductForm({ onCancel, onSave, product }: { onCancel: () => void; onSave: (product: Product) => void; product: Product }) {
  const [draft, setDraft] = useState<Product>(product);

  function setField<K extends keyof Product>(key: K, value: Product[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = String(reader.result);
      setDraft((current) => ({ ...current, images: [image, ...current.images.filter((item) => item !== image)] }));
    };
    reader.readAsDataURL(file);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    onSave({
      ...draft,
      metal: draft.category === "Silver" ? "silver" : draft.category === "Platinum" ? "platinum" : draft.category === "Gemstone" ? "gemstone" : draft.category === "Diamond" ? "diamond" : "gold",
      images: draft.images.length ? draft.images : [`/images/products/${draft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.jpg`],
      createdAt: draft.createdAt || new Date().toISOString()
    });
  }

  return (
    <form className="panel form-panel" onSubmit={submit}>
      <div className="panel-header">
        <h2>{product.name ? "Product details" : "New product"}</h2>
        <div className="toolbar">
          <button className="button ghost" onClick={onCancel} type="button">Cancel</button>
          <button className="button" type="submit">Save product</button>
        </div>
      </div>
      <div className="product-editor">
        <div className="image-uploader">
          <img className="image-preview" src={getProductImage(draft)} alt={`${draft.name || "Product"} preview`} />
          <label>Product image
            <input accept="image/*" onChange={handleImageUpload} type="file" />
          </label>
          <button className="small-button" onClick={() => setField("images", [])} type="button">Use generated image</button>
        </div>
        <div className="form-grid no-pad">
          <label>Name
            <input onChange={(event) => setField("name", event.target.value)} required value={draft.name} />
          </label>
          <label>Category
          <select onChange={(event) => {
            const category = event.target.value as Product["category"];
            setDraft((current) => ({
              ...current,
              category,
              metal: category === "Silver" ? "silver" : category === "Platinum" ? "platinum" : category === "Gemstone" ? "gemstone" : category === "Diamond" ? "diamond" : "gold",
              purityKt: category === "Silver" ? 925 : category === "Platinum" ? 950 : category === "Diamond" || category === "Gemstone" ? 18 : current.purityKt === 925 || current.purityKt === 950 ? 22 : current.purityKt
            }));
          }} value={draft.category}>
              {["Gold", "Diamond", "Silver", "Platinum", "Gemstone", "Coins & Bars"].map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <label>Sub-category
            <select onChange={(event) => setField("subCategory", event.target.value as Product["subCategory"])} value={draft.subCategory}>
              {["Necklaces", "Rings", "Earrings", "Bangles", "Pendants", "Chains", "Nose Pins", "Anklets", "Bracelets", "Mangalsutra", "Men's Jewellery", "Kids' Collection"].map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <label>Quality / Purity
            <select onChange={(event) => setField("purityKt", Number(event.target.value) as Product["purityKt"])} value={draft.purityKt}>
              {[18, 20, 22, 24, 925, 950].map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>Gross weight
            <input min="0.01" onChange={(event) => setField("grossWeight", Number(event.target.value))} required step="0.01" type="number" value={draft.grossWeight} />
          </label>
          <label>Net weight
            <input min="0.01" onChange={(event) => setField("netWeight", Number(event.target.value))} required step="0.01" type="number" value={draft.netWeight} />
          </label>
          <label>Making %
            <input min="0" onChange={(event) => setField("makingChargePct", Number(event.target.value))} required step="0.1" type="number" value={draft.makingChargePct} />
          </label>
          <label>Labour
            <input min="0" onChange={(event) => setField("labourCharge", Number(event.target.value))} required step="1" type="number" value={draft.labourCharge ?? 0} />
          </label>
          <label>Stock
            <input min="0" onChange={(event) => setField("stockQty", Number(event.target.value))} required step="1" type="number" value={draft.stockQty} />
          </label>
          <label>Hallmark HUID
            <input onChange={(event) => setField("hallmarkId", event.target.value)} required value={draft.hallmarkId} />
          </label>
          <label>Collection
            <input onChange={(event) => setField("collectionName", event.target.value)} required value={draft.collectionName} />
          </label>
          <label>Occasion
            <select onChange={(event) => setField("occasion", event.target.value as Product["occasion"])} value={draft.occasion}>
              {["Wedding", "Daily wear", "Festive", "Office", "Gifting"].map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <label className="wide">Description
            <input onChange={(event) => setField("description", event.target.value)} required value={draft.description} />
          </label>
        </div>
      </div>
    </form>
  );
}

function ProductDetail({ onClose, onEdit, product, rate }: { onClose: () => void; onEdit: () => void; product: Product; rate: GoldRate }) {
  const price = calculateProductPrice(product, rate);
  const reviews = [
    { name: "Neha", text: "Finish is premium and the HUID details gave confidence.", rating: 5 },
    { name: "Rohan", text: "Good weight and transparent price breakup.", rating: 4 },
    { name: "Kavita", text: "Perfect for gifting, packaging felt elegant.", rating: 5 }
  ];

  return (
    <>
      <div className="scrim open" onClick={onClose} />
      <aside className="detail-drawer">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Product detail</p>
            <h2>{product.name}</h2>
          </div>
          <div className="toolbar">
            <button className="button ghost" onClick={onEdit} type="button">Edit</button>
            <button className="button ghost" onClick={onClose} type="button">Close</button>
          </div>
        </div>
        <div className="detail-body">
          <img className="detail-image" src={getProductImage(product)} alt={product.name} />
          <div className="detail-grid">
            <Metric label="Live price" value={formatINR(price.total)} />
            <Metric label="Metal value" value={formatINR(price.metalValue)} />
            <Metric label="Making" value={formatINR(price.makingCharges)} />
            <Metric label="GST 3%" value={formatINR(price.gst)} />
          </div>
          <div className="detail-section">
            <h3>Information</h3>
            <p>{product.description}</p>
            <p><strong>Metal:</strong> {product.category} | <strong>Purity:</strong> {product.purityKt}K | <strong>Gross:</strong> {product.grossWeight}g | <strong>Net:</strong> {product.netWeight}g</p>
            <p><strong>Hallmark:</strong> {product.hallmarkId} | <strong>Collection:</strong> {product.collectionName} | <strong>Stone:</strong> {product.stoneDetails}</p>
          </div>
          <div className="detail-section">
            <h3>Reviews</h3>
            {reviews.map((review) => (
              <div className="review" key={review.name}>
                <strong>{review.name} - {"★".repeat(review.rating)}</strong>
                <p>{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

function Orders({
  onSaveOrder,
  orders,
  placingOrder,
  products,
  rate,
  isAdmin,
  setNotice,
  setOrders,
  setPlacingOrder
}: {
  onSaveOrder: (order: Order) => void;
  orders: Order[];
  placingOrder: Order | null;
  products: Product[];
  rate: GoldRate;
  isAdmin: boolean;
  setNotice: (notice: string) => void;
  setOrders: (orders: Order[]) => void;
  setPlacingOrder: (order: Order | null) => void;
}) {
  function saveOrder(order: Order) {
    if (!isAdmin) {
      setNotice("Only admin can create or edit orders.");
      return;
    }
    onSaveOrder(order);
  }

  return (
    <>
      {placingOrder ? <OrderForm order={placingOrder} products={products} rate={rate} onCancel={() => setPlacingOrder(null)} onSave={saveOrder} /> : null}
      <section className="panel">
        <div className="panel-header">
          <h2>Order management</h2>
          <p className="subtext">Place, edit and update order status.</p>
        </div>
        <SimpleTable
          columns={["Order", "Customer", "Product", "Qty", "Payment", "Status", "Total", "Actions"]}
          rows={orders.map((order) => {
            const product = products.find((item) => item.id === order.productId);
            return [
              order.id,
              `${order.customer} (${order.phone})`,
              product?.name || order.productId,
              String(order.qty),
              order.payment,
              order.status,
              formatINR(order.total),
              <div className="row-actions" key={order.id}>
                <button className="small-button" disabled={!isAdmin} onClick={() => setPlacingOrder(order)} type="button">Edit</button>
                {isAdmin ? (
                  <button className="small-button danger" onClick={() => setOrders(orders.filter((item) => item.id !== order.id))} type="button">Delete</button>
                ) : null}
              </div>
            ];
          })}
        />
      </section>
    </>
  );
}

function OrderForm({ onCancel, onSave, order, products, rate }: { onCancel: () => void; onSave: (order: Order) => void; order: Order; products: Product[]; rate: GoldRate }) {
  const [draft, setDraft] = useState(order);

  function updateProduct(productId: string) {
    const product = products.find((item) => item.id === productId);
    setDraft({ ...draft, productId, total: product ? calculateProductPrice(product, rate).total * draft.qty : draft.total });
  }

  function updateQty(qty: number) {
    const product = products.find((item) => item.id === draft.productId);
    setDraft({ ...draft, qty, total: product ? calculateProductPrice(product, rate).total * qty : draft.total });
  }

  return (
    <form className="panel" onSubmit={(event) => {
      event.preventDefault();
      onSave(draft);
    }}>
      <div className="panel-header">
        <h2>Place order</h2>
        <div className="toolbar">
          <button className="button ghost" onClick={onCancel} type="button">Cancel</button>
          <button className="button" type="submit">Place order</button>
        </div>
      </div>
      <div className="form-grid">
        <label>Customer
          <input onChange={(event) => setDraft({ ...draft, customer: event.target.value })} required value={draft.customer} />
        </label>
        <label>Phone
          <input onChange={(event) => setDraft({ ...draft, phone: event.target.value })} required value={draft.phone} />
        </label>
        <label>Product
          <select onChange={(event) => updateProduct(event.target.value)} value={draft.productId}>
            {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
          </select>
        </label>
        <label>Quantity
          <input min="1" onChange={(event) => updateQty(Number(event.target.value))} type="number" value={draft.qty} />
        </label>
        <label>Payment
          <select onChange={(event) => setDraft({ ...draft, payment: event.target.value })} value={draft.payment}>
            {["UPI", "Card", "Net Banking", "Cash", "COD"].map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label>Status
          <select onChange={(event) => setDraft({ ...draft, status: event.target.value })} value={draft.status}>
            {["Placed", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"].map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label>Date
          <input onChange={(event) => setDraft({ ...draft, date: event.target.value })} type="date" value={draft.date} />
        </label>
        <Metric label="Order total" value={formatINR(draft.total)} />
      </div>
    </form>
  );
}

function Rates({
  isAdmin,
  products,
  rate,
  setNotice,
  setRate
}: {
  isAdmin: boolean;
  products: Product[];
  rate: GoldRate;
  setNotice: (notice: string) => void;
  setRate: (rate: GoldRate) => void;
}) {
  const [draft, setDraft] = useState(rate);
  const silverProducts = products.filter((product) => product.metal === "silver" || product.category === "Silver");

  useEffect(() => {
    setDraft(rate);
  }, [rate]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!isAdmin) {
      setNotice("Only admin can edit rates.");
      return;
    }
    setRate(draft);
    setNotice("Daily rates saved. Product prices recalculated instantly.");
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Gold and silver rate management</h2>
          <p className="subtext">Silver products use the silver rate per gram instantly, just like gold products use 18K, 22K or 24K rates.</p>
        </div>
        <button className="button ghost" onClick={() => setNotice("API sync placeholder: connect GoldAPI or MCX feed key in services/api/.env.")} type="button">Sync bullion API</button>
      </div>
      <form className="form-grid" onSubmit={submit}>
        <label>City
          <input onChange={(event) => setDraft({ ...draft, city: event.target.value })} value={draft.city} />
        </label>
        <label>Date
          <input onChange={(event) => setDraft({ ...draft, date: event.target.value })} type="date" value={draft.date} />
        </label>
        <label>22K rate
          <input onChange={(event) => setDraft({ ...draft, rate22k: Number(event.target.value) })} type="number" value={draft.rate22k} />
        </label>
        <label>24K rate
          <input onChange={(event) => setDraft({ ...draft, rate24k: Number(event.target.value) })} type="number" value={draft.rate24k} />
        </label>
        <label>20K rate
          <input onChange={(event) => setDraft({ ...draft, rate20k: Number(event.target.value) })} type="number" value={draft.rate20k} />
        </label>
        <label>18K rate
          <input onChange={(event) => setDraft({ ...draft, rate18k: Number(event.target.value) })} type="number" value={draft.rate18k} />
        </label>
        <label>Silver rate
          <input onChange={(event) => setDraft({ ...draft, silverRate: Number(event.target.value) })} type="number" value={draft.silverRate} />
        </label>
        <div className="form-actions">
          <button className="button" disabled={!isAdmin} type="submit">Save rates</button>
        </div>
      </form>
      <div className="rate-preview">
        <Metric label="Silver rate per gram" value={`${formatINR(draft.silverRate)} / g`} />
        <Metric label="Silver products" value={String(silverProducts.length)} />
        <Metric
          label="Silver inventory value"
          value={formatINR(silverProducts.reduce((sum, product) => sum + calculateProductPrice(product, draft).total * product.stockQty, 0))}
        />
      </div>
      <SimpleTable
        columns={["Silver product", "Purity", "Net weight", "Making", "Live price"]}
        rows={silverProducts.map((product) => {
          const price = calculateProductPrice(product, draft);
          return [
            product.name,
            String(product.purityKt),
            `${product.netWeight}g`,
            `${product.makingChargePct}%`,
            formatINR(price.total)
          ];
        })}
      />
    </section>
  );
}

function GenericManager({
  deleteItem,
  editItem,
  isAdmin,
  items,
  module
}: {
  deleteItem: (module: GenericModule, id: string) => void;
  editItem: (item: never) => void;
  isAdmin: boolean;
  items: GenericItem[];
  module: GenericModule;
}) {
  const columns = getGenericColumns(module);
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>{genericTitle(module)}</h2>
        <p className="subtext">Create new, edit and delete records from this module.</p>
      </div>
      <SimpleTable
        columns={[...columns.map((column) => column.label), "Actions"]}
        rows={items.map((item) => [
          ...columns.map((column) => String(item[column.key as keyof GenericItem] ?? "")),
          <div className="row-actions" key={item.id}>
            <button className="small-button" disabled={!isAdmin} onClick={() => editItem(item as never)} type="button">Edit</button>
            {isAdmin ? (
              <button className="small-button danger" onClick={() => deleteItem(module, item.id)} type="button">Delete</button>
            ) : null}
          </div>
        ])}
      />
    </section>
  );
}

function GenericForm({ item, module, onCancel, onSave }: { item: GenericItem; module: GenericModule; onCancel: () => void; onSave: (item: GenericItem) => void }) {
  const [draft, setDraft] = useState<GenericItem>(item);
  const fields = getGenericColumns(module);

  return (
    <form className="panel" onSubmit={(event) => {
      event.preventDefault();
      onSave(draft);
    }}>
      <div className="panel-header">
        <h2>{draft.id ? "Edit" : "Create"} {genericTitle(module)}</h2>
        <div className="toolbar">
          <button className="button ghost" onClick={onCancel} type="button">Cancel</button>
          <button className="button" type="submit">Save</button>
        </div>
      </div>
      <div className="form-grid">
        {fields.map((field) => (
          <label key={field.key}>{field.label}
            <input
              onChange={(event) => setDraft({ ...draft, [field.key]: field.type === "number" ? Number(event.target.value) : event.target.value })}
              type={field.type || "text"}
              value={String(draft[field.key as keyof GenericItem] ?? "")}
            />
          </label>
        ))}
      </div>
    </form>
  );
}

function CartDrawer({
  cart,
  cartOpen,
  isAdmin,
  placeCartOrder,
  products,
  rate,
  setCartOpen,
  totals,
  updateCart
}: {
  cart: CartLine[];
  cartOpen: boolean;
  isAdmin: boolean;
  placeCartOrder: () => void;
  products: Product[];
  rate: GoldRate;
  setCartOpen: (open: boolean) => void;
  totals: { cartTotal: number };
  updateCart: (productId: string, qty: number) => void;
}) {
  return (
    <>
      <div className={`scrim ${cartOpen ? "open" : ""}`} onClick={() => setCartOpen(false)} />
      <aside className={`cart-drawer ${cartOpen ? "open" : ""}`}>
        <div className="panel-header">
          <div>
            <p className="eyebrow">Customer cart</p>
            <h2>Add to cart</h2>
          </div>
          <button className="button ghost" onClick={() => setCartOpen(false)} type="button">Close</button>
        </div>
        <div className="cart-body">
          {cart.length === 0 ? <p className="subtext">No products added yet.</p> : null}
          {cart.map((line) => {
            const product = products.find((item) => item.id === line.productId);
            if (!product) return null;
            const price = calculateProductPrice(product, rate);
            return (
              <div className="cart-line" key={line.productId}>
                <div>
                  <strong>{product.name}</strong>
                  <p>{formatINR(price.total)} each</p>
                  <div className="qty">
                    <button onClick={() => updateCart(product.id, line.qty - 1)} type="button">-</button>
                    <span>{line.qty}</span>
                    <button onClick={() => updateCart(product.id, line.qty + 1)} type="button">+</button>
                  </div>
                </div>
                <strong>{formatINR(price.total * line.qty)}</strong>
              </div>
            );
          })}
        </div>
        <div className="cart-footer">
          <span>Total</span>
          <strong>{formatINR(totals.cartTotal)}</strong>
          <button className="button" disabled={cart.length === 0 || !isAdmin} onClick={placeCartOrder} type="button">
            {isAdmin ? "Place order" : "Admin only"}
          </button>
        </div>
      </aside>
    </>
  );
}

function SimpleTable({ columns, rows }: { columns: string[]; rows: Array<Array<string | JSX.Element>> }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length}>No records yet. Use Create new.</td></tr>
          ) : rows.map((row, index) => (
            <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <div className="card-label">{label}</div>
      <div className="card-value">{value}</div>
    </div>
  );
}

function createOrderDraft(product: Product | undefined, rate: GoldRate): Order {
  return {
    id: `ORD-${Date.now().toString().slice(-6)}`,
    customer: "Walk-in Customer",
    phone: "9999999999",
    productId: product?.id || "",
    qty: 1,
    payment: "UPI",
    status: "Placed",
    total: product ? calculateProductPrice(product, rate).total : 0,
    date: new Date().toISOString().slice(0, 10)
  };
}

function createProductId(products: Product[]) {
  return `JJ-NEW-${String(products.length + 1).padStart(3, "0")}`;
}

function isGenericModule(module: ModuleId): module is GenericModule {
  return ["dashboard", "schemes", "showrooms", "notifications", "users"].includes(module);
}

function createGenericDraft(module: GenericModule): GenericItem {
  const suffix = Date.now().toString().slice(-6);
  if (module === "dashboard") return { id: `ANL-${suffix}`, title: "New metric", metric: "Sales", value: "₹0", owner: "Admin" };
  if (module === "schemes") return { id: `SCH-${suffix}`, customer: "New Customer", plan: "Golden Bloom", monthlyAmount: 10000, paid: 0, maturityDate: "2026-12-31", status: "Active" };
  if (module === "showrooms") return { id: `SHR-${suffix}`, name: "New Showroom", city: "Mumbai", address: "", phone: "", hours: "10:30 AM - 8:30 PM", services: "Sales, Repair" };
  if (module === "notifications") return { id: `NTF-${suffix}`, title: "New notification", audience: "All customers", channel: "Push", schedule: "Today", status: "Draft" };
  return { id: `USR-${suffix}`, name: "New User", phone: "", city: "Mumbai", tier: "Silver", points: 0 };
}

function getGenericItems(module: GenericModule, data: { analytics: AnalyticsNote[]; schemes: Scheme[]; showrooms: Showroom[]; notifications: NotificationItem[]; users: UserRecord[] }): GenericItem[] {
  if (module === "dashboard") return data.analytics;
  if (module === "schemes") return data.schemes;
  if (module === "showrooms") return data.showrooms;
  if (module === "notifications") return data.notifications;
  return data.users;
}

function getGenericColumns(module: GenericModule): Array<{ key: string; label: string; type?: string }> {
  if (module === "dashboard") return [
    { key: "title", label: "Title" },
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "owner", label: "Owner" }
  ];
  if (module === "schemes") return [
    { key: "customer", label: "Customer" },
    { key: "plan", label: "Plan" },
    { key: "monthlyAmount", label: "Monthly Amount", type: "number" },
    { key: "paid", label: "Paid", type: "number" },
    { key: "maturityDate", label: "Maturity Date", type: "date" },
    { key: "status", label: "Status" }
  ];
  if (module === "showrooms") return [
    { key: "name", label: "Name" },
    { key: "city", label: "City" },
    { key: "address", label: "Address" },
    { key: "phone", label: "Phone" },
    { key: "hours", label: "Hours" },
    { key: "services", label: "Services" }
  ];
  if (module === "notifications") return [
    { key: "title", label: "Title" },
    { key: "audience", label: "Audience" },
    { key: "channel", label: "Channel" },
    { key: "schedule", label: "Schedule" },
    { key: "status", label: "Status" }
  ];
  return [
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "city", label: "City" },
    { key: "tier", label: "Tier" },
    { key: "points", label: "Points", type: "number" }
  ];
}

function genericTitle(module: GenericModule) {
  return modules.find((item) => item.id === module)?.label || module;
}

async function fetchAdminData(module: GenericModule | "orders") {
  const response = await fetch(`${API_BASE_URL}/admin-data/${module}`);
  if (!response.ok) throw new Error(`${module} API returned ${response.status}`);
  const data = await response.json() as { items: unknown[] | null };
  return data.items;
}

function applySharedItems<T>(storageKey: string, items: unknown[] | null, setItems: (items: T[]) => void) {
  if (!Array.isArray(items)) return;
  const typedItems = items as T[];
  setItems(typedItems);
  localStorage.setItem(storageKey, JSON.stringify(typedItems));
}

function applyOrPublishSharedItems<T extends GenericItem | Order>(
  module: GenericModule | "orders",
  storageKey: string,
  fallback: T[],
  cloudItems: unknown[] | null,
  setItems: (items: T[]) => void,
  setNotice: (notice: string) => void,
  shouldPublish: boolean
) {
  if (Array.isArray(cloudItems) && cloudItems.length > 0) {
    applySharedItems(storageKey, cloudItems, setItems);
    return;
  }

  const localItems = readJson<T[]>(storageKey, fallback);
  setItems(localItems);
  localStorage.setItem(storageKey, JSON.stringify(localItems));

  if (shouldPublish && localItems.length) {
    void syncAdminData(module, localItems as GenericItem[] | Order[], setNotice);
  }
}

async function syncProductsToApi(previous: Product[], next: Product[], setNotice: (notice: string) => void) {
  try {
    const nextIds = new Set(next.map((product) => product.id));
    const previousById = new Map(previous.map((product) => [product.id, JSON.stringify(product)]));
    const changedProducts = next.filter((product) => previousById.get(product.id) !== JSON.stringify(product));
    const removedProducts = previous.filter((product) => !nextIds.has(product.id));

    await Promise.all([
      ...changedProducts.map((product) => fetch(`${API_BASE_URL}/products/${encodeURIComponent(product.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
      }).then((response) => {
        if (!response.ok) throw new Error(`Save failed for ${product.id}`);
      })),
      ...removedProducts.map((product) => fetch(`${API_BASE_URL}/products/${encodeURIComponent(product.id)}`, {
        method: "DELETE"
      }).then((response) => {
        if (!response.ok && response.status !== 404) throw new Error(`Delete failed for ${product.id}`);
      }))
    ]);

    setNotice("Products saved to shared database.");
  } catch {
    setNotice("Product changed locally, but database sync failed. Check Render API and redeploy if needed.");
  }
}

async function syncRateToApi(rate: GoldRate, setNotice: (notice: string) => void) {
  try {
    const response = await fetch(`${API_BASE_URL}/gold-rates/override`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rate)
    });
    if (!response.ok) throw new Error(`Rates API returned ${response.status}`);
    setNotice("Daily gold and silver rates saved to shared database.");
  } catch {
    setNotice("Rates changed locally, but database sync failed. Check Vercel API URL and Render.");
  }
}

async function syncAdminData(module: GenericModule | "orders", items: GenericItem[] | Order[], setNotice: (notice: string) => void) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin-data/${module}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    });
    if (!response.ok) throw new Error(`${module} API returned ${response.status}`);
    setNotice(`${module === "orders" ? "Orders" : genericTitle(module)} data saved to shared database.`);
  } catch {
    setNotice("Record changed locally, but database sync failed. Check Vercel API URL and Render.");
  }
}

function getProductImage(product: Product) {
  const customImage = product.images.find((image) => image.startsWith("data:image"));
  return customImage || productImage(product);
}

function productImage(product: Product) {
  if (typeof document === "undefined") return "";

  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 240;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const isSilver = product.category === "Silver" || product.metal === "silver";
  const isPlatinum = product.category === "Platinum" || product.metal === "platinum";
  const base = isSilver ? "#DDE2E7" : isPlatinum ? "#C9D0D8" : "#D8A43A";
  const dark = isSilver ? "#818A94" : isPlatinum ? "#6E7782" : "#8E5D18";
  const accent = product.category === "Diamond" ? "#F8FBFF" : product.category === "Gemstone" ? "#0C7A5B" : "#6B0F1A";

  const background = ctx.createLinearGradient(0, 0, 320, 240);
  background.addColorStop(0, "#FFF8F0");
  background.addColorStop(1, isSilver || isPlatinum ? "#EEF2F5" : "#F7E1AA");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 320, 240);

  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.beginPath();
  ctx.arc(262, 42, 48, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(46, 206, 62, 0, Math.PI * 2);
  ctx.fill();

  if (product.subCategory === "Rings" || product.subCategory === "Men's Jewellery") {
    ctx.strokeStyle = base;
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.ellipse(160, 138, 60, 46, 0, 0, Math.PI * 2);
    ctx.stroke();
    drawGem(ctx, 160, 74, accent);
  } else if (product.subCategory === "Necklaces" || product.subCategory === "Mangalsutra") {
    ctx.strokeStyle = base;
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.arc(160, 54, 96, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
    for (let i = 0; i < 7; i += 1) {
      drawBead(ctx, 82 + i * 26, 130 + Math.abs(3 - i) * 7, base, dark);
    }
    drawGem(ctx, 160, 165, accent);
  } else if (product.subCategory === "Earrings") {
    drawEarring(ctx, 116, 100, base, dark, accent);
    drawEarring(ctx, 204, 100, base, dark, accent);
  } else if (product.subCategory === "Bangles" || product.subCategory === "Bracelets") {
    ctx.strokeStyle = base;
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.ellipse(160, 124, 92, 50, -0.18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = dark;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(160, 124, 66, 35, -0.18, 0, Math.PI * 2);
    ctx.stroke();
  } else if (product.category === "Coins & Bars") {
    const coin = ctx.createRadialGradient(142, 96, 8, 160, 116, 70);
    coin.addColorStop(0, "#FFF4B8");
    coin.addColorStop(0.55, base);
    coin.addColorStop(1, dark);
    ctx.fillStyle = coin;
    ctx.beginPath();
    ctx.arc(160, 116, 62, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(107,15,26,0.82)";
    ctx.font = "700 28px Georgia";
    ctx.textAlign = "center";
    ctx.fillText("JJ", 160, 126);
  } else {
    for (let i = 0; i < 8; i += 1) {
      ctx.save();
      ctx.translate(72 + i * 28, 122 + Math.sin(i) * 8);
      ctx.rotate(i % 2 ? 0.75 : -0.75);
      ctx.strokeStyle = i % 2 ? dark : base;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 9, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  ctx.fillStyle = "rgba(23,17,13,0.75)";
  ctx.font = "700 15px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${product.purityKt}K ${product.category}`, 160, 215);

  return canvas.toDataURL("image/png");
}

function drawGem(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - 20);
  ctx.lineTo(x + 24, y);
  ctx.lineTo(x, y + 26);
  ctx.lineTo(x - 24, y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawBead(ctx: CanvasRenderingContext2D, x: number, y: number, base: string, dark: string) {
  const bead = ctx.createRadialGradient(x - 5, y - 5, 2, x, y, 12);
  bead.addColorStop(0, "#FFF7CB");
  bead.addColorStop(0.48, base);
  bead.addColorStop(1, dark);
  ctx.fillStyle = bead;
  ctx.beginPath();
  ctx.arc(x, y, 11, 0, Math.PI * 2);
  ctx.fill();
}

function drawEarring(ctx: CanvasRenderingContext2D, x: number, y: number, base: string, dark: string, accent: string) {
  ctx.strokeStyle = base;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(x, y, 25, 0, Math.PI * 2);
  ctx.stroke();
  drawGem(ctx, x, y + 12, accent);
  drawBead(ctx, x, y + 48, base, dark);
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) as T : fallback;
  } catch {
    return fallback;
  }
}
