import React, { useEffect } from 'react'
import Navbar from "./layouts/navbar/Navbar.jsx";
import Home from "./pages/home/Home.jsx"
import About from "./pages/about/About.jsx"
import Services from "./pages/services/Services.jsx"
import BuyAndSale from "./pages/buy-and-sale/BuyAndSale.jsx"
import Contact from "./pages/contact/Contact.jsx"
import PlasticItem from "./components/items/PlasticItem.jsx"
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Sale from "./pages/auth/sale/Sale.jsx";
import Register from "./pages/auth/register/Register.jsx"
import SaleAddItem from "./components/forms/SaleAddItem.jsx";
import AddItemForm from "./components/forms/AddItemForm.jsx";
import Buy from "./pages/buy/Buy.jsx";
import Glasses from "./components/items/Glasses.jsx";
import Tyre from "./components/items/Tyre.jsx";
import ElectronicDevice from "./components/items/ElectronicDevice.jsx";
import IronBar from "./components/items/IronBar.jsx";
import Book from "./components/items/Book.jsx"



export default function App() {
  return (
    <div>
       <BrowserRouter>
         <Navbar/>
         <Routes>
             <Route path="/" element={<Home/>}/>
             <Route path="/about" element={<About/>}/>
             <Route path="/services" element={<Services/>}/>
             <Route path="/buy-and-sale" element={<BuyAndSale/>}/>
             <Route path="/contact" element={<Contact/>}/>
             <Route path="/plastic-item" element={<PlasticItem/>}/>
             <Route path="/sale" element={<Sale/>}/>
             <Route path="/register" element={<Register/>}/>
             <Route path="/sale-add-item" element={<SaleAddItem/>}/>
             <Route path="/add-item-form" element={<AddItemForm/>}/>
             <Route path="/buy" element={<Buy/>}/>
             <Route path="/glasses" element={<Glasses/>}/>
             <Route path="/tyre" element={<Tyre/>}/>
             <Route path="/electronic-device"  element={<ElectronicDevice/>}/>
             <Route path="/iron-bar" element={<IronBar/>}/>
             <Route path="/book" element={<Book/>}/>
         </Routes>
       </BrowserRouter>
    </div>
  );
}

