import React from "react";
import Navigation_bar from "./Navigation_bar.js";
import Home from "./Home.js";
import About from "./About.js";
import Services from "./Services.js";
import Buy_And_Sale from "./Buy_And_Sale.js";
import Contact from "./Contact.js";
import ProductSingle from "./[id].js";
import Buy from "./Buy.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sale from "./Sale.js";
import Sale_Add_Item from "./Sale_Add_Item.js";
import Add_Item_form from "./Add_Item_form.js";
import Register from "./auth/register/Register.js";
import Login from "./auth/login/login.js";
import { AuthProvider } from "./contexts/AuthContext.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import Dashboard from "./components/Dashboard.js";
import EditProductForm from "./components/EditProductForm.js";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation_bar />{" "}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Services" element={<Services />} />
          <Route path="/Buy_And_Sale" element={<Buy_And_Sale />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Buy" element={<Buy />} />
          <Route path="/product/:id" element={<ProductSingle />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          {/* User Dashboard - Protected Route */}
          <Route
            path="/Dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Edit Product - Protected Route */}
          <Route
            path="/edit-product/:id"
            element={
              <ProtectedRoute>
                <EditProductForm />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Require Authentication */}
          <Route
            path="/Sale"
            element={
              <ProtectedRoute>
                <Sale />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Sale_Add_Item"
            element={
              <ProtectedRoute>
                <Sale_Add_Item />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Add_Item_form"
            element={
              <ProtectedRoute>
                <Add_Item_form />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
