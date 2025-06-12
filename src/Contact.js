import React, { useState } from "react";
import "./Contact.css";
import axios from "axios";
import toast from "react-hot-toast";

function Contact() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = (data) => {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
      errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
    }
    
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
    
    if (!data.message || data.message.trim().length < 10) {
      errors.push({ field: 'message', message: 'Message must be at least 10 characters long' });
    }
    
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const data = {
      first_name: formData.name.split(' ')[0] || formData.name,
      last_name: formData.name.split(' ').slice(1).join(' ') || '',
      user_email: formData.email,
      message: formData.message,
    };

    // Client-side validation
    const validationErrors = validateForm({
      name: formData.name,
      email: formData.email,
      message: formData.message
    });
    
    if (validationErrors.length > 0) {
      const errorMap = {};
      validationErrors.forEach((error) => {
        errorMap[error.field] = error.message;
      });
      setErrors(errorMap);
      setIsLoading(false);
      return;
    }

    // Show loading toast
    const toastId = toast.loading("Sending message...");

    try {
      const isDevelopment = import.meta.env.DEV;
      const apiUrl = isDevelopment
        ? "http://localhost:8080"
        : import.meta.env.VITE_WEB_URL;

      console.log("Using API URL:", apiUrl);

      const response = await axios.post(`${apiUrl}/send-email`, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      // Success
      toast.dismiss(toastId);
      toast.success("Message sent successfully!");

      // Reset form
      setFormData({
        email: "",
        name: "",
        message: "",
      });
      
    } catch (error) {
      console.error("Form submission error:", error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.details ||
        error.message ||
        "Failed to send message";

      toast.dismiss(toastId);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
            <form onSubmit={handleSubmit} className="contact-form">              <div className="form-row">
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
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
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
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
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
                  className={errors.message ? 'error' : ''}
                ></textarea>
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="contact-info-section">
            <div className="contact-info-card">
              <h3>Get in Touch</h3>
              <p>
                We'd love to hear from you. Send us a message and we'll respond
                as soon as possible.
              </p>

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
