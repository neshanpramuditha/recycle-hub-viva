import React from 'react';
import './Buy.css'; // Reusing the Buy.css styles

const Tyre = () => {
  return (
    <div className="buy-container">
      <div className="buy-header">
        <h1>Buy Tyres</h1>
        <p>Find quality recycled tyres for your needs</p>
      </div>
      
      <div className="item-grid">
        <div className="item-card">
          <div className="item-image">
            <img src="/api/placeholder/300/200" alt="Car Tyre" />
          </div>
          <div className="item-details">
            <h3>Car Tyre - Good Condition</h3>
            <p className="price">₹2,500</p>
            <p className="description">185/65R15 - Good tread depth, suitable for city driving</p>
            <button className="buy-btn">Contact Seller</button>
          </div>
        </div>

        <div className="item-card">
          <div className="item-image">
            <img src="/api/placeholder/300/200" alt="Motorcycle Tyre" />
          </div>
          <div className="item-details">
            <h3>Motorcycle Tyre Set</h3>
            <p className="price">₹1,800</p>
            <p className="description">Front and rear tyres for 150cc bikes</p>
            <button className="buy-btn">Contact Seller</button>
          </div>
        </div>

        <div className="item-card">
          <div className="item-image">
            <img src="/api/placeholder/300/200" alt="Truck Tyre" />
          </div>
          <div className="item-details">
            <h3>Heavy Vehicle Tyre</h3>
            <p className="price">₹8,500</p>
            <p className="description">Commercial grade, excellent for long hauls</p>
            <button className="buy-btn">Contact Seller</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tyre;
