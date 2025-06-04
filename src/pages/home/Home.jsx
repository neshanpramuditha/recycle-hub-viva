import React from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaRecycle } from 'react-icons/fa';
import Services from '../services/Services';
import './Home.css';

const Home = () => {
  return (
    <div>
      <div id="background_image">
        <div className="container-fluid">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-12">
              <div className="hero-content text-center">
                <h1 id="Recycle_Hub_home" className="display-1 fw-bold mb-4">
                  <FaRecycle className="me-3" />
                  Recycle Hub
                </h1>
                <p id="Buy_and_Sell_home" className="lead mb-5">
                  Buy & Sell Second-Hand Items Easily
                </p>
                <Link 
                  to="/services" 
                  className="btn btn-success btn-lg" 
                  id="button_home"
                >
                  <FaEye className="me-2" />
                  VIEW SERVICES
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Services />
    </div>
  );
};

export default Home;
