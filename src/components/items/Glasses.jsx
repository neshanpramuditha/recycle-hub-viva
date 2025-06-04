import React, { useState } from 'react';
import { FaLightbulb, FaGlasses } from 'react-icons/fa';
import { MdClear } from 'react-icons/md';
import '../items/PlasticItem.css';

export default function Glasses() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [itemName, setItemName] = useState('');
  const [count, setCount] = useState(0);
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleNumberClick = (number) => {
    setCount(prev => prev + number);
  };

  const clearCount = () => {
    setCount(0);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (itemName && count > 0 && contact && location) {
      setIsSubmitted(true);
    } else {
      alert('Please fill in all required fields');
    }
  };

  const resetForm = () => {
    setItemName('');
    setCount(0);
    setContact('');
    setLocation('');
    setMessage('');
    setIsSubmitted(false);
    setSelectedImage(null);
  };

  return (
    <div className={`plastic-item-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-6">
            <div className="form-section">
              <div className="header-section text-center mb-4">
                <button 
                  className="theme-toggle btn btn-outline-warning me-3"
                  onClick={toggleTheme}
                >
                  <FaLightbulb />
                </button>
                <h2>
                  <FaGlasses className="me-2 text-primary" />
                  Glass Item Information
                </h2>
              </div>

              <div className="mb-3">
                <label className="form-label">Item Name:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter glass item name (bottles, windows, etc.)"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </div>

              <div className="calculator-section mb-4">
                <h5>Count of Glass Items</h5>
                <div className="count-display mb-3">
                  <span className="count-value">{count}</span>
                </div>
                
                <div className="number-grid">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                      key={num}
                      className="btn btn-outline-primary num-btn"
                      onClick={() => handleNumberClick(num)}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    className="btn btn-outline-danger num-btn"
                    onClick={clearCount}
                  >
                    <MdClear />
                  </button>
                  <button
                    className="btn btn-outline-primary num-btn"
                    onClick={() => handleNumberClick(0)}
                  >
                    0
                  </button>
                  <button
                    className="btn btn-outline-success num-btn"
                    onClick={() => setCount(prev => prev + 10)}
                  >
                    +10
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Upload Image:</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="preview-image mt-2"
                    style={{ maxWidth: '200px', height: 'auto' }}
                  />
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Contact Number:</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Enter contact number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Location:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Message:</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Condition of glass items, type of glass..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                className="btn btn-success w-100"
                onClick={handleSubmit}
              >
                Submit Glass Items
              </button>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="preview-section">
              <img
                src="/src/assets/images/glass-recycling.jpg"
                alt="Glass recycling"
                className="hero-image mb-4"
                onError={(e) => {
                  e.target.src = '/src/assets/images/2.jpg';
                }}
              />

              <div className="card info-card">
                <div className="card-body">
                  <h5 className="card-title">
                    <FaGlasses className="me-2 text-primary" />
                    Glass Item Summary
                  </h5>
                  {isSubmitted ? (
                    <ul className="list-unstyled">
                      <li><strong>Item Name:</strong> {itemName}</li>
                      <li><strong>Count:</strong> {count}</li>
                      <li><strong>Contact:</strong> {contact}</li>
                      <li><strong>Location:</strong> {location}</li>
                      {message && <li><strong>Message:</strong> {message}</li>}
                    </ul>
                  ) : (
                    <div>
                      <p className="text-muted">Fill out the form to see your glass item summary</p>
                      <small className="text-info">
                        💡 Glass recycling tip: Separate by color (clear, brown, green) for better recycling efficiency!
                      </small>
                    </div>
                  )}
                  
                  {isSubmitted && (
                    <button
                      className="btn btn-primary mt-3"
                      onClick={resetForm}
                    >
                      Submit Another Glass Item
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
