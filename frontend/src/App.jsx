import { useState, useEffect } from "react";
import "./App.css";
import { apiRequest } from "./api";

function getCropImage(cropName) {
  const name = (cropName || "").toLowerCase();

  if (name.includes("tomato"))
    return "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=700&q=80";
  if (name.includes("rice") || name.includes("paddy"))
    return "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=700&q=80";
  if (name.includes("wheat"))
    return "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=700&q=80";
  if (name.includes("potato"))
    return "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=80";
  if (name.includes("corn") || name.includes("maize"))
    return "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=700&q=80";
  if (name.includes("mango"))
    return "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=700&q=80";

  return "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80";
}

function App() {
  const [showForm, setShowForm] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "FARMER",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Crops and crop orders
  const [crops, setCrops] = useState([]);
  const [myCrops, setMyCrops] = useState([]);
  const [cropOrders, setCropOrders] = useState([]);
  const [receivedCropOrders, setReceivedCropOrders] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState("1");
  const [orderMessage, setOrderMessage] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [recommendationBudget, setRecommendationBudget] = useState("500");
  const [recommendationQuantity, setRecommendationQuantity] = useState("10");
  const [recommendationCrop, setRecommendationCrop] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationMessage, setRecommendationMessage] = useState("");
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");
  const [showCropForm, setShowCropForm] = useState(false);
  const [cropMessage, setCropMessage] = useState("");
  const [cropLoading, setCropLoading] = useState(false);
  const [cropForm, setCropForm] = useState({
    cropName: "",
    description: "",
    pricePerKg: "",
    quantityKg: "",
    location: "",
  });
  
const [assistantQuestion, setAssistantQuestion] = useState("");
const [assistantMessages, setAssistantMessages] = useState([
  {
    role: "assistant",
    text: "Hello! I'm your AgriShare Farming Assistant. Ask me about crops, soil, irrigation, pests, or fertilizers."
  }
]);
const [assistantLoading, setAssistantLoading] = useState(false);


  // Equipment
  const [equipment, setEquipment] = useState([]);
  const [myEquipment, setMyEquipment] = useState([]);
  const [equipmentSearch, setEquipmentSearch] = useState("");
  const [equipmentLocation, setEquipmentLocation] = useState("");
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [equipmentLoading, setEquipmentLoading] = useState(false);
  const [equipmentMessage, setEquipmentMessage] = useState("");
  const [equipmentForm, setEquipmentForm] = useState({
    equipmentName: "",
    description: "",
    rentalPricePerDay: "",
    location: "",
  });

  // Equipment bookings
  const [myBookings, setMyBookings] = useState([]);
  const [receivedBookings, setReceivedBookings] = useState([]);
  const [bookingDates, setBookingDates] = useState({});
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);


async function handleRecommendations(e) {
  e.preventDefault();

  if (!localStorage.getItem("token")) {
    setRecommendationMessage("Please log in to get crop recommendations.");
    openForm(false);
    return;
  }

  const budget = Number(recommendationBudget);
  const quantity = Number(recommendationQuantity);

  if (!Number.isFinite(budget) || budget < 0) {
    setRecommendationMessage("Enter a valid budget.");
    return;
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    setRecommendationMessage("Quantity must be greater than zero.");
    return;
  }

  setRecommendationLoading(true);
  setRecommendationMessage("");
  setRecommendations([]);

  try {
    const params = new URLSearchParams({
      budget: String(budget),
      quantityKg: String(quantity),
    });

    if (recommendationCrop.trim()) {
      params.set("cropName", recommendationCrop.trim());
    }

    const result = await apiRequest(
      `/api/recommendations?${params.toString()}`
    );

    setRecommendations(Array.isArray(result) ? result : []);

    if (!Array.isArray(result) || result.length === 0) {
      setRecommendationMessage(
        "No matching crops found. Try increasing your budget or reducing the quantity."
      );
    }
  } catch (error) {
    setRecommendationMessage(
      error.message || "Unable to load recommendations."
    );
  } finally {
    setRecommendationLoading(false);
  }
}


async function handleAssistantSubmit(e) {
  e.preventDefault();

  const question = assistantQuestion.trim();
  if (!question || assistantLoading) return;

  setAssistantMessages(prev => [
    ...prev,
    { role: "user", text: question }
  ]);
  setAssistantQuestion("");
  setAssistantLoading(true);

  try {
    const result = await apiRequest("/api/assistant/chat", {
      method: "POST",
      body: JSON.stringify({ question })
    });

    setAssistantMessages(prev => [
      ...prev,
      {
        role: "assistant",
        text: result.answer || "Sorry, I couldn't answer that."
      }
    ]);
  } catch (error) {
    setAssistantMessages(prev => [
      ...prev,
      {
        role: "assistant",
        text: error.message || "Unable to connect. Please try again."
      }
    ]);
  } finally {
    setAssistantLoading(false);
  }
}


