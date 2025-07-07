import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { getUserProducts, deleteProduct } from "../lib/productQueries";
import AddProductForm from "./AddProductForm";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // State management
  const [activeSection, setActiveSection] = useState("products");
  const [userProducts, setUserProducts] = useState([]);
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

  // Load user products
  useEffect(() => {
    if (
      user &&
      (activeSection === "products" || activeSection === "add-product")
    ) {
      loadUserProducts();
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

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteProduct(productId);
      setSuccess("Product deleted successfully!");
      loadUserProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
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

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  // Mobile menu functions
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Sidebar menu items
  const menuItems = [
    { id: "products", label: "My Products", icon: "fas fa-boxes" },
    { id: "add-product", label: "Add Product", icon: "fas fa-plus-circle" },
  ];

  // Render different sections based on active selection
  const renderContent = () => {
    switch (activeSection) {
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
      default:
        return renderProducts();
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
              {" "}
              <div className="product-image-container">
                {" "}
                <img
                  src={product.primary_image || "/image/placeholder.svg"}
                  alt={product.title}
                  className="product-image"
                  onError={(e) => {
                    e.target.src = "/image/placeholder.svg";
                  }}
                />
                <div className="product-status">
                  <span className={`status-badge ${product.status}`}>
                    {product.status}
                  </span>
                </div>
              </div>{" "}
              <div className="product-info">
                <h5>{product.title}</h5>
                <p className="product-price">
                  LKR {product.price?.toLocaleString()}
                </p>
                <p className="product-category">{product.category_name}</p>
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

  return (
    <div className="dashboard-layout">
      {/* Mobile Menu Toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <i className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
      </button>

      {/* Mobile Overlay */}
      <div
        className={`sidebar-overlay ${isMobileMenuOpen ? "active" : ""}`}
        onClick={closeMobileMenu}
      ></div>

      {/* Sidebar */}
      <div
        className={`dashboard-sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}
      >
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
          <Link className="btn btn-outline-success w-100" to={"/"}>
            <i className="fas fa-home-alt me-2"></i>
            Back to Home
          </Link>
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
