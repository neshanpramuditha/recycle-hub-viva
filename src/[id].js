import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { 
  getProductById, 
  getProductImages, 
  getProductSpecifications,
  getSimilarProducts,
  incrementProductViews,
  isProductFavorited,
  addToFavorites,
  removeFromFavorites
} from './lib/productQueries';
import './ProductSingle.css';

export default function ProductSingle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [productSpecs, setProductSpecs] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [error, setError] = useState(null);

  // Mock product data - in real app, this would come from API/database
  const mockProducts = {
    1: {
      id: 1,
      name: "Vintage Leather Sofa",
      price: 15000,
      originalPrice: 25000,
      category: "Furniture",
      condition: "Good",
      description: "Beautiful vintage leather sofa in excellent condition. Perfect for any living room. Minor wear on armrests but otherwise in great shape. Comfortable seating for 3 people.",
      images: ["/image/1.jpg", "/image/2.jpg", "/image/3.png", "/image/4.jpg"],
      seller: {
        name: "John Doe",
        rating: 4.5,
        location: "Colombo, Sri Lanka",
        phone: "+94 77 123 4567"
      },
      specifications: {
        "Material": "Genuine Leather",
        "Dimensions": "200cm x 90cm x 85cm",
        "Weight": "45kg",
        "Age": "5 years",
        "Color": "Brown"
      },
      negotiable: true,
      datePosted: "2024-12-01",
      views: 127,
      favorites: 15
    },
    2: {
      id: 2,
      name: "iPhone 12 Pro",
      price: 89000,
      originalPrice: 120000,
      category: "Electronics",
      condition: "Excellent",
      description: "iPhone 12 Pro in mint condition. Barely used, includes original box, charger, and screen protector already applied. Battery health at 95%.",
      images: ["/image/5.png", "/image/6.jpg", "/image/7.jpg", "/image/8.jpg"],
      seller: {
        name: "Sarah Smith",
        rating: 4.8,
        location: "Kandy, Sri Lanka",
        phone: "+94 76 987 6543"
      },
      specifications: {
        "Storage": "128GB",
        "Color": "Pacific Blue",
        "Battery Health": "95%",
        "Condition": "Like New",
        "Warranty": "No Warranty"
      },
      negotiable: false,
      datePosted: "2024-12-03",
      views: 89,
      favorites: 23
    }
  };
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch main product data
        const productData = await getProductById(id);
        if (!productData) {
          setError('Product not found');
          setLoading(false);
          return;
        }
        setProduct(productData);

        // Fetch product images
        const images = await getProductImages(id);
        setProductImages(images);

        // Fetch product specifications
        const specs = await getProductSpecifications(id);
        setProductSpecs(specs);

        // Fetch similar products
        const similar = await getSimilarProducts(id, productData.category_id);
        setSimilarProducts(similar);

        // Check if favorited (only if user is logged in)
        if (user) {
          const favorited = await isProductFavorited(id, user.id);
          setIsFavorited(favorited);
        }

        // Increment view count
        await incrementProductViews(id);

      } catch (err) {
        console.error('Error fetching product data:', err);
        setError('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
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
      const message = `Hi! I'm interested in your ${product.title} listed on Recycle Hub for LKR ${product.price.toLocaleString()}`;
      window.open(`https://wa.me/${product.seller_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`);
    }
  };

  const handleAddToFavorites = async () => {
    if (!user) {
      alert('Please login to add to favorites');
      navigate('/Login');
      return;
    }

    try {
      if (isFavorited) {
        await removeFromFavorites(id, user.id);
        setIsFavorited(false);
        alert('Removed from favorites!');
      } else {
        await addToFavorites(id, user.id);
        setIsFavorited(true);
        alert('Added to favorites!');
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      alert('Failed to update favorites');
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      alert('Please login to make a purchase');
      navigate('/Login');
      return;
    }
    // Buy now logic here
    alert(`Proceeding to buy ${quantity} x ${product.title}`);
  };
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <h2>{error || 'Product not found'}</h2>
        <button onClick={() => navigate('/Buy')} className="btn btn-primary">
          Back to Products
        </button>
      </div>
    );
  }

  // Use either fetched images or fallback to primary image
  const displayImages = productImages.length > 0 
    ? productImages.map(img => img.image_url)
    : [product.primary_image || '/image/placeholder.jpg'];

  return (
    <div className="product-single-container">
      <div className="container">        <nav className="breadcrumb-nav">
          <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span> / 
          <span onClick={() => navigate('/Buy')} className="breadcrumb-link">Buy</span> / 
          <span onClick={() => navigate(`/${product.category_name}`)} className="breadcrumb-link">{product.category_name}</span> / 
          <span className="breadcrumb-current">{product.title}</span>
        </nav>

        <div className="row">
          {/* Product Images */}
          <div className="col-md-6">
            <div className="product-images">
              <div className="main-image">
                <img 
                  src={displayImages[selectedImage]} 
                  alt={product.title}
                  className="main-product-image"
                />
                <div className="image-badges">
                  {product.is_negotiable && <span className="badge badge-negotiable">Negotiable</span>}
                  <span className={`badge badge-condition ${product.condition.toLowerCase()}`}>
                    {product.condition}
                  </span>
                </div>
              </div>
              <div className="image-thumbnails">
                {displayImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => handleImageChange(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="col-md-6">
            <div className="product-details">
              <div className="product-header">
                <h1 className="product-title">{product.title}</h1>
                <div className="product-meta">
                  <span className="views">👁 {product.views} views</span>
                  <span className="favorites">❤ {product.favorites_count} favorites</span>
                  <span className="date">📅 {new Date(product.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pricing">
                <div className="current-price">LKR {product.price.toLocaleString()}</div>
                {product.original_price && product.original_price > product.price && (
                  <div className="original-price">
                    Original: LKR {product.original_price.toLocaleString()}
                    <span className="discount">
                      ({Math.round((1 - product.price / product.original_price) * 100)}% off)
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
                  <strong>Location:</strong> {product.seller_location || product.location}
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
                <button onClick={handleContactSeller} className="btn btn-contact">
                  📞 Call Seller
                </button>
                <button onClick={handleWhatsApp} className="btn btn-whatsapp">
                  💬 WhatsApp
                </button>                <button onClick={handleAddToFavorites} className="btn btn-favorite">
                  {isFavorited ? '💔 Remove from Favorites' : '❤ Add to Favorites'}
                </button>
              </div>

              {/* Seller Information */}
              <div className="seller-info">
                <h3>Seller Information</h3>
                <div className="seller-card">
                  <div className="seller-details">
                    <div className="seller-name">{product.seller_name}</div>
                    <div className="seller-rating">
                      {"★".repeat(Math.floor(product.seller_rating || 0))}
                      {"☆".repeat(5 - Math.floor(product.seller_rating || 0))}
                      <span>({product.seller_rating || 0}/5) - {product.seller_total_ratings || 0} reviews</span>
                    </div>
                    <div className="seller-location">📍 {product.seller_location}</div>
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
        </div>

        {/* Specifications */}
        <div className="row">
          <div className="col-12">
            <div className="product-section">
              <h2>Specifications</h2>
              <div className="specifications-grid">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="spec-item">
                    <span className="spec-label">{key}:</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="row">
          <div className="col-12">
            <div className="product-section">
              <h2>Similar Products</h2>
              <div className="similar-products">
                <div className="similar-product-card">
                  <img src="/image/9.jpg" alt="Similar product" />
                  <h4>Classic Wooden Chair</h4>
                  <p>LKR 8,500</p>
                </div>
                <div className="similar-product-card">
                  <img src="/image/10.jpg" alt="Similar product" />
                  <h4>Vintage Table Lamp</h4>
                  <p>LKR 3,200</p>
                </div>
                <div className="similar-product-card">
                  <img src="/image/27.jpg" alt="Similar product" />
                  <h4>Retro Bookshelf</h4>
                  <p>LKR 12,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}