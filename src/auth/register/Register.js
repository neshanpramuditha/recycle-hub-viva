import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import "./Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    city: "",
    nicNumber: "",
    bankName: "",
    accountNumber: "",
    branch: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const validateForm = () => {
    const { fullName, email, password, phoneNumber, nicNumber } = formData;
    
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    
    if (!phoneNumber.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    
    if (!nicNumber.trim()) {
      toast.error("Please enter your NIC number");
      return false;
    }
    
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await signUp(
        formData.email, 
        formData.password,
        {
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          address: formData.address,
          city: formData.city,
          nic_number: formData.nicNumber,
          bank_name: formData.bankName,
          account_number: formData.accountNumber,
          branch: formData.branch
        }
      );
      
      if (error) {
        if (error.message.includes('User already registered')) {
          toast.error('This email is already registered. Please try logging in instead.');
        } else if (error.message.includes('Password should be at least 6 characters')) {
          toast.error('Password must be at least 6 characters long.');
        } else {
          toast.error(error.message || 'Registration failed. Please try again.');
        }
        return;
      }

      toast.success("Account created successfully! Please check your email to confirm your account. 🎉", {
        duration: 6000,
        position: 'top-center',
      });
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: "",
        city: "",
        nicNumber: "",
        bankName: "",
        accountNumber: "",
        branch: ""
      });
      
      // Redirect to login page after success
      setTimeout(() => {
        navigate('/Login');
      }, 3000);
      
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast.error('Google signup failed. Please try again.');
        console.error('Google signup error:', error);
      }
      // Success handling is done by the auth state change listener
    } catch (error) {
      toast.error('An unexpected error occurred with Google signup.');
      console.error('Google signup error:', error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div>
      <Toaster />
      <div id="background-image-register">
        <div className="container-fluid py-5">
          <div className="row justify-content-center">
            <div
              className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4"
              id="second-div-register"
            >
              <div className="p-4">                <div className="text-center mb-4">
                  <span id="create-account-register">CREATE ACCOUNT</span>
                </div>

                <div className="mb-4">
                  <button
                    type="button"
                    className="btn btn-google w-100 mb-3"
                    onClick={handleGoogleSignup}
                    disabled={isGoogleLoading || isLoading}
                    style={{ 
                      backgroundColor: '#4285f4', 
                      color: 'white', 
                      border: 'none',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '500'
                    }}
                  >
                    {isGoogleLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing up with Google...
                      </>
                    ) : (
                      <>
                        <i className="fab fa-google me-2"></i>
                        Continue with Google
                      </>
                    )}
                  </button>
                </div>

                <div className="divider mb-4" style={{ 
                  textAlign: 'center', 
                  margin: '20px 0',
                  position: 'relative'
                }}>
                  <span style={{
                    backgroundColor: 'white',
                    padding: '0 15px',
                    color: '#666',
                    fontSize: '14px'
                  }}>or</span>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '0',
                    right: '0',
                    height: '1px',
                    backgroundColor: '#ddd',
                    zIndex: '-1'
                  }}></div>
                </div>

                <div className="mt-3">
                  <form onSubmit={handleSubmit}>
                    <label htmlFor="fullName">Full Name:</label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      className="form-control mb-3"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />

                    <label htmlFor="email">Email Address:</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-control mb-3"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />                    <label htmlFor="password">Password:</label>
                    <div className="input-group mb-3">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Password (min 6 characters)"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={togglePasswordVisibility}
                        style={{ borderColor: '#dee2e6' }}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>

                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      className="form-control mb-3"
                      placeholder="Phone Number"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />

                    <label htmlFor="address">Address:</label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      className="form-control mb-3"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />

                    <label htmlFor="city">City:</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      className="form-control mb-3"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                    />

                    <label htmlFor="nicNumber">NIC Number:</label>
                    <input
                      id="nicNumber"
                      name="nicNumber"
                      type="text"
                      className="form-control mb-4"
                      placeholder="NIC Number"
                      value={formData.nicNumber}
                      onChange={handleInputChange}
                      required
                    />

                    <div className="mb-3">
                      <span id="Banking-Information-register">Banking Information (Optional)</span>
                    </div>

                    <label htmlFor="bankName">Bank Name:</label>
                    <input
                      id="bankName"
                      name="bankName"
                      type="text"
                      className="form-control mb-3"
                      placeholder="Bank Name"
                      value={formData.bankName}
                      onChange={handleInputChange}
                    />

                    <label htmlFor="accountNumber">Account Number:</label>
                    <input
                      id="accountNumber"
                      name="accountNumber"
                      type="text"
                      className="form-control mb-3"
                      placeholder="Account Number"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                    />

                    <label htmlFor="branch">Branch:</label>
                    <input
                      id="branch"
                      name="branch"
                      type="text"
                      className="form-control mb-4"
                      placeholder="Branch Name"
                      value={formData.branch}
                      onChange={handleInputChange}
                    />                    <div className="text-center">                      <button
                        type="submit"
                        id="submit-register"
                        className="btn btn-success w-100"
                        disabled={isLoading || isGoogleLoading}
                        style={{ padding: '12px', fontSize: '16px', fontWeight: '600' }}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Creating Account...
                          </>
                        ) : (
                          'CREATE ACCOUNT'
                        )}
                      </button>
                    </div>                    <div className="text-center mt-3">
                      <p className="mb-0">
                        Already have an account?{' '}
                        <Link to="/Login" className="text-success fw-bold text-decoration-none">
                          Login here
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
