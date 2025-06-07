import React from 'react'
import "./Navigation_bar.css";
import About from "./About"

export default function Navigation_bar() {
  return (
    <div>
      <nav class="navbar navbar-dark bg-success navbar-expand-lg fixed-top ">
           <a href="" class="navbar-brand" id="Recycle_Hub">Recycle Hub</a>

           <button class="navbar-toggler" data-toggle="collapse" data-target="#toggle"><span class="navbar-toggler-icon"></span></button>

          <div class="collapse navbar-collapse justify-content-center" id="toggle" >
           <ul class="navbar-nav">
               <li class="nav-item" ><a href="/" class="nav-link active"id="link1">Home</a></li>&nbsp;&nbsp;&nbsp;&nbsp;
               <li class="nav-item" ><a href="/About" class="nav-link active"id="link2">About</a></li>&nbsp;&nbsp;&nbsp;&nbsp;
               <li class="nav-item" ><a href="/Services" class="nav-link active"id="link3">Services</a></li>&nbsp;&nbsp;&nbsp;&nbsp;
               <li class="nav-item" ><a href="/Buy_And_Sale" class="nav-link active"id="link4">buy & sale</a></li>&nbsp;&nbsp;&nbsp;&nbsp;
               <li class="nav-item"><a href="/Contact" type="button" class=" btn btn-dark nav-link" id="contact_button"><b>CONTACT</b></a></li>
               
           </ul>
          </div>
       </nav>
    </div>
  )
}


