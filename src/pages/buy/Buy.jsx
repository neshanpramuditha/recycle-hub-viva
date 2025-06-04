import React, { useState } from "react";
import { FaShoppingBag, FaSearch, FaFilter, FaHeart } from "react-icons/fa";
import { MdLocationOn, MdPhone } from "react-icons/md";
import "./Buy.css";

export default function Buy() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceRange, setPriceRange] = useState("");

  // Mock data for items
  const [items] = useState([
    {
      id: 1,
      name: "Plastic Bottles (100 units)",
      category: "Plastic Items",
      price: 25,
      condition: "Good",
      location: "Downtown",
      contact: "+1234567890",
      image: "/src/assets/images/1.jpg",
      seller: "John Doe",
      description: "Clean plastic bottles, various sizes",
    },
    {
      id: 2,
      name: "Old Laptop (Working)",
      category: "Electronic Devices",
      price: 150,
      condition: "Fair",
      location: "Tech District",
      contact: "+1234567891",
      image: "/src/assets/images/4.jpg",
      seller: "Tech Recycler",
      description: "Dell laptop, good for parts or repair",
    },
    {
      id: 3,
      name: "Glass Jars (50 pieces)",
      category: "Glass Items",
      price: 15,
      condition: "Excellent",
      location: "City Center",
      contact: "+1234567892",
      image: "/src/assets/images/2.jpg",
      seller: "Green Kitchen",
      description: "Various sized glass jars, perfect condition",
    },
    {
      id: 4,
      name: "Textbooks Collection",
      category: "Books/Paper",
      price: 40,
      condition: "Good",
      location: "University Area",
      contact: "+1234567893",
      image: "/src/assets/images/6.jpg",
      seller: "Student Seller",
      description: "Engineering textbooks, 2019-2021 editions",
    },
    {
      id: 5,
      name: "Car Tyres (Set of 4)",
      category: "Tyres",
      price: 80,
      condition: "Good",
      location: "Auto District",
      contact: "+1234567894",
      image: "/src/assets/images/3.png",
      seller: "Auto Parts Store",
      description: "195/65/R15, good tread remaining",
    },
  ]);

  const categories = [
    "All",
    "Plastic Items",
    "Glass Items",
    "Electronic Devices",
    "Metal/Iron",
    "Books/Paper",
    "Tyres",
  ];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "" ||
      categoryFilter === "All" ||
      item.category === categoryFilter;
    const matchesPrice =
      priceRange === "" ||
      (priceRange === "low" && item.price < 30) ||
      (priceRange === "medium" && item.price >= 30 && item.price <= 100) ||
      (priceRange === "high" && item.price > 100);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleContactSeller = (contact) => {
    window.open(`tel:${contact}`, "_self");
  };

  return (
    <div className="buy-page">
      <div className="container py-5">
        {/* Header */}
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h1 className="display-4 mb-3">
              <FaShoppingBag className="me-3 text-primary" />
              Buy Recyclable Items
            </h1>
            <p className="lead text-muted">
              Find and purchase recyclable materials from verified sellers
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="form-control"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <select
              className="form-control"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((category, index) => (
                <option key={index} value={category === "All" ? "" : category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <select
              className="form-control"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="">All Prices</option>
              <option value="low">Under $30</option>
              <option value="medium">$30 - $100</option>
              <option value="high">Over $100</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="row mb-3">
          <div className="col-12">
            <p className="text-muted">
              <FaFilter className="me-2" />
              Showing {filteredItems.length} of {items.length} items
            </p>
          </div>
        </div>

        {/* Items Grid */}
        <div className="row">
          {filteredItems.map((item) => (
            <div key={item.id} className="col-lg-4 col-md-6 mb-4">
              <div className="item-card">
                <div className="item-image">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = "/src/assets/images/1.jpg";
                    }}
                  />
                  <div className="item-condition">
                    <span
                      className={`condition-badge ${item.condition.toLowerCase()}`}
                    >
                      {item.condition}
                    </span>
                  </div>
                  <button className="favorite-btn">
                    <FaHeart />
                  </button>
                </div>

                <div className="item-details">
                  <div className="item-category">{item.category}</div>
                  <h5 className="item-name">{item.name}</h5>
                  <p className="item-description">{item.description}</p>

                  <div className="item-meta">
                    <div className="seller-info">
                      <small className="text-muted">
                        Seller: {item.seller}
                      </small>
                    </div>
                    <div className="location-info">
                      <MdLocationOn className="me-1" />
                      <small>{item.location}</small>
                    </div>
                  </div>

                  <div className="item-footer">
                    <div className="price">
                      <span className="price-amount">${item.price}</span>
                    </div>
                    <button
                      className="btn btn-primary contact-btn"
                      onClick={() => handleContactSeller(item.contact)}
                    >
                      <MdPhone className="me-1" />
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="row">
            <div className="col-12 text-center py-5">
              <div className="no-results">
                <FaSearch className="no-results-icon mb-3" />
                <h4>No items found</h4>
                <p className="text-muted">
                  Try adjusting your search criteria or browse all categories
                </p>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("");
                    setPriceRange("");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
