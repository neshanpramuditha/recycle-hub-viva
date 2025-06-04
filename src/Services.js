import React from 'react';
import "./Services.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

let mode=0;

 function MainServices()
 {
       //light=0
       //dark=1;

       switch(mode)
       {
          case 0:

            mode=1;

              document.body.style.backgroundColor="#01002E";
              document.getElementById("Classic_Collectors_Hub").style.color="white";
              document.getElementById("Classic_Collectors_Hub").style.borderBottom="3px solid white";
              document.getElementById("light_services").style.color="white";
              document.getElementById("light_services").className="bi bi-moon-fill";
              document.getElementById("light_services").style.borderBottom="3px solid white";
               break;

          case 1:

            mode=0;

            document.body.style.backgroundColor=" rgb(238, 245, 223)";
            document.getElementById("Classic_Collectors_Hub").style.color="black";
            document.getElementById("Classic_Collectors_Hub").style.borderBottom="3px solid black";
            document.getElementById("light_services").style.color="black";
            document.getElementById("light_services").className="bi bi-moon";
            document.getElementById("light_services").style.borderBottom="3px solid black";
            

            break;
       }
 }

export default function Services() {
  return (
    <div>
      <div id="background">
      <div class="container">
        <div class="row">
          <div class="col-12 mt-4">
            <br/><br/><br/>
            <center>
              <a href="#"><i id="light_services" className="bi bi-moon"  onClick={MainServices} ></i></a>
              <span id="Classic_Collectors_Hub"><b>Classic Collectors Hub.</b></span>
            </center>
          </div>
        </div>

        <div class="row">
          <div class="col-es-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-4">
            <div class="card mt-5" id="card_01_services">
              <img id="card_01_image_services"  src={require("./image/2.jpg")} alt="Plastic Item"/>
              <div class="card-body" id="card_body_services">
                <span id="Plastic_Item" >Plastic Item</span>
                <a href="/Plastic_Item" type="button" id="button_services" class="btn btn-outline-success mb-5">GO HERE</a>
                <br/>
              </div>
            </div>
          </div>

          <div class="col-es-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-4">
            <div class="card mt-5" id="card_02_services">
              <img id="card_02_image_services" src={require('./image/5.png')} alt="Vidhuru Item"/>
              <div class="card-body" id="card_body_services">
                <span  id="Vidhuru_Item">Glasses</span>
                <a href="/Glasses" type="button"  id="button_services" class="btn btn-outline-success mb-5">GO HERE</a>
              </div>
            </div>
          </div>

          <div class="col-es-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-4">
            <div class="card mt-5" id="card_03_services">
              <img id="card_03_image_services"  src={require('./image/6.jpg')} alt="Tyres"/>
              <div class="card-body" id="card_body_services">
                <span id="The_Tyres">Tyres</span>
                <a href="/Tyre" type="button" id="button_services" class="btn btn-outline-success">GO HERE</a>
              </div>
            </div>
          </div>

          <div class="col-es-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-4">
            <div class="card mt-5" id="card_04_services">
              <img id="card_04_image_services"  src={require('./image/8.jpg')} alt="Electronic Device"/>
              <div class="card-body" id="card_body_services">
                <span id="Electronic_Device">Electronic Device</span>
                <a href="/Electronic_Device"  type="button" id="button_services" class="btn btn-outline-success">GO HERE</a>
              </div>
            </div>
          </div>

          <div class="col-es-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-4">
            <div class="card mt-5" id="card_05_services">
              <img id="card_05_image_services"  src={require('./image/7.jpg')} alt="Iron Bars"/>
              <div class="card-body" id="card_body_services">
                <span id="Iron_bars">Iron bars</span>
                <a href="/Iron_Bar"  type="button" id="button_services" class="btn btn-outline-success">GO HERE</a>
              </div>
            </div>
          </div>


            <div class="col-es-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                 <div id="card_06_services" class="card mt-5">
                     <img id="card_06_image_services" src={require('./image/9.jpg')} alt="books"/>

                     <div class="card-body" id="card_body_services">
                         <span id="book">BOOKS</span>
                         <a href="/Book" type="button" id="button_services" class="btn btn-outline-success">GO HERE</a>
                     </div>
                  </div>
            </div>
        </div>
      </div>
      </div>
    </div>
  );
}

