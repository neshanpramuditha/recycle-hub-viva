import React, { useState } from "react";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.name || !formData.message) {
      alert("Please fill in all fields");
      return;
    }
    alert(
      `Your Email Address: ${formData.email}\nYour Name: ${formData.name}\nYour Message: ${formData.message}`
    );
  };

  return (
    <div className="contact-page">
      <div className="container">
        {/* Header Section */}
        <div className="contact-header">
          <h1 className="contact-title">CONTACT US</h1>
          <p className="contact-subtitle">
            Any questions or remarks? Just write us a message!
          </p>
        </div>

        {/* Main Content */}
        <div className="contact-content">
          {/* Contact Form */}
          <div className="contact-form-section">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your Email Address"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your Name"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Type your message here"
                  rows="6"
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="contact-info-section">
            <div className="contact-info-card">
              <h3>Get in Touch</h3>
              <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="contact-icon">
                    <i className="bi bi-facebook"></i>
                  </div>
                  <div className="contact-details">
                    <h4>Facebook</h4>
                    <p>www.facebook.com/Recycle Hub</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="contact-icon">
                    <i className="bi bi-whatsapp"></i>
                  </div>
                  <div className="contact-details">
                    <h4>WhatsApp</h4>
                    <p>0777659081 / 0761426573</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="contact-icon">
                    <i className="bi bi-telephone"></i>
                  </div>
                  <div className="contact-details">
                    <h4>Phone (Land Line)</h4>
                    <p>0119087631 / 0112438965</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
