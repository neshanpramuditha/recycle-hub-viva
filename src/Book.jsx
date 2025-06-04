import React from 'react';
import './Buy.css'; // Reusing the Buy.css styles

const Book = () => {
  return (
    <div className="buy-container">
      <div className="buy-header">
        <h1>Buy Books</h1>
        <p>Find second-hand books at great prices</p>
      </div>
      
      <div className="item-grid">
        <div className="item-card">
          <div className="item-image">
            <img src="/api/placeholder/300/200" alt="Academic Books" />
          </div>
          <div className="item-details">
            <h3>Engineering Textbooks</h3>
            <p className="price">₹500 - ₹1,200</p>
            <p className="description">Computer Science, Mechanical, Civil engineering books</p>
            <button className="buy-btn">Contact Seller</button>
          </div>
        </div>

        <div className="item-card">
          <div className="item-image">
            <img src="/api/placeholder/300/200" alt="Novels" />
          </div>
          <div className="item-details">
            <h3>Fiction & Novels</h3>
            <p className="price">₹150 - ₹400</p>
            <p className="description">Popular fiction, mystery, romance novels</p>
            <button className="buy-btn">Contact Seller</button>
          </div>
        </div>

        <div className="item-card">
          <div className="item-image">
            <img src="/api/placeholder/300/200" alt="Children Books" />
          </div>
          <div className="item-details">
            <h3>Children's Books</h3>
            <p className="price">₹100 - ₹250</p>
            <p className="description">Educational and story books for kids</p>
            <button className="buy-btn">Contact Seller</button>
          </div>
        </div>

        <div className="item-card">
          <div className="item-image">
            <img src="/api/placeholder/300/200" alt="Competitive Exam Books" />
          </div>
          <div className="item-details">
            <h3>Competitive Exam Books</h3>
            <p className="price">₹300 - ₹800</p>
            <p className="description">JEE, NEET, UPSC, Banking exam preparation books</p>
            <button className="buy-btn">Contact Seller</button>
          </div>
        </div>

        <div className="item-card">
          <div className="item-image">
            <img src="/api/placeholder/300/200" alt="Reference Books" />
          </div>
          <div className="item-details">
            <h3>Reference Books</h3>
            <p className="price">₹200 - ₹600</p>
            <p className="description">Dictionaries, encyclopedias, technical manuals</p>
            <button className="buy-btn">Contact Seller</button>
          </div>
        </div>

        <div className="item-card">
          <div className="item-image">
            <img src="/api/placeholder/300/200" alt="Programming Books" />
          </div>
          <div className="item-details">
            <h3>Programming Books</h3>
            <p className="price">₹400 - ₹1,000</p>
            <p className="description">JavaScript, Python, Java, C++ programming guides</p>
            <button className="buy-btn">Contact Seller</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;
