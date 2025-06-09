import React from "react";
import Navigation_bar from "../Navigation_bar";
import "./Layout.css";
import Footers from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Navigation_bar />
      <main className="main-content">{children}</main>
      <Footers />
    </div>
  );
};

export default Layout;
