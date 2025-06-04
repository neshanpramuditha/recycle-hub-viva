import React from 'react';
import './Buy.css'; // Reusing the Buy.css styles

const Iron_Bar = () => {
  return (
    <div className="buy-container">
      <div className="buy-header">
        <h1>Buy Iron Bars & Metal</h1>
        <p>Quality recycled iron and metal materials for construction</p>
      </div>
      
      <div className="item-grid">
        <div className="item-card">
          <div className="item-image">
            <img src="/api/placeholder/300/200" alt="Iron Rods" />
          </div>
          <div className="item-details">
            <h3>Construction Iron Rods</h3>
            <p className="price">₹45/kg</p>
            <p className="description">High grade TMT bars, various sizes available</p>
            <button className="buy-btn">Contact Seller</button>
          </div>
        </div>

        <div className="item-card">
          <div className="item-image">
            <img src="/api/placeholder/300/200" alt="Steel Sheets" />
          </div>
          <div className="item-details">
            <h3>Steel Sheets</h3>
            <p className="price">₹55/kg</p>
            <p className="description">Galvanized steel sheets, rust-resistant coating</p>
            <button className="buy-btn">Contact Seller</button>
          </div>
        </div>

        <div className="item-card">
          <div className="item-image">
            <img src="/api/placeholder/300/200" alt="Copper Wire" />
          </div>
          <div className="item-details">
            <h3>Copper Wire Bundle</h3>
            <p className="price">₹650/kg</p>
            <p className="description">Pure copper wire, excellent for electrical work</p>
            <button className="buy-btn">Contact Seller</button>
          </div>
        </div>

        <div className="item-card">
          <div className="item-image">
            <img src="/api/placeholder/300/200" alt="Aluminum Sheets" />
          </div>
          <div className="item-details">
            <h3>Aluminum Sheets</h3>
            <p className="price">₹180/kg</p>
            <p className="description">Lightweight aluminum, perfect for roofing</p>
            <button className="buy-btn">Contact Seller</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Iron_Bar;
