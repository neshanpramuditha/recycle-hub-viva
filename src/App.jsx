import React from 'react'
import Navigation_bar from "./Navigation_bar.jsx";
import Home from "./Home.jsx"
import About from "./About.jsx"
import Services from "./Services.jsx"
import Buy_And_Sale from "./Buy_And_Sale.jsx"
import Contact from "./Contact.jsx"
import Plastic_Item from "./Plastic_Item.jsx"
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Sale from "./Sale.jsx";
import Register from "./Register.jsx"
import Sale_Add_Item from "./Sale_Add_Item.jsx";
import Add_Item_form from "./Add_Item_form.jsx";
import Buy from "./Buy.jsx";
import Glasses from "./Glasses.jsx";
import Tyre from "./Tyre.jsx";
import Electronic_Device from "./Electronic_Device.jsx";
import Iron_Bar from "./Iron_Bar.jsx";
import Book from "./Book.jsx"



export default function 
() {
  return (
    <div>
       <Navigation_bar/>
     
       

       <BrowserRouter>
             <Routes>
                 <Route path="/" element={<Home/>}/>
                 <Route path="/About" element={<About/>}/>
                 <Route path="/Services" element={<Services/>}/>
                 <Route path="/Buy_and_Sale" element={<Buy_And_Sale/>}/>
                 <Route path="/Contact" element={<Contact/>}/>
                 <Route path="/Plastic_Item" element={<Plastic_Item/>}/>
                 <Route path="/Sale" element={<Sale/>}/>
                 <Route path="/Register" element={<Register/>}/>
                 <Route path="/Sale_Add_Item" element={<Sale_Add_Item/>}/>
                 <Route path="/Add_Item_form" element={<Add_Item_form/>}/>
                 <Route path="/Buy" element={<Buy/>}/>
                 <Route path="/Glasses" element={<Glasses/>}/>
                 <Route path="/Tyre" element={<Tyre/>}/>
                 <Route path="/Electronic_Device"  element={<Electronic_Device/>}/>
                 <Route path="/Iron_Bar" element={<Iron_Bar/>}/>
                 <Route path="/Book" element={<Book/>}/>
                
             </Routes>
       </BrowserRouter> 

        
       
    </div>
  )
}

