import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaRecycle,
  FaLeaf,
  FaShoppingCart,
  FaGlasses,
  FaTruck,
  FaStar,
  FaCheckCircle,
  FaArrowRight,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUsers,
  FaShieldAlt,
  FaClock,
  FaHandshake,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import {
  MdRecycling,
  MdLocalShipping,
  MdVerifiedUser,
  MdEco,
  MdBusiness,
  MdHome,
} from "react-icons/md";
import "./Features.css";

// Import images using ES6 imports
import plasticImage from "/image/2.jpg";
import glassesImage from "/image/5.png";
import tyresImage from "/image/6.jpg";
import electronicsImage from "/image/8.jpg";
import useTheme from "../../../hooks/useTheme";

const Features = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("individual");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const services = [
    {
      id: 1,
      title: "Plastic Items",
      image: plasticImage,
      link: "/plastic-item",
      icon: <FaRecycle />,
      description:
        "Comprehensive plastic waste management and recycling solutions",
      price: "Starting at $25",
    },
    {
      id: 2,
      title: "Glass Materials",
      image: glassesImage,
      link: "/glasses",
      icon: <FaGlasses />,
      description: "Professional glass collection and processing services",
      price: "Starting at $30",
    },
    {
      id: 3,
      title: "Tire Recycling",
      image: tyresImage,
      link: "/tyre",
      icon: <FaTruck />,
      description: "Safe and eco-friendly tire disposal and recycling",
      price: "Starting at $15",
    },
    {
      id: 4,
      title: "Electronic Devices",
      image: electronicsImage,
      link: "/electronic-device",
      icon: <FaLeaf />,
      description: "Secure e-waste management and component recovery",
      price: "Starting at $50",
    },
  ];

  const features = [
    {
      icon: <MdRecycling />,
      title: "Eco-Friendly Process",
      description: "100% environmentally responsible recycling methods",
    },
    {
      icon: <MdLocalShipping />,
      title: "Free Pickup Service",
      description: "Convenient collection from your location",
    },
    {
      icon: <MdVerifiedUser />,
      title: "Certified Processing",
      description: "Licensed and certified recycling facilities",
    },
    {
      icon: <FaShieldAlt />,
      title: "Data Security",
      description: "Secure destruction of sensitive electronic data",
    },
  ];

  const pricingPlans = [
    {
      type: "Basic",
      price: "$29",
      period: "/pickup",
      features: [
        "Up to 50 lbs of materials",
        "Standard processing time",
        "Basic sorting service",
        "Email notifications",
      ],
      popular: false,
    },
    {
      type: "Professional",
      price: "$79",
      period: "/pickup",
      features: [
        "Up to 200 lbs of materials",
        "Priority processing",
        "Advanced sorting & cleaning",
        "Real-time tracking",
        "Certificate of recycling",
      ],
      popular: true,
    },
    {
      type: "Enterprise",
      price: "Custom",
      period: "/month",
      features: [
        "Unlimited material volume",
        "Same-day pickup available",
        "Complete waste audit",
        "Dedicated account manager",
        "Custom reporting dashboard",
      ],
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      rating: 5,
      comment:
        "Excellent service! They picked up all my old electronics and provided a detailed report of the recycling process.",
    },
    {
      name: "Mike Chen",
      role: "Small Business Owner",
      rating: 5,
      comment:
        "Very professional team. They helped us implement a comprehensive recycling program for our office.",
    },
    {
      name: "Emma Davis",
      role: "Property Manager",
      rating: 5,
      comment:
        "Reliable and efficient service. They handle all our building's recycling needs with complete transparency.",
    },
  ];

  const faqs = [
    {
      question: "What types of materials do you accept?",
      answer:
        "We accept a wide range of recyclable materials including plastics, glass, electronics, metals, and paper products. For specific items, please check our material categories or contact us directly.",
    },
    {
      question: "How does the pickup service work?",
      answer:
        "Simply schedule a pickup through our website or app, prepare your materials according to our guidelines, and our team will collect them at your specified time. We provide confirmation and tracking for all pickups.",
    },
    {
      question: "Do you provide certificates of recycling?",
      answer:
        "Yes, we provide detailed certificates of recycling for all processed materials, especially important for businesses requiring compliance documentation.",
    },
    {
      question: "What are your operating hours?",
      answer:
        "We operate Monday through Saturday, 8 AM to 6 PM. Emergency and after-hours services are available for enterprise customers.",
    },
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div id="background" className={isDarkMode ? "dark-mode" : ""}>
      <div className="services-container">
        {" "}
        <div className="services-header">
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

export default Features;
