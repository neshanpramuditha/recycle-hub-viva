import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaDollarSign,
  FaHandshake,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import buyImage from "/image/10.gif";
import saleImage from "/image/12.gif";
import useTheme from "../../hooks/useTheme";
import "./BuyAndSale.css";

const BuyAndSale = () => {
  const { isDarkMode } = useTheme();
  const [showSaleForm, setShowSaleForm] = useState(false);
  const handleSaleClick = () => {
    setShowSaleForm(true);
  };

  const handleCloseSaleForm = () => {
    setShowSaleForm(false);
  };
  return (
    <div className={`buy-sale-page ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="buy-sale-container">        {/* Header Section */}
        <header className="page-header">
          <div className="header-content">
            <div className="title-section">
              <FaHandshake className="main-icon" />
              <h1 className="page-title">Buy & Sell Second-Hand Items</h1>
              <p className="page-subtitle">
                Connect with others to buy and sell quality pre-owned goods
              </p>
            </div>
          </div>
        </header>
        {/* Action Cards */}
        <main className="main-content">
          <div className="cards-container">
            {/* Buy Card */}
            <div className="action-card buy-card">
              <div className="card-header">
                <div className="card-image-wrapper">
                  <img
                    src={buyImage}
                    alt="Buy recyclable items"
                    className="card-image"
                    loading="lazy"
                  />
                  <div className="image-overlay">
                    <FaShoppingCart className="overlay-icon" />
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="card-icon">
                  <FaShoppingCart />
                </div>
                <h2 className="card-title">Buy Items</h2>
                <p className="card-description">
                  Discover amazing deals on quality second-hand items. Browse
                  through various categories and find what you need.
                </p>
                <div className="card-features">
                  <span className="feature-tag">Quality Assured</span>
                  <span className="feature-tag">Best Prices</span>
                  <span className="feature-tag">Wide Selection</span>
                </div>
              </div>
              <div className="card-footer">
                <Link to="/buy" className="action-btn buy-btn">
                  <FaShoppingCart className="btn-icon" />
                  <span>Start Buying</span>
                </Link>
              </div>
            </div>

            {/* Sell Card */}
            <div className="action-card sell-card">
              <div className="card-header">
                <div className="card-image-wrapper">
                  <img
                    src={saleImage}
                    alt="Sell recyclable items"
                    className="card-image"
                    loading="lazy"
                  />
                  <div className="image-overlay">
                    <FaDollarSign className="overlay-icon" />
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="card-icon">
                  <FaDollarSign />
                </div>
                <h2 className="card-title">Sell Items</h2>
                <p className="card-description">
                  Turn your unused items into cash. List your products and
                  connect with interested buyers in your area.
                </p>
                <div className="card-features">
                  <span className="feature-tag">Easy Listing</span>
                  <span className="feature-tag">Quick Sales</span>
                  <span className="feature-tag">Fair Prices</span>
                </div>
              </div>
              <div className="card-footer">
                <button
                  onClick={handleSaleClick}
                  className="action-btn sell-btn"
                >
                  <FaPlus className="btn-icon" />
                  <span>List Item</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Sale Form Modal */}
      {showSaleForm && (
        <div className="modal-backdrop" onClick={handleCloseSaleForm}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <FaPlus className="modal-icon" />
                <h2 className="modal-title">List Your Item</h2>
              </div>
              <button
                onClick={handleCloseSaleForm}
                className="modal-close"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <form className="sale-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="itemName" className="form-label">
                      Item Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="itemName"
                      className="form-input"
                      placeholder="What are you selling?"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="itemPrice" className="form-label">
                      Price <span className="required">*</span>
                    </label>
                    <div className="price-input-wrapper">
                      <span className="currency-symbol">$</span>
                      <input
                        type="number"
                        id="itemPrice"
                        className="form-input price-input"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="itemCategory" className="form-label">
                    Category
                  </label>
                  <select id="itemCategory" className="form-select">
                    <option value="">Select a category</option>
                    <option value="electronics">Electronics</option>
                    <option value="furniture">Furniture</option>
                    <option value="clothing">Clothing</option>
                    <option value="books">Books</option>
                    <option value="sports">Sports & Recreation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="itemCondition" className="form-label">
                    Condition
                  </label>
                  <select id="itemCondition" className="form-select">
                    <option value="">Select condition</option>
                    <option value="new">Like New</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="itemDescription" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="itemDescription"
                    className="form-textarea"
                    rows="4"
                    placeholder="Describe your item's condition, features, and any other relevant details..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="itemImages" className="form-label">
                    Photos
                  </label>
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      id="itemImages"
                      className="form-file"
                      accept="image/*"
                      multiple
                    />
                    <div className="file-upload-hint">
                      <FaSearch className="upload-icon" />
                      <span>Upload up to 5 photos</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={handleCloseSaleForm}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <FaDollarSign className="btn-icon" />
                List Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyAndSale;
