import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaIdCard,
  FaUniversity,
  FaCreditCard,
  FaCodeBranch,
  FaUserPlus,
  FaCheckCircle,
} from "react-icons/fa";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    city: "",
    nicNumber: "",
    bankName: "",
    accountNumber: "",
    branch: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.nicNumber.trim()) {
      newErrors.nicNumber = "NIC number is required";
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = "Bank name is required";
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required";
    }

    if (!formData.branch.trim()) {
      newErrors.branch = "Branch is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success message
      alert(
        `Registration Successful!\n\nAccount Details:\nFull Name: ${formData.fullName}\nEmail: ${formData.email}\nPhone: ${formData.phoneNumber}\nAddress: ${formData.address}\nCity: ${formData.city}\nNIC: ${formData.nicNumber}\nBank: ${formData.bankName}\nAccount: ${formData.accountNumber}\nBranch: ${formData.branch}\n\nThank you for joining Recycle Hub!`
      );

      // Navigate to sale page
      navigate("/sale");
    } catch (error) {
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="background-image-register">
      <div className="row">
        <div className="col-12 col-md-6 col-lg-4 mx-auto">
          <div id="second-div-register">
            <br />
            <div className="text-center mb-4">
              <FaUserPlus className="register-icon mb-3" />
              <h2 id="create-account-register">CREATE ACCOUNT</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">
                  <FaUser className="me-2" />
                  Full Name:
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className={`form-control ${
                    errors.fullName ? "is-invalid" : ""
                  }`}
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                {errors.fullName && (
                  <div className="invalid-feedback">{errors.fullName}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  <FaEnvelope className="me-2" />
                  Email Address:
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  <FaLock className="me-2" />
                  Password:
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  <FaLock className="me-2" />
                  Confirm Password:
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className={`form-control ${
                    errors.confirmPassword ? "is-invalid" : ""
                  }`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label">
                  <FaPhone className="me-2" />
                  Phone Number:
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  className={`form-control ${
                    errors.phoneNumber ? "is-invalid" : ""
                  }`}
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
                {errors.phoneNumber && (
                  <div className="invalid-feedback">{errors.phoneNumber}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  <FaMapMarkerAlt className="me-2" />
                  Address:
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className={`form-control ${
                    errors.address ? "is-invalid" : ""
                  }`}
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                {errors.address && (
                  <div className="invalid-feedback">{errors.address}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="city" className="form-label">
                  <FaCity className="me-2" />
                  City:
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  className={`form-control ${errors.city ? "is-invalid" : ""}`}
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
                {errors.city && (
                  <div className="invalid-feedback">{errors.city}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="nicNumber" className="form-label">
                  <FaIdCard className="me-2" />
                  NIC Number:
                </label>
                <input
                  id="nicNumber"
                  name="nicNumber"
                  type="text"
                  className={`form-control ${
                    errors.nicNumber ? "is-invalid" : ""
                  }`}
                  placeholder="Enter your NIC number"
                  value={formData.nicNumber}
                  onChange={handleInputChange}
                />
                {errors.nicNumber && (
                  <div className="invalid-feedback">{errors.nicNumber}</div>
                )}
              </div>

              <div className="banking-section mb-4">
                <h5 id="Banking-Information-register" className="mb-3">
                  <FaUniversity className="me-2" />
                  Banking Information
                </h5>

                <div className="mb-3">
                  <label htmlFor="bankName" className="form-label">
                    <FaUniversity className="me-2" />
                    Bank Name:
                  </label>
                  <input
                    id="bankName"
                    name="bankName"
                    type="text"
                    className={`form-control ${
                      errors.bankName ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your bank name"
                    value={formData.bankName}
                    onChange={handleInputChange}
                  />
                  {errors.bankName && (
                    <div className="invalid-feedback">{errors.bankName}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="accountNumber" className="form-label">
                    <FaCreditCard className="me-2" />
                    Account Number:
                  </label>
                  <input
                    id="accountNumber"
                    name="accountNumber"
                    type="text"
                    className={`form-control ${
                      errors.accountNumber ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your account number"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                  />
                  {errors.accountNumber && (
                    <div className="invalid-feedback">
                      {errors.accountNumber}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="branch" className="form-label">
                    <FaCodeBranch className="me-2" />
                    Branch:
                  </label>
                  <input
                    id="branch"
                    name="branch"
                    type="text"
                    className={`form-control ${
                      errors.branch ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your branch name"
                    value={formData.branch}
                    onChange={handleInputChange}
                  />
                  {errors.branch && (
                    <div className="invalid-feedback">{errors.branch}</div>
                  )}
                </div>
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-success btn-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="me-2" />
                      Create Account
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