async function loadCrops() {
  try {
    const result = await apiRequest("/api/crops");

    console.log("Crops received from backend:", result);

    const cropList = Array.isArray(result)
      ? result
      : Array.isArray(result.crops)
      ? result.crops
      : [];

    setCrops(cropList);
    setCropMessage(
      cropList.length === 0 ? "No crops found in the marketplace." : ""
    );
  } catch (error) {
    console.error("Failed to load crops:", error);
    setCrops([]);
    setCropMessage(error.message || "Unable to load crops.");
  }
}


  async function loadMyCrops() {
    try {
      const result = await apiRequest("/api/crops/my");
      setMyCrops(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadEquipment() {
    try {
      const result = await apiRequest("/api/equipment");
      setEquipment(Array.isArray(result) ? result : []);
      setEquipmentMessage("");
    } catch (error) {
      setEquipmentMessage(error.message || "Unable to load equipment.");
    }
  }

  async function loadMyEquipment() {
    try {
      const result = await apiRequest("/api/equipment/my");
      setMyEquipment(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadBookings() {
    if (!localStorage.getItem("token")) {
      setMyBookings([]);
      setReceivedBookings([]);
      return;
    }

    try {
      const [mine, received] = await Promise.all([
        apiRequest("/api/equipment/bookings/my"),
        apiRequest("/api/equipment/bookings/received"),
      ]);

      setMyBookings(Array.isArray(mine) ? mine : []);
      setReceivedBookings(Array.isArray(received) ? received : []);
    } catch (error) {
      console.error("Could not load bookings:", error);
    }
  }

  // Step 1: Load crop orders for the correct user role.
  
async function loadCropOrders(role = user?.role) {
  if (!localStorage.getItem("token")) {
    setCropOrders([]);
    setReceivedCropOrders([]);
    return;
  }

  try {
    if (role === "BUYER") {
      const result = await apiRequest("/api/crop-orders/my");
      setCropOrders(Array.isArray(result) ? result : []);
      setReceivedCropOrders([]);
    } else if (role === "FARMER") {
      const result = await apiRequest("/api/crop-orders/received");
      setReceivedCropOrders(Array.isArray(result) ? result : []);
      setCropOrders([]);
    }
  } catch (error) {
    setCropOrders([]);
    setReceivedCropOrders([]);
    setOrderMessage(error.message || "Unable to load crop orders.");
  }
}


  function openForm(register = false) {
    setIsRegister(register);
    setMessage("");
    setShowForm(true);
  }

  // Step 2: Open checkout for a crop.
  function openCropCheckout(crop) {
    if (!user) {
      openForm(false);
      setOrderMessage("Please log in as a buyer to purchase crops.");
      return;
    }

    if (user.role !== "BUYER") {
      setOrderMessage("Only buyer accounts can purchase crops.");
      return;
    }

    if (Number(crop.quantityKg) <= 0) {
      setOrderMessage("This crop is currently out of stock.");
      return;
    }

    setSelectedCrop(crop);
    setPurchaseQuantity("1");
    setOrderMessage("");

    setTimeout(() => {
      document.getElementById("crop-checkout")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 0);
  }

  const purchaseTotal =
    selectedCrop &&
    Number(purchaseQuantity) > 0 &&
    Number.isFinite(Number(purchaseQuantity))
      ? Number(selectedCrop.pricePerKg) * Number(purchaseQuantity)
      : 0;

  // Steps 3 and 4: Validate quantity, calculate total, and place order.
  async function handlePlaceCropOrder(e) {
    e.preventDefault();

    if (!selectedCrop) return;

    const quantity = Number(purchaseQuantity);
    const stock = Number(selectedCrop.quantityKg);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setOrderMessage("Enter a quantity greater than zero.");
      return;
    }

    if (quantity > stock) {
      setOrderMessage(`Only ${stock} kg is currently available.`);
      return;
    }

    setOrderLoading(true);
    setOrderMessage("");

    try {
      const order = await apiRequest("/api/crop-orders", {
        method: "POST",
        body: JSON.stringify({
          cropId: selectedCrop.id,
          quantityKg: quantity,
        }),
      });

      setOrderMessage(
        `Order placed successfully! Order #${order.id}. Total: ₹${order.totalPrice}`
      );
      setSelectedCrop(null);
      setPurchaseQuantity("1");

      await Promise.all([loadCrops(), loadCropOrders("BUYER")]);
    } catch (error) {
      setOrderMessage(error.message || "Unable to place your order.");
      await loadCrops();
    } finally {
      setOrderLoading(false);
    }
  }

  async function loadDashboard(role = user?.role) {
    if (!localStorage.getItem("token")) return;

    setDashboardLoading(true);

    try {
      const tasks = [loadBookings(), loadCropOrders(role)];

      if (role === "FARMER") {
        tasks.push(loadMyCrops(), loadMyEquipment());
      }

      await Promise.all(tasks);
    } finally {
      setDashboardLoading(false);
    }
  }

  useEffect(() => {
    loadCrops();
    loadEquipment();

    if (localStorage.getItem("token")) {
      loadDashboard(user?.role);
    }
    // Load initial data once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pendingRequests = receivedBookings.filter(
    (b) => b.status === "PENDING"
  ).length;

  const approvedReceivedBookings = receivedBookings.filter(
    (b) => b.status === "APPROVED"
  ).length;

  const availableCrops = crops.length;
  const availableEquipment = equipment.filter((item) => item.available).length;

  const approvedMyBookings = myBookings.filter(
    (b) => b.status === "APPROVED"
  ).length;

  const pendingMyBookings = myBookings.filter(
    (b) => b.status === "PENDING"
  ).length;

  const locations = [
    ...new Set(crops.map((c) => c.location?.trim()).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));

  const filteredCrops = crops.filter((crop) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      (crop.cropName || "").toLowerCase().includes(search) ||
      (crop.description || "").toLowerCase().includes(search);

    const matchesLocation =
      !locationFilter ||
      (crop.location || "").trim().toLowerCase() ===
        locationFilter.trim().toLowerCase();

    return matchesSearch && matchesLocation;
  });

  const equipmentLocations = [
    ...new Set(
      equipment.map((item) => item.location?.trim()).filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b));

  const filteredEquipment = equipment.filter((item) => {
    const search = equipmentSearch.trim().toLowerCase();

    const matchesSearch =
      (item.equipmentName || "").toLowerCase().includes(search) ||
      (item.description || "").toLowerCase().includes(search);

    const matchesLocation =
      !equipmentLocation ||
      (item.location || "").trim().toLowerCase() ===
        equipmentLocation.trim().toLowerCase();

    return matchesSearch && matchesLocation;
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleCropChange(e) {
    setCropForm({ ...cropForm, [e.target.name]: e.target.value });
  }

  function handleEquipmentChange(e) {
    setEquipmentForm({ ...equipmentForm, [e.target.name]: e.target.value });
  }

 
async function handleAddCrop(e) {
  e.preventDefault();
  setCropLoading(true);
  setCropMessage("");

  try {
    const result = await apiRequest("/api/crops", {
      method: "POST",
      body: JSON.stringify({
        ...cropForm,
        pricePerKg: Number(cropForm.pricePerKg),
        quantityKg: Number(cropForm.quantityKg),
      }),
    });

    console.log("Crop published:", result);

    setCropForm({
      cropName: "",
      description: "",
      pricePerKg: "",
      quantityKg: "",
      location: "",
    });

    setShowCropForm(false);
    setCropMessage("Crop published successfully!");

    await loadCrops();

    if (user?.role === "FARMER") {
      await loadMyCrops();
    }
  } catch (error) {
    console.error("Crop publishing failed:", error);
    setCropMessage(error.message || "Unable to publish crop.");
  } finally {
    setCropLoading(false);
  }
}


  async function handleAddEquipment(e) {
    e.preventDefault();
    setEquipmentLoading(true);
    setEquipmentMessage("");

    try {
      await apiRequest("/api/equipment", {
        method: "POST",
        body: JSON.stringify({
          ...equipmentForm,
          rentalPricePerDay: Number(equipmentForm.rentalPricePerDay),
        }),
      });

      setEquipmentForm({
        equipmentName: "",
        description: "",
        rentalPricePerDay: "",
        location: "",
      });

      setShowEquipmentForm(false);
      setEquipmentMessage("Equipment listed successfully!");
      await Promise.all([loadEquipment(), loadMyEquipment()]);
    } catch (error) {
      setEquipmentMessage(error.message || "Unable to list equipment.");
    } finally {
      setEquipmentLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (isRegister) {
        const result = await apiRequest("/api/auth/register", {
          method: "POST",
          body: JSON.stringify(form),
        });

        setMessage(result.message || "Registration successful! Please log in.");
        setIsRegister(false);
        setForm({
          name: "",
          email: form.email,
          password: "",
          role: form.role,
        });
      } else {
        const result = await apiRequest("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });

        localStorage.setItem("token", result.token);

        const loggedInUser = {
          name: result.name,
          email: result.email,
          role: result.role,
        };

        localStorage.setItem("user", JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        setShowForm(false);
        setMessage("");
        setBookingMessage("");
        setForm({
          name: "",
          email: "",
          password: "",
          role: "FARMER",
        });

        await loadDashboard(loggedInUser.role);
      }
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleBookingDateChange(equipmentId, field, value) {
    setBookingDates((previous) => ({
      ...previous,
      [equipmentId]: {
        ...previous[equipmentId],
        [field]: value,
      },
    }));
  }

  async function handleBookEquipment(equipmentId) {
    if (!user) {
      openForm(false);
      setBookingMessage("Please log in to request a rental.");
      return;
    }

    if (user.role !== "BUYER") {
      setBookingMessage("Only buyer accounts can request equipment rentals.");
      return;
    }

    const dates = bookingDates[equipmentId];

    if (!dates?.startDate || !dates?.endDate) {
      setBookingMessage("Please select both rental dates.");
      return;
    }

    if (dates.endDate < dates.startDate) {
      setBookingMessage("End date must be on or after the start date.");
      return;
    }

    setBookingLoading(true);
    setBookingMessage("");

    try {
      await apiRequest(`/api/equipment/${equipmentId}/bookings`, {
        method: "POST",
        body: JSON.stringify({
          startDate: dates.startDate,
          endDate: dates.endDate,
        }),
      });

      setBookingMessage("Rental request sent successfully!");
      await loadBookings();
    } catch (error) {
      setBookingMessage(error.message || "Could not send rental request.");
    } finally {
      setBookingLoading(false);
    }
  }

  async function handleBookingStatus(bookingId, status) {
    setBookingMessage("");

    try {
      await apiRequest(`/api/equipment/bookings/${bookingId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      setBookingMessage(`Booking ${status.toLowerCase()} successfully.`);
      await loadBookings();
    } catch (error) {
      setBookingMessage(error.message || "Could not update booking.");
    }
  }

  // Step 5: Farmers can update the status of received crop orders.
  async function handleCropOrderStatus(orderId, status) {
    setOrderMessage("");

    try {
      await apiRequest(`/api/crop-orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      setOrderMessage(`Crop order ${status.toLowerCase()} successfully.`);
      await loadCropOrders("FARMER");
    } catch (error) {
      setOrderMessage(
        error.message ||
          "Unable to update crop order. Check that the backend supports this endpoint."
      );
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setShowForm(false);
    setShowCropForm(false);
    setShowEquipmentForm(false);
    setMyCrops([]);
    setMyEquipment([]);
    setMyBookings([]);
    setReceivedBookings([]);
    setCropOrders([]);
    setReceivedCropOrders([]);
    setSelectedCrop(null);
    setBookingDates({});
    setBookingMessage("");
    setOrderMessage("");
    setDashboardLoading(false);
    setMessage("You have logged out.");
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="app">
      <header className="navbar">
        <h2>🌱 AgriShare</h2>

        <nav>
          <a href="#home">Home</a>
          {user && <a href="#dashboard">Dashboard</a>}
          <a href="#crops">Crops</a>
          <a href="#recommendations">Smart Recommendations</a>
          
<a href="#farming-assistant">Farming Assistant</a>

          <a href="#resources">Resources</a>
          {user && <a href="#bookings">Bookings</a>}
          {user && <a href="#crop-orders">Crop Orders</a>}
          <a href="#about">About</a>
        </nav>

        {user ? (
          <div>
            <span>{user.name} ({user.role})</span>{" "}
            <button className="login-btn" onClick={logout}>Logout</button>
          </div>
        ) : (
          <button className="login-btn" onClick={() => openForm(false)}>
            Login
          </button>
        )}
      </header>

      {user && (
        <p className="welcome-message">
          Welcome, {user.name}! You are logged in as a {user.role}.
        </p>
      )}

      {showForm && (
        <section className="account-form">
          <h2>{isRegister ? "Create Account" : "Login to AgriShare"}</h2>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <label>Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  maxLength={100}
                />

                <label>Register As</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="FARMER">Farmer</option>
                  <option value="BUYER">Buyer</option>
                </select>
              </>
            )}

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              minLength={8}
              maxLength={72}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
            </button>
          </form>

          {message && <p role="alert">{message}</p>}

          <p>
            {isRegister ? "Already have an account?" : "New to AgriShare?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setMessage("");
              }}
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </p>

          <button type="button" onClick={() => setShowForm(false)}>Close</button>
        </section>
      )}

      <main>
        <section className="hero" id="home">
          <p className="tagline">GROW TOGETHER, SHARE SMARTER</p>
          <h1>Empowering Farmers.<br />Connecting Markets.</h1>
          <p className="description">
            Find farming equipment, discover fresh crops, and connect directly
            with agricultural buyers and service providers.
          </p>

          <div className="actions">
            <button onClick={() => document.getElementById("crops")?.scrollIntoView({ behavior: "smooth" })}>
              Explore Marketplace
            </button>
            <button className="secondary" onClick={() => document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" })}>
              Find Resources
            </button>
          </div>

          {!user && <button onClick={() => openForm(true)}>Join AgriShare</button>}
        </section>

        {user && (
          <section className="dashboard-section" id="dashboard">
            <div className="dashboard-heading">
              <p className="tagline">YOUR FARMING OVERVIEW</p>
              <h2>{user.role === "FARMER" ? "Farmer Dashboard" : "Buyer Dashboard"}</h2>
              <p>Welcome back, {user.name}! Manage your AgriShare activities.</p>
            </div>

            {dashboardLoading ? (
              <p>Loading your dashboard...</p>
            ) : (
              <div className="dashboard-stats">
                {user.role === "FARMER" ? (
                  <>
                    <article className="dashboard-stat">
                      <p>My Crops</p><h3>{myCrops.length}</h3>
                      <a href="#crops">Manage crops →</a>
                    </article>
                    <article className="dashboard-stat">
                      <p>My Equipment</p><h3>{myEquipment.length}</h3>
                      <a href="#resources">Manage equipment →</a>
                    </article>
                    <article className="dashboard-stat">
                      <p>Pending Requests</p><h3>{pendingRequests}</h3>
                      <a href="#bookings">Review requests →</a>
                    </article>
                    <article className="dashboard-stat">
                      <p>Approved Rentals</p><h3>{approvedReceivedBookings}</h3>
                      <a href="#bookings">View bookings →</a>
                    </article>
                  </>
                ) : (
                  <>
                    <article className="dashboard-stat">
                      <p>Available Crops</p><h3>{availableCrops}</h3>
                      <a href="#crops">Explore crops →</a>
                    </article>
                    <article className="dashboard-stat">
                      <p>Available Equipment</p><h3>{availableEquipment}</h3>
                      <a href="#resources">Find equipment →</a>
                    </article>
                    <article className="dashboard-stat">
                      <p>My Rental Requests</p><h3>{myBookings.length}</h3>
                      <a href="#bookings">Track requests →</a>
                    </article>
                    <article className="dashboard-stat">
                      <p>Crop Orders</p><h3>{cropOrders.length}</h3>
                      <a href="#crop-orders">Track crop orders →</a>
                    </article>
                  </>
                )}
              </div>
            )}

            <div className="dashboard-shortcuts">
              <h3>Quick Actions</h3>
              {user.role === "FARMER" ? (
                <>
                  <button onClick={() => { setShowCropForm(true); document.getElementById("crops")?.scrollIntoView({ behavior: "smooth" }); }}>
                    + Add a Crop
                  </button>
                  <button onClick={() => { setShowEquipmentForm(true); document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" }); }}>
                    + List Equipment
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => document.getElementById("crops")?.scrollIntoView({ behavior: "smooth" })}>Browse Crops</button>
                  <button onClick={() => document.getElementById("crop-orders")?.scrollIntoView({ behavior: "smooth" })}>My Crop Orders</button>
                </>
              )}
              <button className="secondary" onClick={() => document.getElementById("bookings")?.scrollIntoView({ behavior: "smooth" })}>
                View Bookings
              </button>
            </div>

            {user.role === "BUYER" && (
              <div className="buyer-booking-summary">
                <h3>Rental Request Summary</h3>
                <p>Pending requests: <strong>{pendingMyBookings}</strong></p>
                <p>Approved rentals: <strong>{approvedMyBookings}</strong></p>
                <p>
                  Rejected requests:{" "}
                  <strong>{myBookings.filter((b) => b.status === "REJECTED").length}</strong>
                </p>
              </div>
            )}
          </section>
        )}
        
{/* Smart Crop Recommendations */}
<section className="features" id="recommendations">
  <p className="tagline">SMART FARMING • SMART BUYING</p>
  <h2>🌱 Smart Crop Recommendations</h2>
  <p>
    Find available crops that match your budget, quantity, and crop preference.
  </p>

  <form className="crop-form" onSubmit={handleRecommendations}>
    <label>Budget (₹)</label>
    <input
      type="number"
      min="0"
      step="0.01"
      value={recommendationBudget}
      onChange={(e) => setRecommendationBudget(e.target.value)}
      required
    />

    <label>Required Quantity (kg)</label>
    <input
      type="number"
      min="0.01"
      step="0.01"
      value={recommendationQuantity}
      onChange={(e) => setRecommendationQuantity(e.target.value)}
      required
    />

    <label>Preferred Crop (optional)</label>
    <input
      type="text"
      placeholder="e.g. rice, wheat, tomato"
      value={recommendationCrop}
      onChange={(e) => setRecommendationCrop(e.target.value)}
    />

    <button type="submit" disabled={recommendationLoading}>
      {recommendationLoading
        ? "Finding Crops..."
        : "Get Smart Recommendations"}
    </button>
  </form>

  {recommendationMessage && (
    <p role="status">{recommendationMessage}</p>
  )}

  {recommendations.length > 0 && (
    <>
      <h3>Recommended Crops for You</h3>
      <div className="cards">
        {recommendations.map((crop) => (
          <article className="card crop-card" key={crop.id}>
            <img
              className="crop-image"
              src={getCropImage(crop.cropName)}
              alt={crop.cropName}
              loading="lazy"
            />

            <div className="crop-card-content">
              <h3>{crop.cropName}</h3>
              <p><strong>Price:</strong> ₹{crop.pricePerKg} / kg</p>
              <p>
                <strong>Available:</strong> {crop.availableQuantityKg} kg
              </p>
              <p>
                <strong>Required:</strong> {crop.requestedQuantityKg} kg
              </p>
              <p>
                <strong>Total cost:</strong> ₹
                {Number(crop.totalCost).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p><strong>Location:</strong> {crop.location || "Not specified"}</p>
              <p>{crop.reason}</p>

              {user?.role === "BUYER" && (
                <button
                  type="button"
                  onClick={() => {
                    const matchingCrop = crops.find(
                      (item) => item.id === crop.id
                    );

                    if (matchingCrop) {
                      openCropCheckout(matchingCrop);
                    } else {
                      setRecommendationMessage(
                        "Please refresh the marketplace and try again."
                      );
                    }
                  }}
                >
                  Buy This Crop
                </button>
              )}

              {!user && (
                <button
                  type="button"
                  onClick={() => openForm(false)}
                >
                  Login to Buy
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  )}
</section>


<section id="farming-assistant" className="section">
  <h2>🌱 AI Farming Assistant</h2>
  <p>
    Ask questions about crops, soil, irrigation, pests, and fertilizers.
  </p>

  <div
    style={{
      maxWidth: "700px",
      margin: "20px auto",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "12px"
    }}
  >
    <div
      style={{
        minHeight: "200px",
        maxHeight: "350px",
        overflowY: "auto",
        marginBottom: "16px"
      }}
    >
      {assistantMessages.map((message, index) => (
        <div
          key={index}
          style={{
            textAlign:
              message.role === "user" ? "right" : "left",
            margin: "12px 0"
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "10px 14px",
              borderRadius: "12px",
              background:
                message.role === "user" ? "#dcfce7" : "#f3f4f6",
              maxWidth: "90%",
              whiteSpace: "pre-wrap"
            }}
          >
            <strong>
              {message.role === "user" ? "You: " : "Assistant: "}
            </strong>
            {message.text}
          </span>
        </div>
      ))}

      {assistantLoading && <p>Thinking...</p>}
    </div>

    <form onSubmit={handleAssistantSubmit}>
      <input
        type="text"
        value={assistantQuestion}
        onChange={e => setAssistantQuestion(e.target.value)}
        placeholder="Ask a farming question..."
        required
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "12px",
          marginBottom: "10px"
        }}
      />

      <button type="submit" disabled={assistantLoading}>
        {assistantLoading ? "Sending..." : "Send Message"}
      </button>
    </form>
  </div>
</section>

        {/* Crop marketplace */}
        <section className="features" id="crops">
          <h2>Fresh Crops Marketplace</h2>
          <p>Explore produce listed by farmers on AgriShare.</p>

          <div className="crop-filters">
            <input
              type="search"
              className="crop-search"
              placeholder="🔍 Search crops by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search crops"
            />

            <select
              className="location-filter"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              aria-label="Filter crops by location"
            >
              <option value="">All Locations</option>
              {locations.map((location) => <option key={location}>{location}</option>)}
            </select>

            <button type="button" className="secondary" onClick={() => { setSearchTerm(""); setLocationFilter(""); }}>
              Clear Filters
            </button>
          </div>

          <p>Showing {filteredCrops.length} of {crops.length} crops</p>

          {user?.role === "FARMER" && (
            <button onClick={() => { setShowCropForm(!showCropForm); setCropMessage(""); }}>
              {showCropForm ? "Cancel" : "+ Add Crop"}
            </button>
          )}

          {showCropForm && user?.role === "FARMER" && (
            <form className="crop-form" onSubmit={handleAddCrop}>
              <h3>List Your Crop</h3>
              <label>Crop Name</label>
              <input name="cropName" value={cropForm.cropName} onChange={handleCropChange} required maxLength={100} />

              <label>Description</label>
              <textarea name="description" value={cropForm.description} onChange={handleCropChange} maxLength={500} />

              <label>Price per kg (₹)</label>
              <input type="number" name="pricePerKg" value={cropForm.pricePerKg} onChange={handleCropChange} min="0.01" step="0.01" required />

              <label>Quantity (kg)</label>
              <input type="number" name="quantityKg" value={cropForm.quantityKg} onChange={handleCropChange} min="0.01" step="0.01" required />

              <label>Location</label>
              <input name="location" value={cropForm.location} onChange={handleCropChange} required maxLength={150} />

              <button type="submit" disabled={cropLoading}>
                {cropLoading ? "Adding..." : "Publish Crop"}
              </button>
            </form>
          )}

          {cropMessage && <p role="status">{cropMessage}</p>}
          {crops.length === 0 && !cropMessage && <p>No crops are available yet.</p>}
          {filteredCrops.length === 0 && crops.length > 0 && <p>No crops found. Try another search.</p>}

          <div className="cards">
            {filteredCrops.map((crop) => (
              <article className="card crop-card" key={crop.id}>
                <img
                  className="crop-image"
                  src={getCropImage(crop.cropName)}
                  alt={crop.cropName}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getCropImage("");
                  }}
                />

                <div className="crop-card-content">
                  <h3>{crop.cropName}</h3>
                  <p>{crop.description || "Fresh farm produce"}</p>
                  <p><strong>Price:</strong> ₹{crop.pricePerKg} / kg</p>
                  <p><strong>Quantity:</strong> {crop.quantityKg} kg</p>
                  <p><strong>Location:</strong> {crop.location}</p>
                  <p><strong>Farmer:</strong> {crop.farmerName}</p>

                  {/* Step 1: Buy button */}
                  {Number(crop.quantityKg) > 0 && user?.role === "BUYER" && (
                    <button type="button" onClick={() => openCropCheckout(crop)}>
                      Buy Crop
                    </button>
                  )}

                  {!user && Number(crop.quantityKg) > 0 && (
                    <button type="button" onClick={() => openCropCheckout(crop)}>
                      Login to Buy
                    </button>
                  )}

                  {Number(crop.quantityKg) <= 0 && (
                    <p><strong>Out of stock</strong></p>
                  )}

                  {user?.role === "FARMER" && crop.farmerName === user.name && (
                    <p>Your crop listing</p>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Step 2: Checkout form */}
          {selectedCrop && user?.role === "BUYER" && (
            <section className="crop-form" id="crop-checkout">
              <h2>Crop Checkout</h2>
              <h3>{selectedCrop.cropName}</h3>
              <p>Price per kg: ₹{selectedCrop.pricePerKg}</p>
              <p>Available stock: {selectedCrop.quantityKg} kg</p>

              <form onSubmit={handlePlaceCropOrder}>
                <label>Quantity to purchase (kg)</label>
                <input
                  type="number"
                  min="0.01"
                  max={selectedCrop.quantityKg}
                  step="0.01"
                  value={purchaseQuantity}
                  onChange={(e) => setPurchaseQuantity(e.target.value)}
                  required
                />

                {/* Step 3: Automatic total */}
                <h3>
                  Total Amount: ₹
                  {purchaseTotal.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h3>

                <button type="submit" disabled={orderLoading}>
                  {orderLoading ? "Placing Order..." : "Confirm Purchase"}
                </button>

                <button type="button" className="secondary" onClick={() => setSelectedCrop(null)}>
                  Cancel
                </button>
              </form>
            </section>
          )}

          {orderMessage && <p role="status">{orderMessage}</p>}
        </section>

        {/* Equipment marketplace */}
        <section className="features" id="resources">
          <h2>Equipment Rental Marketplace</h2>
          <p>Find and rent farming equipment from local farmers.</p>

          <div className="crop-filters">
            <input
              type="search"
              className="crop-search"
              placeholder="Search tractors, pumps, harvesters..."
              value={equipmentSearch}
              onChange={(e) => setEquipmentSearch(e.target.value)}
              aria-label="Search equipment"
            />

            <select
              className="location-filter"
              value={equipmentLocation}
              onChange={(e) => setEquipmentLocation(e.target.value)}
              aria-label="Filter equipment by location"
            >
              <option value="">All Locations</option>
              {equipmentLocations.map((location) => <option key={location}>{location}</option>)}
            </select>

            <button type="button" className="secondary" onClick={() => { setEquipmentSearch(""); setEquipmentLocation(""); }}>
              Clear Filters
            </button>
          </div>

          <p>Showing {filteredEquipment.length} of {equipment.length} items</p>

          {user?.role === "FARMER" && (
            <button type="button" onClick={() => { setShowEquipmentForm(!showEquipmentForm); setEquipmentMessage(""); }}>
              {showEquipmentForm ? "Cancel" : "+ List Equipment"}
            </button>
          )}

          {showEquipmentForm && user?.role === "FARMER" && (
            <form className="crop-form" onSubmit={handleAddEquipment}>
              <h3>List Your Farming Equipment</h3>
              <label>Equipment Name</label>
              <input name="equipmentName" value={equipmentForm.equipmentName} onChange={handleEquipmentChange} required maxLength={100} />

              <label>Description</label>
              <textarea name="description" value={equipmentForm.description} onChange={handleEquipmentChange} maxLength={1000} />

              <label>Rental Price Per Day (₹)</label>
              <input type="number" name="rentalPricePerDay" value={equipmentForm.rentalPricePerDay} onChange={handleEquipmentChange} min="0.01" step="0.01" required />

              <label>Location</label>
              <input name="location" value={equipmentForm.location} onChange={handleEquipmentChange} required maxLength={150} />

              <button type="submit" disabled={equipmentLoading}>
                {equipmentLoading ? "Publishing..." : "Publish Equipment"}
              </button>
            </form>
          )}

          {equipmentMessage && <p role="status">{equipmentMessage}</p>}
          {equipment.length === 0 && !equipmentMessage && <p>No equipment has been listed yet.</p>}
          {equipment.length > 0 && filteredEquipment.length === 0 && <p>No equipment found.</p>}

          <div className="cards">
            {filteredEquipment.map((item) => (
              <article className="card equipment-card" key={item.id}>
                <div className="equipment-icon" aria-hidden="true">🚜</div>
                <div className="equipment-card-content">
                  <h3>{item.equipmentName}</h3>
                  <p>{item.description || "Farming equipment available for rent."}</p>
                  <p><strong>Rental Price:</strong> ₹{item.rentalPricePerDay} / day</p>
                  <p><strong>Location:</strong> {item.location}</p>
                  <p><strong>Owner:</strong> {item.ownerName}</p>
                  <p>{item.available ? "Available for rent" : "Currently unavailable"}</p>

                  {user?.role === "BUYER" && item.available && item.ownerName !== user.name && (
                    <div className="booking-form">
                      <h4>Request Rental</h4>
                      <label>Start Date</label>
                      <input
                        type="date"
                        min={today}
                        value={bookingDates[item.id]?.startDate || ""}
                        onChange={(e) => handleBookingDateChange(item.id, "startDate", e.target.value)}
                      />

                      <label>End Date</label>
                      <input
                        type="date"
                        min={bookingDates[item.id]?.startDate || today}
                        value={bookingDates[item.id]?.endDate || ""}
                        onChange={(e) => handleBookingDateChange(item.id, "endDate", e.target.value)}
                      />

                      <button type="button" onClick={() => handleBookEquipment(item.id)} disabled={bookingLoading}>
                        {bookingLoading ? "Sending..." : "Request Rental"}
                      </button>
                    </div>
                  )}

                  {!user && item.available && (
                    <button type="button" onClick={() => openForm(false)}>Login to Request Rental</button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Equipment bookings */}
        {user && (
          <section className="booking-section" id="bookings">
            <h2>My Bookings</h2>

            {myBookings.length === 0 ? (
              <p>You haven't requested any equipment yet.</p>
            ) : (
              <div className="booking-list">
                {myBookings.map((booking) => (
                  <article className="booking-card" key={booking.id}>
                    <h3>{booking.equipmentName}</h3>
                    <p>Owner: {booking.ownerName}</p>
                    <p>From: {booking.startDate} to {booking.endDate}</p>
                    <p>Total: ₹{booking.totalPrice}</p>
                    <p>Status: <strong>{booking.status}</strong></p>
                  </article>
                ))}
              </div>
            )}

            {user.role === "FARMER" && (
              <>
                <h2>Received Rental Requests</h2>
                {receivedBookings.length === 0 ? (
                  <p>No rental requests received yet.</p>
                ) : (
                  <div className="booking-list">
                    {receivedBookings.map((booking) => (
                      <article className="booking-card" key={booking.id}>
                        <h3>{booking.equipmentName}</h3>
                        <p>Requested by: {booking.renterName}</p>
                        <p>From: {booking.startDate} to {booking.endDate}</p>
                        <p>Total: ₹{booking.totalPrice}</p>
                        <p>Status: <strong>{booking.status}</strong></p>

                        {booking.status === "PENDING" && (
                          <div className="booking-actions">
                            <button type="button" onClick={() => handleBookingStatus(booking.id, "APPROVED")}>Approve</button>
                            <button type="button" onClick={() => handleBookingStatus(booking.id, "REJECTED")}>Reject</button>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}

            {bookingMessage && <p className="booking-message" role="status">{bookingMessage}</p>}
          </section>
        )}

        {/* Step 5: Buyer crop order history */}
        {user?.role === "BUYER" && (
          <section className="booking-section" id="crop-orders">
            <h2>My Crop Orders</h2>
            <button type="button" className="secondary" onClick={() => loadCropOrders("BUYER")}>
              Refresh Orders
            </button>

            {cropOrders.length === 0 ? (
              <p>You haven't placed any crop orders yet.</p>
            ) : (
              <div className="booking-list">
                {cropOrders.map((order) => (
                  <article className="booking-card" key={order.id}>
                    <h3>{order.cropName || `Crop Order #${order.id}`}</h3>
                    <p>Order ID: #{order.id}</p>
                    {order.farmerName && <p>Farmer: {order.farmerName}</p>}
                    <p>Quantity: {order.quantityKg} kg</p>
                    <p>Total: ₹{order.totalPrice}</p>
                    <p>Status: <strong>{order.status || "PLACED"}</strong></p>
                  </article>
                ))}
              </div>
            )}
            {orderMessage && <p role="status">{orderMessage}</p>}
          </section>
        )}

        {/* Step 6: Farmer received crop orders */}
        {user?.role === "FARMER" && (
          <section className="booking-section" id="crop-orders">
            <h2>Crop Orders Received</h2>
            <button type="button" className="secondary" onClick={() => loadCropOrders("FARMER")}>
              Refresh Orders
            </button>

            {receivedCropOrders.length === 0 ? (
              <p>You haven't received any crop orders yet.</p>
            ) : (
              <div className="booking-list">
                {receivedCropOrders.map((order) => (
                  <article className="booking-card" key={order.id}>
                    <h3>{order.cropName || `Crop Order #${order.id}`}</h3>
                    <p>Order ID: #{order.id}</p>
                    {order.buyerName && <p>Buyer: {order.buyerName}</p>}
                    <p>Quantity: {order.quantityKg} kg</p>
                    <p>Total: ₹{order.totalPrice}</p>
                    <p>Status: <strong>{order.status || "PLACED"}</strong></p>

                    {order.status === "PENDING" && (
                      <div className="booking-actions">
                        <button type="button" onClick={() => handleCropOrderStatus(order.id, "APPROVED")}>
                          Approve Order
                        </button>
                        <button type="button" onClick={() => handleCropOrderStatus(order.id, "REJECTED")}>
                          Reject Order
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
            {orderMessage && <p role="status">{orderMessage}</p>}
          </section>
        )}

        <section className="features" id="about">
          <h2>Direct Connections</h2>
          <p>Bring farmers, buyers and providers together.</p>
        </section>
      </main>

      <footer>
        © 2026 AgriShare | Growing a better agricultural future
      </footer>
    </div>
  );
}

export default App;