import React from 'react';
import './Services.css';

export default function Plastic_Item() {
  return (
    <div className="container">
      <div className="plastic-item-container">
        <h1 id="Main-topic-plastic">Plastic Items</h1>
        <p>Find and sell plastic items here. Help the environment by recycling plastic products.</p>
        
        <div className="items-grid">
          <div className="item-card">
            <h3>Plastic Bottles</h3>
            <p>Clean plastic bottles for recycling</p>
          </div>
          
          <div className="item-card">
            <h3>Plastic Containers</h3>
            <p>Food containers and storage boxes</p>
          </div>
          
          <div className="item-card">
            <h3>Plastic Bags</h3>
            <p>Shopping bags and packaging materials</p>
          </div>
        </div>
      </div>
    </div>
  );
}
