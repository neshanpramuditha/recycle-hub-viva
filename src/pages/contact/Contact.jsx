import React, { useState } from "react";
import {
  FaMoon,
  FaSun,
  FaEnvelope,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaComment,
} from "react-icons/fa";
import "./Contact.css";

const Contact = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    message: "",
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.style.backgroundColor = "#01002E";
    } else {
      document.body.style.backgroundColor = "white";
    }
  };

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
      `Contact Form Submitted:\n` +
        `Email: ${email}\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Message: ${message}`
    );
  };

  return (
    <div id="background" className={isDarkMode ? "dark-mode" : ""}>
      <div className="container">
        <div className="row">
          <div className="col-12 mt-5">
            <br />
            <br />
            <button
              onClick={toggleDarkMode}
              className="btn btn-link p-0 me-3"
              id="light_contact"
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            <span id="Main-topic-contact">CONTACT US</span>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className="form-label"
                      id="Email-contact"
                    >
                      <FaEnvelope className="me-2" />
                      Email:
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Enter your Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label
                      htmlFor="name"
                      className="form-label"
                      id="name-contact"
                    >
                      <FaUser className="me-2" />
                      Name:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="Enter your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      <FaPhone className="me-2" />
                      Phone:
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      placeholder="Enter your Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="location" className="form-label">
                      <FaMapMarkerAlt className="me-2" />
                      Location:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="location"
                      placeholder="Your Location (Optional)"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  <FaComment className="me-2" />
                  Message:
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Enter your message here..."
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-success btn-lg">
                  <FaPaperPlane className="me-2" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
