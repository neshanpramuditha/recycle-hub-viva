import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaRecycle,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHome,
  FaInfoCircle,
  FaCogs,
  FaShoppingCart,
  FaLeaf,
  FaHandshake,
  FaUsers,
  FaGlobe,
  FaHeart,
  FaExternalLinkAlt
} from 'react-icons/fa';
import useTheme from '../../hooks/useTheme';
import './footer.css';

const Footer = () => {
  const { isDarkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`site-footer ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="footer-content">
        {/* Main Footer Content */}
        <div className="container">
          <div className="row">
            {/* Brand Section */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="footer-brand">
                <div className="brand-logo">
                  <FaRecycle className="brand-icon" />
                  <h3 className="brand-name">Recycle Hub</h3>
                </div>
                <p className="brand-description">
                  Your trusted marketplace for buying and selling second-hand items. 
                  Join our community in promoting sustainability and circular economy 
                  through conscious consumption.
                </p>
                <div className="social-links">
                  <a href="#" className="social-link" aria-label="Facebook">
                    <FaFacebookF />
                  </a>
                  <a href="#" className="social-link" aria-label="Twitter">
                    <FaTwitter />
                  </a>
                  <a href="#" className="social-link" aria-label="Instagram">
                    <FaInstagram />
                  </a>
                  <a href="#" className="social-link" aria-label="LinkedIn">
                    <FaLinkedinIn />
                  </a>
                  <a href="#" className="social-link" aria-label="GitHub">
                    <FaGithub />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6 mb-4">
              <div className="footer-section">
                <h4 className="footer-title">Quick Links</h4>
                <ul className="footer-links">
                  <li>
                    <Link to="/" className="footer-link">
                      <FaHome className="link-icon" />
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="footer-link">
                      <FaInfoCircle className="link-icon" />
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/services" className="footer-link">
                      <FaCogs className="link-icon" />
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link to="/buy-and-sale" className="footer-link">
                      <FaShoppingCart className="link-icon" />
                      Buy & Sale
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="footer-link">
                      <FaEnvelope className="link-icon" />
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Categories */}
            <div className="col-lg-2 col-md-6 mb-4">
              <div className="footer-section">
                <h4 className="footer-title">Categories</h4>
                <ul className="footer-links">
                  <li>
                    <Link to="/plastic-item" className="footer-link">
                      <FaRecycle className="link-icon" />
                      Plastic Items
                    </Link>
                  </li>
                  <li>
                    <Link to="/glasses" className="footer-link">
                      <FaLeaf className="link-icon" />
                      Glasses
                    </Link>
                  </li>
                  <li>
                    <Link to="/tyre" className="footer-link">
                      <FaHandshake className="link-icon" />
                      Tyres
                    </Link>
                  </li>
                  <li>
                    <Link to="/electronic-device" className="footer-link">
                      <FaCogs className="link-icon" />
                      Electronics
                    </Link>
                  </li>
                  <li>
                    <Link to="/book" className="footer-link">
                      <FaUsers className="link-icon" />
                      Books
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="footer-section">
                <h4 className="footer-title">Get In Touch</h4>
                <div className="contact-info">
                  <div className="contact-item">
                    <FaMapMarkerAlt className="contact-icon" />
                    <div className="contact-details">
                      <strong>Address</strong>
                      <p>123 Green Street, Eco City, EC 12345</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <FaPhone className="contact-icon" />
                    <div className="contact-details">
                      <strong>Phone</strong>
                      <p>+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <FaEnvelope className="contact-icon" />
                    <div className="contact-details">
                      <strong>Email</strong>
                      <p>info@recyclehub.com</p>
                    </div>
                  </div>
                </div>
                <div className="sustainability-badge">
                  <FaLeaf className="sustainability-icon" />
                  <span>Committed to Sustainability</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="row">
            <div className="col-12">
              <div className="mission-section">
                <div className="mission-content">
                  <FaGlobe className="mission-icon" />
                  <div className="mission-text">
                    <h5>Our Mission</h5>
                    <p>
                      Empowering sustainable living through accessible second-hand marketplace 
                      solutions that reduce waste, promote circular economy, and build stronger communities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="copyright">
                <p>
                  &copy; {currentYear} Recycle Hub. Made with{' '}
                  <FaHeart className="heart-icon" />{' '}
                  for a sustainable future.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="footer-bottom-links">
                <a href="#" className="bottom-link">Privacy Policy</a>
                <span className="separator">|</span>
                <a href="#" className="bottom-link">Terms of Service</a>
                <span className="separator">|</span>
                <a href="#" className="bottom-link">
                  <FaExternalLinkAlt className="external-icon" />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;