import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaCogs,
  FaShoppingCart,
  FaPhone,
  FaRecycle,
} from "react-icons/fa";
import { ThemeToggle } from "../../components";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Close mobile menu when clicking on a nav link
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar navbar-dark bg-success navbar-expand-lg fixed-top">
      <div className="container-fluid">
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center"
          id="Recycle_Hub"
        >
          <FaRecycle className="me-2" />
          Recycle Hub
        </Link>{" "}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav mx-auto">
            {" "}
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link d-flex align-items-center ${
                  isActive("/") ? "active" : ""
                }`}
                id="link1"
                onClick={handleNavClick}
              >
                <FaHome className="me-2" />
                <span>Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/about"
                className={`nav-link d-flex align-items-center ${
                  isActive("/about") ? "active" : ""
                }`}
                id="link2"
                onClick={handleNavClick}
              >
                <FaInfoCircle className="me-2" />
                <span>About</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/services"
                className={`nav-link d-flex align-items-center ${
                  isActive("/services") ? "active" : ""
                }`}
                id="link3"
                onClick={handleNavClick}
              >
                <FaCogs className="me-2" />
                <span>Services</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/buy-and-sale"
                className={`nav-link d-flex align-items-center ${
                  isActive("/buy-and-sale") ? "active" : ""
                }`}
                id="link4"
                onClick={handleNavClick}
              >
                <FaShoppingCart className="me-2" />
                <span>Buy & Sale</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/contact"
                className={`nav-link d-flex align-items-center ${
                  isActive("/contact") ? "active" : ""
                }`}
                id="link4"
                onClick={handleNavClick}
              >
                <FaPhone className="me-2" />
                <span>Contact</span>
              </Link>
            </li>{" "}
          </ul>
          <div className="d-flex align-items-center gap-2">
            <ThemeToggle size="small" />
            <Link
              to="/contact"
              className="btn btn-dark nav-link d-flex align-items-center"
              id="contact_button"
              onClick={handleNavClick}
            >
              <span>
                <b>CONTACT</b>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
