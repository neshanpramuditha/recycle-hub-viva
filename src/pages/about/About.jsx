import React from "react";
import {
  FaRecycle,
  FaLeaf,
  FaGlobe,
  FaUsers,
  FaHandshake,
  FaHeart,
} from "react-icons/fa";
import useTheme from "../../hooks/useTheme";
import aboutImage from "/image/3.png";
import "./About.css";

export default function About() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`about-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="about-container">
        <div className="row">
          <div className="col-12">
            <span id="Your_second_hand_marketplace_about">
              Your second-hand marketplace.
            </span>
          </div>
        </div>

        <div className="row">
          <div className="col-es-12 col-sm-12 col-md-12 col-lg-12 col-xl-4 col-xxl-4">
            <img id="image_about" src={aboutImage} alt="About RecycleHub" />
          </div>

          <div className="col-es-12 col-sm-12 col-md-12 col-lg-12 col-xl-8 col-xxl-8">
            <br />
            <br />
            <span id="Promote_Effective_about">
              <b>Promote Effective Waste Reduction, Reuse, and Recycling</b>
            </span>
            <ul className="mt-3" id="list01_about">
              <li className="lead mb-3">
                To educate and empower users to reduce, reuse, and recycle waste
                effectively by providing tools like the Waste Sorting
                Guide,Upcycling & Repair Hub, and Local Recycling Center
                Locator.
              </li>

              <li className="lead  mb-4">
                Outcome: Users will have the knowledge and resources to properly
                sort waste , repair and upcycle items, and <br />
                locate recycling facilities, leading to a significant reduction
                in waste sent to landfills and an increase in recycling
                <br /> rates.
              </li>
            </ul>

            <span id="Foster_Circular_Economy_about">
              <b>
                Foster a Circular Economy Through Community and Marketplace
                &nbsp;&nbsp;Engagement
              </b>
            </span>
            <ul className="mt-3" id="list02_about">
              <li className="lead mb-4">
                Objective: To create a Second-Hand Marketplace and Community
                Challenges that encourage users to buy, sell,
                <br /> and donate second-hand items, participate in recycling
                challenges, and engage with like-minded individuals and
                businesses.
              </li>
            </ul>

            <span id="Drive_Behavioral_Change">
              <b>
                {" "}
                Drive Behavioral Change Through Gamification and Convenience
              </b>
            </span>
            <ul className="mt-3" id="list03_about">
              <li className="lead">
                Objective: To motivate users to adopt sustainable habits through
                Waste Tracker & Gamification features, such as tracking waste
                reduction progress, earning rewards, and competing in
                challenges, while also making recycling <br />
                more convenient through the Local Recycling Center Locator and
                Business Partnerships.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
