import React from "react";
import { Link } from "react-router-dom";
import {
  FaRecycle,
  FaLeaf,
  FaShoppingCart,
  FaGlasses,
  FaTruck,
} from "react-icons/fa";
import useTheme from "../../hooks/useTheme";
import "./Services.css";

// Import images using ES6 imports
import plasticImage from "/image/2.jpg";
import glassesImage from "/image/5.png";
import tyresImage from "/image/6.jpg";
import electronicsImage from "/image/8.jpg";

const Services = () => {
  const { isDarkMode } = useTheme();

  const services = [
    {
      id: 1,
      title: "Plastic Items",
      image: plasticImage,
      link: "/plastic-item",
      icon: <FaRecycle />,
    },
    {
      id: 2,
      title: "Glasses",
      image: glassesImage,
      link: "/glasses",
      icon: <FaGlasses />,
    },
    {
      id: 3,
      title: "Tyres",
      image: tyresImage,
      link: "/tyre",
      icon: <FaTruck />,
    },
    {
      id: 4,
      title: "Electronic Devices",
      image: electronicsImage,
      link: "/electronic-device",
      icon: <FaLeaf />,
    },
  ];

  return (
    <div id="background" className={isDarkMode ? "dark-mode" : ""}>
      <div className="services-container">        <div className="services-header">
          <div className="header-content">
            <h1 className="main-title">
              <b>Classic Collectors Hub</b>
            </h1>
          </div>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card-wrapper">
              <div className="service-card">
                <div className="card-image-container">
                  <img
                    className="card-image"
                    src={service.image}
                    alt={service.title}
                  />
                  <div className="card-overlay">
                    <div className="card-icon">{service.icon}</div>
                  </div>
                </div>
                <div className="card-content">
                  <h3 className="card-title">{service.title}</h3>
                  <Link to={service.link} className="card-button">
                    <FaShoppingCart className="button-icon" />
                    VIEW ITEMS
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
