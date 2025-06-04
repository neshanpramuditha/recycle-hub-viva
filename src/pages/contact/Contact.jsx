import React, { useState } from "react";
import {
  FaEnvelope,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaComment,
  FaHeadset,
} from "react-icons/fa";
import useTheme from "../../hooks/useTheme";
import "./Contact.css";

const Contact = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    const { email, name, phone, message } = formData;
    alert(
      `Contact Form Submitted Successfully!\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n` +
        `Message: ${message}\n\n` +
        `Thank you for reaching out to RecycleHub!`
    );
    
    // Reset form
    setFormData({
      email: "",
      name: "",
      phone: "",
      message: "",
    });
  };  return (
    <div className="contact-page">
      <div className="contact-container">
        {/* Header Section */}
        <header className="contact-header">
          <h1 className="contact-title">
            <FaHeadset style={{ marginRight: '1rem', color: '#28a745' }} />
            Contact Us
          </h1>
          <p className="contact-subtitle">
            Get in touch with our team. We'd love to hear from you and help with
            any questions about our sustainable marketplace.
          </p>
        </header>

        {/* Contact Form */}
        <div className="contact-form-card">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    <FaUser />
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <FaEnvelope />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    <FaPhone />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    <FaMapMarkerAlt />
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="form-control"
                    placeholder="Your city or region"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">
                <FaComment />
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="form-control"
                placeholder="Tell us how we can help you..."
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              <FaPaperPlane />
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="contact-info">
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <FaEnvelope />
              </div>
              <h3 className="contact-info-title">Email Us</h3>
              <p className="contact-info-text">
                <a href="mailto:info@recyclehub.com" className="contact-info-link">
                  info@recyclehub.com
                </a>
              </p>
              <p className="contact-info-text">
                <a href="mailto:support@recyclehub.com" className="contact-info-link">
                  support@recyclehub.com
                </a>
              </p>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <FaPhone />
              </div>
              <h3 className="contact-info-title">Call Us</h3>
              <p className="contact-info-text">
                <a href="tel:+1234567890" className="contact-info-link">
                  +1 (234) 567-8900
                </a>
              </p>
              <p className="contact-info-text">
                Mon - Fri: 9:00 AM - 6:00 PM
              </p>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <FaMapMarkerAlt />
              </div>
              <h3 className="contact-info-title">Visit Us</h3>
              <p className="contact-info-text">
                123 Green Street<br />
                Eco City, EC 12345<br />
                United States
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
