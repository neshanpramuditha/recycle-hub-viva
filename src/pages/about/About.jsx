import React from "react";
import {
  FaRecycle,
  FaLeaf,
  FaGlobe,
  FaUsers,
  FaHandshake,
  FaHeart,
  FaLightbulb,
  FaShoppingCart,
  FaTrophy
} from "react-icons/fa";
import useTheme from "../../hooks/useTheme";
import aboutImage from "/image/3.png";
import "./About.css";

export default function About() {
  const { isDarkMode } = useTheme();

  const features = [
    {
      icon: <FaRecycle />,
      title: "Waste Reduction",
      description: "Effective tools for reducing, reusing, and recycling waste through our comprehensive platform."
    },
    {
      icon: <FaShoppingCart />,
      title: "Second-Hand Marketplace",
      description: "Buy, sell, and donate items to promote a circular economy and reduce environmental impact."
    },
    {
      icon: <FaUsers />,
      title: "Community Engagement",
      description: "Connect with like-minded individuals and participate in recycling challenges together."
    },
    {
      icon: <FaTrophy />,
      title: "Gamification",
      description: "Track your progress, earn rewards, and compete in sustainability challenges."
    },
    {
      icon: <FaGlobe />,
      title: "Environmental Impact",
      description: "Make a real difference by contributing to global sustainability efforts."
    },
    {
      icon: <FaLightbulb />,
      title: "Education & Resources",
      description: "Access guides, tips, and resources for effective waste management and recycling."
    }
  ];

  return (
    <div className="">
      <div className="about-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="main-title">About RecycleHub</h1>
              <p className="hero-subtitle">
                Your comprehensive platform for sustainable living and circular economy
              </p>
              <p className="hero-description">
                We're dedicated to promoting effective waste reduction, reuse, and recycling 
                through innovative tools, community engagement, and educational resources.
              </p>
            </div>
            <div className="hero-image">
              <img src={aboutImage} alt="About RecycleHub" />
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mission-section">
          <h2 className="section-title">Our Mission</h2>
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">
                <FaRecycle />
              </div>
              <h3>Promote Effective Waste Management</h3>
              <p>
                Educate and empower users to reduce, reuse, and recycle waste effectively 
                through comprehensive tools and resources.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">
                <FaHandshake />
              </div>
              <h3>Foster Circular Economy</h3>
              <p>
                Create a thriving marketplace and community that encourages sustainable 
                buying, selling, and sharing practices.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">
                <FaHeart />
              </div>
              <h3>Drive Behavioral Change</h3>
              <p>
                Motivate sustainable habits through gamification, convenience, and 
                community-driven initiatives.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2 className="section-title">What We Offer</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Section */}
        <div className="impact-section">
          <h2 className="section-title">Our Impact</h2>
          <div className="impact-stats">
            <div className="stat-card">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Items Recycled</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">5K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Partner Centers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">25%</div>
              <div className="stat-label">Waste Reduced</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
