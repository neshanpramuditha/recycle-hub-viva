import React from "react";
import "./About.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function About() {
  return (
    <div className="about-page">
      <div id="background_about">
        {/* Header Section */}
        <div className="row">
          <div className="col-12">
            <div className="header-section">
              <div className="hero-content">
                <h1 className="hero-title">
                  Your <span className="accent-text">second-hand</span>{" "}
                  marketplace
                </h1>
                <p className="hero-subtitle">
                  Building a sustainable future through conscious consumption
                  and recycling
                </p>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* Features Section */}
        <div className="features-section">
          <div className="row align-items-center">
            <div className="col-12 col-lg-5 col-xl-4">
              <div className="image-container">
                <img
                  id="image_about"
                  src="/image/3.png"
                  alt="Recycle Hub Marketplace"
                  className="img-fluid main-image"
                />
                <div className="image-overlay"></div>
              </div>
            </div>

            <div className="col-12 col-lg-7 col-xl-8">
              <div className="content-wrapper">
                {/* Mission Card 1 */}
                <div className="mission-card">
                  <div className="card-icon">
                    <i className="bi bi-recycle"></i>
                  </div>
                  <h3 className="card-title">
                    Promote Effective Waste Reduction, Reuse, and Recycling
                  </h3>
                  <div className="card-content">
                    <div className="objective-item">
                      <i className="bi bi-check-circle-fill"></i>
                      <p>
                        Educate and empower users to reduce, reuse, and recycle
                        waste effectively through our Waste Sorting Guide,
                        Upcycling & Repair Hub, and Local Recycling Center
                        Locator.
                      </p>
                    </div>
                    <div className="objective-item outcome">
                      <i className="bi bi-graph-up-arrow"></i>
                      <p>
                        <strong>Expected Outcome:</strong> Significant reduction
                        in waste sent to landfills and increased recycling rates
                        through proper waste sorting and upcycling initiatives.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mission Card 2 */}
                <div className="mission-card">
                  <div className="card-icon">
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <h3 className="card-title">
                    Foster a Circular Economy Through Community Engagement
                  </h3>
                  <div className="card-content">
                    <div className="objective-item">
                      <i className="bi bi-check-circle-fill"></i>
                      <p>
                        Create a thriving Second-Hand Marketplace and Community
                        Challenges that encourage buying, selling, and donating
                        second-hand items while building connections with
                        like-minded individuals and businesses.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mission Card 3 */}
                <div className="mission-card">
                  <div className="card-icon">
                    <i className="bi bi-trophy-fill"></i>
                  </div>
                  <h3 className="card-title">
                    Drive Behavioral Change Through Gamification
                  </h3>
                  <div className="card-content">
                    <div className="objective-item">
                      <i className="bi bi-check-circle-fill"></i>
                      <p>
                        Motivate sustainable habits through our Waste Tracker &
                        Gamification features, including progress tracking,
                        rewards system, and community challenges, while making
                        recycling convenient through our comprehensive location
                        services.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="row stats-section">
            <div className="col-12">
              <div className="stats-container">
                <div className="stat-item">
                  <i className="bi bi-globe"></i>
                  <h4>1M+</h4>
                  <p>Items Recycled</p>
                </div>
                <div className="stat-item">
                  <i className="bi bi-people"></i>
                  <h4>50K+</h4>
                  <p>Active Users</p>
                </div>
                <div className="stat-item">
                  <i className="bi bi-tree"></i>
                  <h4>75%</h4>
                  <p>Waste Reduction</p>
                </div>
                <div className="stat-item">
                  <i className="bi bi-award"></i>
                  <h4>500+</h4>
                  <p>Communities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
