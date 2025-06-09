import React from "react";
import "./Home.css";
import Services from "./Services";

export default function Home() {
  return (
    <div>
      <div id="background_image">
        <div className="container">
          <div className="row">
            <div className="col-es-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <span id="Recycle_Hub_home">Recycle &nbsp; Hub</span>
              <br />
              <span id="Buy_and_Sell_home">
                Buy & Sell Second-Hand Items Easily
              </span>{" "}
              <br />
              <br />
              <a
                href="/Services"
                type="button"
                id="button_home"
                className="btn btn-success"
              >
                VIEW SERVICES
              </a>
              &nbsp;&nbsp;
              <a href="/Buy" type="button" className="btn btn-outline-success">
                BROWSE PRODUCTS
              </a>
            </div>
          </div>
        </div>
      </div>
      <Services />
    </div>
  );
}
