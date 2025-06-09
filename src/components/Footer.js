import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-block brand-block">
          <h3 className="brand-title">Recycle Hub</h3>
          <p className="brand-description">
            Your trusted marketplace for buying and selling quality used items.
            Reduce, reuse, recycle - together we make a difference.
          </p>
          <div className="social-media-links">
            <a href="#" className="social-icon" aria-label="Facebook">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              <i className="bi bi-twitter"></i>
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <i className="bi bi-linkedin"></i>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-block">
          <h4 className="block-title">Quick Links</h4>
          <ul className="link-list">
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/Buy" className="nav-link">
                Buy Items
              </Link>
            </li>
            <li>
              <Link to="/Sale" className="nav-link">
                Sell Items
              </Link>
            </li>
            <li>
              <Link to="/About" className="nav-link">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/Services" className="nav-link">
                Services
              </Link>
            </li>
            <li>
              <Link to="/Contact" className="nav-link">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-block">
          <h4 className="block-title">Categories</h4>
          <ul className="link-list">
            <li>
              <a href="#" className="nav-link">
                Electronics
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                Furniture
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                Clothing
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                Books
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                Sports
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                Home & Garden
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Support */}
        <div className="footer-block">
          <h4 className="block-title">Contact & Support</h4>
          <div className="contact-details">
            <div className="contact-row">
              <i className="bi bi-geo-alt"></i>
              <span>123 Recycle Street, Green City</span>
            </div>
            <div className="contact-row">
              <i className="bi bi-telephone"></i>
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="contact-row">
              <i className="bi bi-envelope"></i>
              <span>info@recyclehub.com</span>
            </div>
          </div>
          <div className="support-links">
            <a href="#" className="nav-link">
              Help Center
            </a>
            <a href="#" className="nav-link">
              Privacy Policy
            </a>
            <a href="#" className="nav-link">
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-base">
        <div className="footer-wrapper">
          <div className="base-content">
            <p>&copy; 2025 Recycle Hub. All rights reserved.</p>
            <div className="base-links">
              <a href="#" className="base-link">
                Privacy
              </a>
              <a href="#" className="base-link">
                Terms
              </a>
              <a href="#" className="base-link">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
