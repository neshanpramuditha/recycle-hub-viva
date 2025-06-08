import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getUserProducts,
  deleteProduct,
  getUserFavorites,
} from "../lib/productQueries";
import { deleteImage } from "../lib/storageHelpers";
import AddProductForm from "./AddProductForm";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  // State management
  const [activeSection, setActiveSection] = useState("overview");
  const [userProducts, setUserProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    soldProducts: 0,
    totalViews: 0,
    totalFavorites: 0,
  });

  // Load user products and stats
  useEffect(() => {
    if (
      user &&
      (activeSection === "overview" || activeSection === "products")
    ) {
      loadUserProducts();
    }
    if (user && activeSection === "favorites") {
      loadUserFavorites();
    }
  }, [user, activeSection]);

  const loadUserProducts = async () => {
    try {
      setLoading(true);
      const products = await getUserProducts(user.id);
      setUserProducts(products || []);

      // Calculate stats
      const totalProducts = products?.length || 0;
      const activeProducts =
        products?.filter((p) => p.status === "available").length || 0;
      const soldProducts =
        products?.filter((p) => p.status === "sold").length || 0;
      const totalViews =
        products?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;
      const totalFavorites =
        products?.reduce((sum, p) => sum + (p.favorites_count || 0), 0) || 0;

      setStats({
        totalProducts,
        activeProducts,
        soldProducts,
        totalViews,
        totalFavorites,
      });
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to load your products");
    } finally {
      setLoading(false);
    }
  };

  const loadUserFavorites = async () => {
    try {
      setLoading(true);
      const favorites = await getUserFavorites(user.id);
      setFavoriteProducts(favorites || []);
    } catch (err) {
      console.error("Error loading favorites:", err);
      setError("Failed to load your favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await deleteProduct(productId);
      setSuccess("Product deleted successfully");
      loadUserProducts(); // Reload products
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Mobile menu functions
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false); // Close mobile menu when section changes
  };

  // Sidebar menu items
  const menuItems = [
    { id: "overview", label: "Overview", icon: "fas fa-tachometer-alt" },
    { id: "products", label: "My Products", icon: "fas fa-boxes" },
    { id: "add-product", label: "Add Product", icon: "fas fa-plus-circle" },
    { id: "favorites", label: "Favorites", icon: "fas fa-heart" },
    { id: "messages", label: "Messages", icon: "fas fa-envelope" },
    { id: "settings", label: "Settings", icon: "fas fa-cog" },
    {
      id: "storage",
      label: "Storage Management",
      icon: "fas fa-cloud-upload-alt",
    },
  ];

  // Render different sections based on active selection
  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "products":
        return renderProducts();
      case "add-product":
        return (
          <AddProductForm
            onSuccess={() => {
              setSuccess("Product added successfully!");
              setActiveSection("products");
              loadUserProducts();
            }}
          />
        );
      case "favorites":
        return renderFavorites();
      case "messages":
        return renderMessages();
      case "settings":
        return renderSettings();
      case "storage":
        return renderStorageManagement();
      default:
        return renderOverview();
    }
  };

  const renderProducts = () => (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>My Products</h2>
        <p className="text-muted">Manage your listed products</p>
        <div className="header-actions">
          <button
            className="btn btn-success"
            onClick={() => setActiveSection("add-product")}
          >
            <i className="fas fa-plus me-2"></i>Add New Product
          </button>
        </div>
      </div>

      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {success && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          {success}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccess("")}
          ></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : userProducts.length > 0 ? (
        <div className="products-grid">
          {userProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={product.primary_image || "/image/placeholder.jpg"}
                  alt={product.title}
                  className="product-image"
                />
                <div className="product-status">
                  <span className={`status-badge ${product.status}`}>
                    {product.status}
                  </span>
                </div>
              </div>
              <div className="product-info">
                <h5>{product.title}</h5>
                <p className="product-price">
                  LKR {product.price?.toLocaleString()}
                </p>
                <p className="product-category">{product.category}</p>
                <div className="product-stats">
                  <span>
                    <i className="fas fa-eye"></i> {product.views || 0}
                  </span>
                  <span>
                    <i className="fas fa-heart"></i>{" "}
                    {product.favorites_count || 0}
                  </span>
                </div>
                <div className="product-actions">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <i className="fas fa-eye me-1"></i>View
                  </button>
                  <button
                    className="btn btn-outline-warning btn-sm"
                    onClick={() => navigate(`/edit-product/${product.id}`)}
                  >
                    <i className="fas fa-edit me-1"></i>Edit
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <i className="fas fa-trash me-1"></i>Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="text-center">
            <i className="fas fa-boxes fa-4x text-muted mb-3"></i>
            <h4>No products yet</h4>
            <p className="text-muted mb-4">
              Start by adding your first product to the marketplace
            </p>
            <button
              className="btn btn-success"
              onClick={() => setActiveSection("add-product")}
            >
              <i className="fas fa-plus me-2"></i>Add Your First Product
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderFavorites = () => (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>My Favorites</h2>
        <p className="text-muted">Products you've marked as favorites</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : favoriteProducts.length > 0 ? (
        <div className="products-grid">
          {favoriteProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={product.primary_image || "/image/placeholder.jpg"}
                  alt={product.title}
                  className="product-image"
                />
                <div className="favorite-badge">
                  <i className="fas fa-heart text-danger"></i>
                </div>
              </div>
              <div className="product-info">
                <h5>{product.title}</h5>
                <p className="product-price">
                  LKR {product.price?.toLocaleString()}
                </p>
                <p className="product-category">{product.category}</p>
                <div className="product-stats">
                  <span>
                    <i className="fas fa-eye"></i> {product.views || 0}
                  </span>
                  <span>
                    <i className="fas fa-map-marker-alt"></i> {product.location}
                  </span>
                </div>
                <div className="product-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <i className="fas fa-eye me-1"></i>View Details
                  </button>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() =>
                      window.open(`tel:${product.contact_phone}`, "_self")
                    }
                  >
                    <i className="fas fa-phone me-1"></i>Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="text-center">
            <i className="fas fa-heart fa-4x text-muted mb-3"></i>
            <h4>No favorites yet</h4>
            <p className="text-muted mb-4">
              Browse products and mark them as favorites to see them here
            </p>
            <button
              className="btn btn-success"
              onClick={() => navigate("/Buy")}
            >
              <i className="fas fa-shopping-cart me-2"></i>Browse Products
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderMessages = () => (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>Messages</h2>
        <p className="text-muted">Your conversations with other users</p>
      </div>

      <div className="coming-soon">
        <div className="text-center">
          <i className="fas fa-envelope fa-4x text-muted mb-3"></i>
          <h4>Messages Coming Soon</h4>
          <p className="text-muted mb-4">
            We're working on implementing a messaging system to help you
            communicate with buyers and sellers directly.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <i className="fas fa-check-circle text-success me-2"></i>
              Direct messaging with other users
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle text-success me-2"></i>
              Product inquiry management
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle text-success me-2"></i>
              Real-time notifications
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>Account Settings</h2>
        <p className="text-muted">
          Manage your account preferences and information
        </p>
      </div>

      <div className="settings-sections">
        <div className="card mb-4">
          <div className="card-header">
            <h5>
              <i className="fas fa-user me-2"></i>Profile Information
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={user?.user_metadata?.full_name || ""}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    defaultValue={user?.email || ""}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    defaultValue={user?.user_metadata?.phone_number || ""}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={user?.user_metadata?.city || ""}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    defaultValue={user?.user_metadata?.address || ""}
                  ></textarea>
                </div>
              </div>
            </div>
            <button className="btn btn-success">
              <i className="fas fa-save me-2"></i>Save Changes
            </button>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">
            <h5>
              <i className="fas fa-bell me-2"></i>Notification Preferences
            </h5>
          </div>
          <div className="card-body">
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="emailNotifications"
                defaultChecked
              />
              <label className="form-check-label" htmlFor="emailNotifications">
                Email notifications for new messages
              </label>
            </div>
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="productNotifications"
                defaultChecked
              />
              <label
                className="form-check-label"
                htmlFor="productNotifications"
              >
                Notifications for product inquiries
              </label>
            </div>
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="marketingEmails"
              />
              <label className="form-check-label" htmlFor="marketingEmails">
                Marketing emails and promotions
              </label>
            </div>
            <button className="btn btn-success">
              <i className="fas fa-save me-2"></i>Save Preferences
            </button>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">
            <h5>
              <i className="fas fa-shield-alt me-2"></i>Security
            </h5>
          </div>
          <div className="card-body">
            <button className="btn btn-outline-warning mb-3">
              <i className="fas fa-key me-2"></i>Change Password
            </button>
            <br />
            <button className="btn btn-outline-danger">
              <i className="fas fa-user-times me-2"></i>Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStorageManagement = () => (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>Storage Management</h2>
        <p className="text-muted">
          Manage your uploaded images and storage usage
        </p>
      </div>

      <div className="storage-overview">
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-icon bg-info">
                <i className="fas fa-images"></i>
              </div>
              <div className="stat-content">
                <h3>
                  {userProducts.reduce(
                    (total, product) => total + (product.images?.length || 1),
                    0
                  )}
                </h3>
                <p>Total Images</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-icon bg-warning">
                <i className="fas fa-hdd"></i>
              </div>
              <div className="stat-content">
                <h3>~{Math.round(userProducts.length * 0.5)}MB</h3>
                <p>Storage Used</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-icon bg-success">
                <i className="fas fa-compress-arrows-alt"></i>
              </div>
              <div className="stat-content">
                <h3>Auto</h3>
                <p>Compression</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-icon bg-primary">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="stat-content">
                <h3>Secure</h3>
                <p>Storage</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h5>
              <i className="fas fa-cog me-2"></i>Storage Settings
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h6>Image Compression</h6>
                <p className="text-muted">
                  Images are automatically compressed to reduce storage usage
                  while maintaining quality.
                </p>
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="autoCompress"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="autoCompress">
                    Enable automatic compression
                  </label>
                </div>
                <div className="mb-3">
                  <label className="form-label">Compression Quality</label>
                  <select className="form-select">
                    <option value="high">High Quality (larger files)</option>
                    <option value="medium" selected>
                      Medium Quality (recommended)
                    </option>
                    <option value="low">Low Quality (smaller files)</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <h6>Storage Cleanup</h6>
                <p className="text-muted">
                  Manage your storage by removing unused images and optimizing
                  space.
                </p>
                <button className="btn btn-outline-info mb-2">
                  <i className="fas fa-search me-2"></i>Find Unused Images
                </button>
                <br />
                <button className="btn btn-outline-warning mb-2">
                  <i className="fas fa-compress me-2"></i>Optimize All Images
                </button>
                <br />
                <button className="btn btn-outline-danger">
                  <i className="fas fa-trash me-2"></i>Clear Cache
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="dashboard-content">
      <div className="content-header">
        <h2>Dashboard Overview</h2>
        <p className="text-muted">
          Welcome back, {user?.user_metadata?.full_name || "User"}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-2 col-6">
          <div className="stat-card">
            <div className="stat-icon bg-primary">
              <i className="fas fa-boxes"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-6">
          <div className="stat-card">
            <div className="stat-icon bg-success">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.activeProducts}</h3>
              <p>Active Listings</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-6">
          <div className="stat-card">
            <div className="stat-icon bg-warning">
              <i className="fas fa-handshake"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.soldProducts}</h3>
              <p>Sold Items</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-6">
          <div className="stat-card">
            <div className="stat-icon bg-info">
              <i className="fas fa-eye"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.totalViews}</h3>
              <p>Total Views</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-6">
          <div className="stat-card">
            <div className="stat-icon bg-danger">
              <i className="fas fa-heart"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.totalFavorites}</h3>
              <p>Favorites</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <button
                    className="btn btn-success w-100 mb-2"
                    onClick={() => setActiveSection("add-product")}
                  >
                    <i className="fas fa-plus me-2"></i>Add New Product
                  </button>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-outline-primary w-100 mb-2"
                    onClick={() => navigate("/Buy")}
                  >
                    <i className="fas fa-shopping-cart me-2"></i>Browse Products
                  </button>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-outline-info w-100 mb-2"
                    onClick={() => setActiveSection("products")}
                  >
                    <i className="fas fa-boxes me-2"></i>Manage Products
                  </button>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-outline-warning w-100 mb-2"
                    onClick={() => setActiveSection("storage")}
                  >
                    <i className="fas fa-cloud me-2"></i>Storage Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Recent Products</h5>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setActiveSection("products")}
              >
                View All
              </button>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : userProducts.length > 0 ? (
                <div className="row">
                  {userProducts.slice(0, 4).map((product) => (
                    <div key={product.id} className="col-md-3 col-6 mb-3">
                      <div className="product-card-mini">
                        <img
                          src={
                            product.primary_image || "/image/placeholder.jpg"
                          }
                          alt={product.title}
                          className="product-image-mini"
                        />
                        <div className="product-info-mini">
                          <h6>{product.title}</h6>
                          <p className="text-success">
                            LKR {product.price?.toLocaleString()}
                          </p>
                          <small className="text-muted">
                            {product.views || 0} views
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted">
                  <i className="fas fa-boxes fa-3x mb-3"></i>
                  <p>No products yet. Start by adding your first product!</p>
                  <button
                    className="btn btn-success"
                    onClick={() => setActiveSection("add-product")}
                  >
                    Add Your First Product
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );  return (
    <div className="dashboard-layout">
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      ></div>

      {/* Sidebar */}
      <div className={`dashboard-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="user-info">
            <div className="user-avatar">
              <i className="fas fa-user-circle"></i>
            </div>
            <div className="user-details">
              <h6>{user?.user_metadata?.full_name || "User"}</h6>
              <small className="text-muted">{user?.email}</small>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-button ${
                activeSection === item.id ? "active" : ""
              }`}
              onClick={() => setActiveSection(item.id)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="btn btn-outline-danger w-100"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt me-2"></i>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="dashboard-container">{renderContent()}</div>
      </div>
    </div>
  );
}
