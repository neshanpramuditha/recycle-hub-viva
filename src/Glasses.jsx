import React from 'react';
import './Services.css';

export default function Glasses() {
  return (
    <div className="container">
      <div className="glasses-container">
        <h1 id="Main-topic-glasses">Glasses & Eyewear</h1>
        <p>Find and sell glasses, sunglasses, and eyewear accessories.</p>
        
        <div className="items-grid">
          <div className="item-card">
            <h3>Reading Glasses</h3>
            <p>Pre-owned reading glasses in good condition</p>
          </div>
          
          <div className="item-card">
            <h3>Sunglasses</h3>
            <p>Designer and regular sunglasses</p>
          </div>
          
          <div className="item-card">
            <h3>Safety Glasses</h3>
            <p>Protective eyewear for work and sports</p>
          </div>
        </div>
      </div>
    </div>
  );
}
