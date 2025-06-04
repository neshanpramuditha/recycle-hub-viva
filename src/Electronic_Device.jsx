import React from 'react';
import './Buy.css'; // Reusing the Buy.css styles

const Electronic_Device = () => {
  return (
    <div className="buy-container">
      <div className="buy-header">
        <h1>Buy Electronic Devices</h1>
        <p>Discover refurbished and recycled electronic devices</p>
      </div>
      
      <div className="item-grid">
        <div className="item-card">
          <div className="item-image">
            <img src="/api/placeholder/300/200" alt="Smartphone" />
          </div>
          <div className="item-details">
            <h3>Refurbished Smartphone</h3>
            <p className="price">₹12,999</p>
            <p className="description">iPhone 11 - 64GB, excellent condition with warranty</p>
            <button className="buy-btn">Contact Seller</button>
          </div>
        </div>

        <div className="item-card">
          <div className="item-image">
            <img src="/api/placeholder/300/200" alt="Laptop" />
          </div>
          <div className="item-details">
            <h3>Gaming Laptop</h3>
            <p className="price">₹35,000</p>
            <p className="description">Dell Gaming Laptop - i5, 8GB RAM, GTX 1650</p>
            <button className="buy-btn">Contact Seller</button>
          </div>
        </div>

        <div className="item-card">
          <div className="item-image">
            <img src="/api/placeholder/300/200" alt="Tablet" />
          </div>
          <div className="item-details">
            <h3>iPad Air</h3>
            <p className="price">₹28,500</p>
            <p className="description">64GB WiFi model, minor scratches on back</p>
            <button className="buy-btn">Contact Seller</button>
          </div>
        </div>

        <div className="item-card">
          <div className="item-image">
            <img src="/api/placeholder/300/200" alt="Desktop PC" />
          </div>
          <div className="item-details">
            <h3>Desktop Computer</h3>
            <p className="price">₹22,000</p>
            <p className="description">Complete setup with monitor, keyboard, mouse</p>
            <button className="buy-btn">Contact Seller</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Electronic_Device;
