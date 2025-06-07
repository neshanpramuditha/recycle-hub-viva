import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Buy.css';

export default function Buy() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Mock products data
  const mockProducts = [
    {
      id: 1,
      name: "Vintage Leather Sofa",
      price: 15000,
      originalPrice: 25000,
      category: "Furniture",
      condition: "Good",
      image: "/image/1.jpg",
      location: "Colombo",
      datePosted: "2024-12-01",
      negotiable: true
    },
    {
      id: 2,
      name: "iPhone 12 Pro",
      price: 89000,
      originalPrice: 120000,
      category: "Electronics",
      condition: "Excellent",
      image: "/image/5.png",
      location: "Kandy",
      datePosted: "2024-12-03",
      negotiable: false
    },
    {
      id: 3,
      name: "Mountain Bike",
      price: 25000,
      originalPrice: 35000,
      category: "Sports",
      condition: "Good",
      image: "/image/3.png",
      location: "Galle",
      datePosted: "2024-12-02",
      negotiable: true
    },
    {
      id: 4,
      name: "Wooden Dining Table",
      price: 18000,
      originalPrice: 30000,
      category: "Furniture",
      condition: "Fair",
      image: "/image/4.jpg",
      location: "Negombo",
      datePosted: "2024-11-30",
      negotiable: true
    },
    {
      id: 5,
      name: "Samsung TV 43 inch",
      price: 45000,
      originalPrice: 65000,
      category: "Electronics",
      condition: "Good",
      image: "/image/6.jpg",
      location: "Colombo",
      datePosted: "2024-12-04",
      negotiable: false
    },
    {
      id: 6,
      name: "Office Chair",
      price: 12000,
      originalPrice: 20000,
      category: "Furniture",
      condition: "Excellent",
      image: "/image/7.jpg",
      location: "Kurunegala",
      datePosted: "2024-12-01",
      negotiable: true
    }
  ];

  const categories = ['All', 'Electronics', 'Furniture', 'Sports', 'Clothing', 'Books', 'Others'];

  useEffect(() => {
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.datePosted) - new Date(b.datePosted));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, sortBy, products]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="buy-container">
      <div className="buy-header">
        <div className="container">
          <h1 className="buy-title">Browse Second-Hand Items</h1>
          <p className="buy-subtitle">Find quality pre-owned items at great prices</p>
        </div>
      </div>

      <div className="container">
        <div className="row">
          {/* Filters Sidebar */}
          <div className="col-md-3">
            <div className="filters-section">
              <h3>Filters</h3>
              
              {/* Search */}
              <div className="filter-group">
                <label>Search</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Categories */}
              <div className="filter-group">
                <label>Category</label>
                <div className="category-filters">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="filter-group">
                <label>Sort By</label>
                <select
                  className="form-control"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="col-md-9">
            <div className="products-header">
              <h2>
                {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                <span className="products-count">({filteredProducts.length} items)</span>
              </h2>
            </div>

            <div className="products-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="product-card"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="product-image-container">
                      <img src={product.image} alt={product.name} className="product-image" />
                      <div className="product-badges">
                        {product.negotiable && <span className="badge badge-negotiable">Negotiable</span>}
                        <span className={`badge badge-condition ${product.condition.toLowerCase()}`}>
                          {product.condition}
                        </span>
                      </div>
                    </div>
                    
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-pricing">
                        <span className="current-price">LKR {product.price.toLocaleString()}</span>
                        {product.originalPrice > product.price && (
                          <span className="original-price">LKR {product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <div className="product-meta">
                        <span className="product-location">📍 {product.location}</span>
                        <span className="product-category">🏷️ {product.category}</span>
                      </div>
                      <div className="product-date">
                        Posted: {new Date(product.datePosted).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-products">
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
