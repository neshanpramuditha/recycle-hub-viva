import React from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaDollarSign,
  FaHandshake,
  FaPlus,
} from "react-icons/fa";
import buyImage from "/image/10.gif";
import saleImage from "/image/12.gif";
import useTheme from "../../hooks/useTheme";
import "./BuyAndSale.css";

const BuyAndSale = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`buy-sale-page ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="buy-sale-container">
        {/* Header Section */}
        <header className="page-header">
          <div className="header-content">
            <div className="title-section">
              <FaHandshake className="main-icon" />
              <h1 className="page-title">Buy & Sell Second-Hand Items</h1>
              <p className="page-subtitle">
                Connect with others to buy and sell quality pre-owned goods.
                Join our sustainable marketplace and give items a second life.
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
                <h2 className="card-title">Buy Items</h2>
                <p className="card-description">
                  Discover amazing deals on quality second-hand items. Browse
                  through various categories and find exactly what you need at
                  unbeatable prices.
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
                <h2 className="card-title">Sell Items</h2>                <p className="card-description">
                  Turn your unused items into cash. Register to list your products and
                  connect with interested buyers in your area quickly and
                  securely.
                </p>
                <div className="card-features">
                  <span className="feature-tag">Easy Registration</span>
                  <span className="feature-tag">Quick Sales</span>
                  <span className="feature-tag">Fair Prices</span>
                </div>
              </div>              <div className="card-footer">
                <Link to="/register" className="action-btn sell-btn">
                  <FaPlus className="btn-icon" />
                  <span>List Item</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BuyAndSale;
