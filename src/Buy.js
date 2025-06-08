import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Buy.css';
import { getAllProducts } from './lib/productQueries';

export default function Buy() {
  const navigate = useNavigate();  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['All', 'Electronics', 'Furniture', 'Sports', 'Clothing', 'Books', 'Vehicle Parts', 'Others'];

  // Load products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data || []);
        setFilteredProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category_name === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
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
          </div>          {/* Products Grid */}
          <div className="col-md-9">
            <div className="products-header">
              <h2>
                {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                <span className="products-count">({filteredProducts.length} items)</span>
              </h2>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <h3>Error</h3>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="btn btn-primary">
                  Try Again
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className="product-card"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <div className="product-image-container">
                        <img 
                          src={product.primary_image || '/image/placeholder.jpg'} 
                          alt={product.title} 
                          className="product-image" 
                        />
                        <div className="product-badges">
                          {product.is_negotiable && <span className="badge badge-negotiable">Negotiable</span>}
                          <span className={`badge badge-condition ${product.condition.toLowerCase()}`}>
                            {product.condition}
                          </span>
                        </div>
                      </div>
                      
                      <div className="product-info">
                        <h3 className="product-name">{product.title}</h3>
                        <div className="product-pricing">
                          <span className="current-price">LKR {product.price.toLocaleString()}</span>
                          {product.original_price && product.original_price > product.price && (
                            <span className="original-price">LKR {product.original_price.toLocaleString()}</span>
                          )}
                        </div>
                        <div className="product-meta">
                          <span className="product-location">📍 {product.location}</span>
                          <span className="product-category">🏷️ {product.category_name}</span>
                        </div>
                        <div className="product-date">
                          Posted: {new Date(product.created_at).toLocaleDateString()}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
