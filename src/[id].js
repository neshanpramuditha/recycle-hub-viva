import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  getSimilarProducts,
  addToFavorites,
  removeFromFavorites,
  isProductFavorited,
} from "./lib/productQueries";
import { useAuth } from "./contexts/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import "./ProductSingle.css";

export default function ProductSingle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(parseInt(id));
        setProduct(productData);

        // Fetch similar products
        if (productData?.category_id) {
          const similar = await getSimilarProducts(
            productData.id,
            productData.category_id
          );
          setSimilarProducts(similar);
        }

        // Check if product is favorited (only if user is logged in)
        if (user && productData) {
          const favorited = await isProductFavorited(user.id, productData.id);
          setIsFavorited(favorited);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, user]);

  const handleImageChange = (index) => {
    setSelectedImage(index);
  };
  const handleContactSeller = () => {
    if (product?.seller_phone) {
      window.open(`tel:${product.seller_phone}`);
    }
  };
  const handleWhatsApp = () => {
    if (product?.seller_phone) {
      const message = `Hi! I'm interested in your ${
        product.title
      } listed on Recycle Hub for LKR ${product.price.toLocaleString()}`;

      // Clean the phone number and format for WhatsApp
      let phoneNumber = product.seller_phone.replace(/[^0-9]/g, "");

      // If it's a Sri Lankan number starting with 0, convert to international format
      if (phoneNumber.startsWith("0") && phoneNumber.length === 10) {
        phoneNumber = "94" + phoneNumber.substring(1); // Replace 0 with 94
      }
      // If it already starts with 94, use as is
      else if (phoneNumber.startsWith("94")) {
        phoneNumber = phoneNumber;
      }
      // If it doesn't start with 0 or 94, assume it needs 94 prefix
      else if (phoneNumber.length === 9) {
        phoneNumber = "94" + phoneNumber;
      }

      window.open(
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
      );
    }
  };
  const handleAddToFavorites = async () => {
    if (!user) {
      toast.error("Please login to add items to favorites!");
      navigate("/auth/login");
      return;
    }

    if (!product) return;

    try {
      setFavoritesLoading(true);

      if (isFavorited) {
        // Remove from favorites
        await removeFromFavorites(user.id, product.id);
        setIsFavorited(false);

        // Update the local favorites count
        setProduct((prev) => ({
          ...prev,
          favorites_count: Math.max(0, (prev.favorites_count || 0) - 1),
        }));

        toast.success("Removed from favorites!", {
          icon: "💔",
          duration: 3000,
        });
      } else {
        // Add to favorites
        await addToFavorites(user.id, product.id);
        setIsFavorited(true);

        // Update the local favorites count
        setProduct((prev) => ({
          ...prev,
          favorites_count: (prev.favorites_count || 0) + 1,
        }));

        toast.success("Added to favorites!", {
          icon: "❤️",
          duration: 3000,
        });
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      toast.error("Failed to update favorites. Please try again.");
    } finally {
      setFavoritesLoading(false);
    }
  };
  const handleBuyNow = () => {
    // Buy now logic here
    toast.success(`Proceeding to buy ${quantity} x ${product.title}`, {
      icon: "🛒",
      duration: 4000,
    });
  };
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/Buy")} className="btn btn-primary">
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <h2>Product not found</h2>
        <button onClick={() => navigate("/Buy")} className="btn btn-primary">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-single-container">
      <div className="container">
        {" "}
        <nav className="breadcrumb-nav">
          <span onClick={() => navigate("/")} className="breadcrumb-link">
            Home
          </span>{" "}
          /
          <span onClick={() => navigate("/Buy")} className="breadcrumb-link">
            Buy
          </span>{" "}
          /
          <span
            onClick={() => navigate(`/${product.category_name}`)}
            className="breadcrumb-link"
          >
            {product.category_name}
          </span>{" "}
          /<span className="breadcrumb-current">{product.title}</span>
        </nav>
        <div className="row">
          {/* Product Images */}{" "}
          <div className="col-md-6">
            <div className="product-images">
              <div className="main-image">
                {" "}
                <img
                  src={
                    product.images && product.images.length > 0
                      ? product.images[selectedImage]?.image_url ||
                        product.primary_image
                      : product.primary_image || "/image/placeholder.svg"
                  }
                  alt={product.title}
                  className="main-product-image"
                  onError={(e) => {
                    e.target.src = "/image/placeholder.svg";
                  }}
                />
                <div className="image-badges">
                  {product.is_negotiable && (
                    <span className="badge badge-negotiable">Negotiable</span>
                  )}
                  <span
                    className={`badge badge-condition ${product.condition?.toLowerCase()}`}
                  >
                    {product.condition}
                  </span>
                </div>
              </div>
              {product.images && product.images.length > 0 && (
                <div className="image-thumbnails">
                  {product.images.map((image, index) => (
                    <img
                      key={image.id || index}
                      src={image.image_url}
                      alt={image.alt_text || `${product.title} ${index + 1}`}
                      className={`thumbnail ${
                        selectedImage === index ? "active" : ""
                      }`}
                      onError={(e) => {
                        e.target.src = "/image/placeholder.svg";
                      }}
                      onClick={() => handleImageChange(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Product Details */}{" "}
          <div className="col-md-6">
            <div className="product-details">
              <div className="product-header">
                <h1 className="product-title">{product.title}</h1>
                <div className="product-meta">
                  <span className="views">👁 {product.views || 0} views</span>
                  <span className="favorites">
                    ❤ {product.favorites_count || 0} favorites
                  </span>
                  <span className="date">
                    📅 {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="pricing">
                <div className="current-price">
                  LKR {product.price?.toLocaleString()}
                </div>
                {product.original_price &&
                  product.original_price > product.price && (
                    <div className="original-price">
                      Original: LKR {product.original_price.toLocaleString()}
                      <span className="discount">
                        (
                        {Math.round(
                          (1 - product.price / product.original_price) * 100
                        )}
                        % off)
                      </span>
                    </div>
                  )}
              </div>
              <div className="product-info">
                <div className="info-item">
                  <strong>Category:</strong> {product.category_name}
                </div>
                <div className="info-item">
                  <strong>Condition:</strong> {product.condition}
                </div>
                <div className="info-item">
                  <strong>Location:</strong>{" "}
                  {product.location || product.seller_location}
                </div>
              </div>
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="action-buttons">
                <button onClick={handleBuyNow} className="btn btn-buy-now">
                  🛒 Buy Now
                </button>
                <button
                  onClick={handleContactSeller}
                  className="btn btn-contact"
                >
                  📞 Call Seller
                </button>
                <button onClick={handleWhatsApp} className="btn btn-whatsapp">
                  💬 WhatsApp
                </button>{" "}
                <button
                  onClick={handleAddToFavorites}
                  className={`btn ${
                    isFavorited ? "btn-favorited" : "btn-favorite"
                  }`}
                  disabled={favoritesLoading}
                >
                  {favoritesLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Loading...
                    </>
                  ) : isFavorited ? (
                    <>
                      <i className="fas fa-heart"></i> Remove from Favorites
                    </>
                  ) : (
                    <>
                      <i className="far fa-heart"></i> Add to Favorites
                    </>
                  )}
                </button>
              </div>{" "}
              {/* Seller Information */}
              <div className="seller-info">
                <h3>Seller Information</h3>
                <div className="seller-card">
                  <div className="seller-details">
                    <div className="seller-header">
                      <div className="seller-avatar">
                        {product.seller_avatar_url ? (
                          <img
                            src={product.seller_avatar_url}
                            alt={product.seller_name}
                            className="avatar-image"
                          />
                        ) : (
                          <div className="avatar-placeholder">
                            {(product.seller_name || "A")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="seller-info-content">
                        <div className="seller-name">
                          {product.seller_name || "Anonymous Seller"}
                          {product.seller_is_verified && (
                            <span
                              className="verified-badge"
                              title="Verified Seller"
                            >
                              <i className="fas fa-check-circle"></i>
                            </span>
                          )}
                        </div>

                        {product.seller_rating && (
                          <div className="seller-rating">
                            <div className="stars">
                              {"★".repeat(Math.floor(product.seller_rating))}
                              {"☆".repeat(
                                5 - Math.floor(product.seller_rating)
                              )}
                            </div>
                            <span className="rating-text">
                              ({product.seller_rating}/5)
                            </span>
                            {product.seller_total_ratings && (
                              <span className="rating-count">
                                {product.seller_total_ratings} review
                                {product.seller_total_ratings !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="seller-contact-info">
                      <div className="contact-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>
                          {product.seller_location ||
                            product.location ||
                            "Location not specified"}
                        </span>
                      </div>

                      {product.seller_phone && (
                        <div className="contact-item">
                          <i className="fas fa-phone"></i>
                          <span>{product.seller_phone}</span>
                        </div>
                      )}

                      {product.seller_email && (
                        <div className="contact-item">
                          <i className="fas fa-envelope"></i>
                          <span>{product.seller_email}</span>
                        </div>
                      )}
                    </div>

                    {product.seller_bio && (
                      <div className="seller-bio">
                        <h4>About the Seller</h4>
                        <p>{product.seller_bio}</p>
                      </div>
                    )}

                    <div className="seller-actions">
                      <button
                        onClick={handleContactSeller}
                        className="btn btn-contact-seller"
                        disabled={!product.seller_phone}
                      >
                        <i className="fas fa-phone"></i>
                        Call Seller
                      </button>
                      <button
                        onClick={handleWhatsApp}
                        className="btn btn-whatsapp-seller"
                        disabled={!product.seller_phone}
                      >
                        <i className="fab fa-whatsapp"></i>
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Product Description */}
        <div className="row">
          <div className="col-12">
            <div className="product-section">
              <h2>Description</h2>
              <p className="product-description">{product.description}</p>
            </div>
          </div>
        </div>{" "}
        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="row">
            <div className="col-12">
              <div className="product-section">
                <h2>Specifications</h2>
                <div className="specifications-grid">
                  {product.specifications.map((spec) => (
                    <div key={spec.id} className="spec-item">
                      <span className="spec-label">{spec.spec_name}:</span>
                      <span className="spec-value">{spec.spec_value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}{" "}
        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="row">
            <div className="col-12">
              <div className="product-section">
                <h2>Similar Products</h2>
                <div className="similar-products">
                  {similarProducts.map((similarProduct) => (
                    <div
                      key={similarProduct.id}
                      className="similar-product-card"
                      onClick={() => navigate(`/product/${similarProduct.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      {" "}
                      <img
                        src={
                          similarProduct.primary_image ||
                          "/image/placeholder.svg"
                        }
                        alt={similarProduct.title}
                        onError={(e) => {
                          e.target.src = "/image/placeholder.svg";
                        }}
                      />
                      <h4>{similarProduct.title}</h4>
                      <p>LKR {similarProduct.price?.toLocaleString()}</p>
                      <span className="product-condition">
                        {similarProduct.condition}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>{" "}
          </div>
        )}
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              background: "#4ade80",
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#ef4444",
              color: "#fff",
            },
          },
        }}
      />
    </div>
  );
}
