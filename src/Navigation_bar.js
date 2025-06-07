import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import "./Navigation_bar.css";

export default function Navigation_bar() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <div>
      <nav className="navbar navbar-dark bg-success navbar-expand-lg fixed-top">
        <Link to="/" className="navbar-brand" id="Recycle_Hub">
          Recycle Hub
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#toggle"
          aria-controls="toggle"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-center"
          id="toggle"
        >
          <ul className="navbar-nav">
            <div className="nav-links-center">
              <li className="nav-item">
                <Link to="/" className="nav-link active" id="link1">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/About" className="nav-link active" id="link2">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Services" className="nav-link active" id="link3">
                  Services
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Buy_And_Sale" className="nav-link active" id="link4">
                  Buy & Sale
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Contact" className="nav-link active" id="link5">
                  Contact
                </Link>
              </li>            </div>            {user ? (
              <div className="d-flex align-items-center">
                <li className="nav-item me-3">
                  <Link to="/Dashboard" className="nav-link text-white">
                    <i className="fas fa-tachometer-alt me-1"></i>
                    Dashboard
                  </Link>
                </li>
                <span className="navbar-text me-3 text-white">
                  Welcome, {user.user_metadata?.full_name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light btn-sm"
                  style={{ marginRight: '10px' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="d-flex">
                <li className="nav-item me-2">
                  <Link
                    to="/Login"
                    className="btn btn-outline-light nav-link"
                    style={{ padding: '8px 16px' }}
                  >
                    LOGIN
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/Register"
                    type="button"
                    className="btn btn-dark nav-link"
                    id="signup_button"
                  >
                    <b>SIGN UP</b>
                  </Link>
                </li>
              </div>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}
