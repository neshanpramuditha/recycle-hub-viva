import React from 'react'
import "./Buy.css"

export default function Buy() {

    let x=0;

     function Bulb()
         {
            switch(x)
               {
                 case 0:
                    x=1;

                     document.body.style.backgroundColor="#01002E";
                     document.getElementById("bulb-buy").className="bi bi-moon-fill";
                     document.getElementById("bulb-buy").style.color="white";
                     document.getElementById("main-topic-Buy").style.color="white";
                     document.getElementById("one-sub-topic-buy").style.color="white";
                     document.getElementById("two-sub-topic-buy").style.color="white";
                     document.getElementById("three-sub-topic-buy").style.color="white";
                     document.getElementById("four-sub-topic-buy").style.color="white";
                     document.getElementById("five-sub-topic-buy").style.color="white";
                     document.getElementById("phone-buy").style.color="white";
                     document.getElementById("laptop-buy").style.color="white";
                     document.getElementById("computer-buy").style.color="white";
                     document.getElementById("Audio-buy").style.color="white";
                     document.getElementById("tv-buy").style.color="white";
                     document.getElementById("Home-Appliances-buy").style.color="white";
                     document.getElementById("sofa-buy").style.color="white";
                     document.getElementById("Desks-buy").style.color="white";
                     document.getElementById("Mattresses-buy").style.color="white";
                     document.getElementById("Cupboards-buy").style.color="white";
                     document.getElementById("Beds-buy").style.color="white";
                     document.getElementById("men-buy").style.color="white";
                     document.getElementById("Women-buy").style.color="white";
                     document.getElementById("Kids-buy").style.color="white";
                     document.getElementById("Shoes-buy").style.color="white";
                     document.getElementById("Bags-buy").style.color="white";
                     document.getElementById("ExerciseItem-buy").style.color="white";
                     document.getElementById("Bicycle-buy").style.color="white";
                     document.getElementById("SportsItem-buy").style.color="white";
                     document.getElementById("bike-buy").style.color="white";
                     document.getElementById("car-buy").style.color="white";
                     
                    
                     break;

                     case 1:

                        x=0;

                        document.body.style.backgroundColor="white";
                        document.getElementById("bulb-buy").className="bi bi-moon";
                        document.getElementById("bulb-buy").style.color="black"; 
                        document.getElementById("main-topic-Buy").style.color="black";
                        document.getElementById("one-sub-topic-buy").style.color="black";
                        document.getElementById("two-sub-topic-buy").style.color="black";
                        document.getElementById("three-sub-topic-buy").style.color="black";
                        document.getElementById("four-sub-topic-buy").style.color="black";
                        document.getElementById("five-sub-topic-buy").style.color="black";
                        document.getElementById("phone-buy").style.color="black";
                        document.getElementById("laptop-buy").style.color="black";
                        document.getElementById("computer-buy").style.color="black";
                        document.getElementById("Audio-buy").style.color="black";
                        document.getElementById("tv-buy").style.color="black";
                        document.getElementById("Home-Appliances-buy").style.color="black";
                        document.getElementById("sofa-buy").style.color="black";
                        document.getElementById("Desks-buy").style.color="black";
                        document.getElementById("Mattresses-buy").style.color="black";
                        document.getElementById("Cupboards-buy").style.color="black";
                        document.getElementById("Beds-buy").style.color="black";
                        document.getElementById("men-buy").style.color="black";
                        document.getElementById("Women-buy").style.color="black";
                        document.getElementById("Kids-buy").style.color="black";
                        document.getElementById("Shoes-buy").style.color="black";
                        document.getElementById("Bags-buy").style.color="black";
                        document.getElementById("ExerciseItem-buy").style.color="black";
                        document.getElementById("Bicycle-buy").style.color="black";
                        document.getElementById("SportsItem-buy").style.color="black";
                        document.getElementById("bike-buy").style.color="black";
                        document.getElementById("car-buy").style.color="black";
                       
                        break;
               }
         }
  return (
    <div>
        <div>

            <div class="row">
                <div class="col-12">
                    <img src={require("./image/15.png")} alt="shoping" id="image-Buy"/>
                </div>
            </div>

            <div class="row">
                  <span id="main-topic-Buy">
                    <a href="#"><i className="bi bi-moon" onClick={Bulb} id="bulb-buy"></i></a>
                    Suggested Categories for Used Items
                  </span>
            </div>

            <div class="row">
                <span id="one-sub-topic-buy">Electronics Device</span>
            </div>

            <div class="row">

               <div class="col-es-12 col-sm-12 col-md-4 col-lg-1 col-xl-1 col-xxl-1">
                    <div class="card" id="phone-card-buy">
                       <a href="https://ikman.lk/en/ads/sri-lanka/electronics"><img src={require("./image/16.png")} alt="phone" class="card-img-top"/></a>
                    </div>
                    <div class="card-body">
                        <a href="https://ikman.lk/en/ads/sri-lanka/electronics" class="nav-link"><span id="phone-buy">Phone</span></a>
                    </div>
               </div>

               <div class="col-es-12 col-sm-12 col-md-4 col-lg-1 col-xl-1 col-xxl-1">
                  <div class="card" id="laptop-card-buy">
                     <a href=""><img src={require("./image/17.png")} alt="laptop" class="card-img-top"/></a>
                  </div>
                  <div class="card-body">
                      <a href="" class="nav-link"><span id="laptop-buy">Laptops</span></a>
                  </div>
               </div>

               <div class="col-es-12 col-sm-12 col-md-4 col-lg-1 col-xl-1 col-xxl-1">
                   <div class="card" id="computer-card-buy">
                        <a href=""><img src={require("./image/18.png")} alt="" class="card-img-top"/></a>
                   </div>
                   <div class="card-body">
                      <a href="" class="nav-link"><span id="computer-buy">Computers</span></a>
                   </div>
               </div>

               <div class="col-es-12 col-sm-12 col-md-4 col-lg-1 col-xl-1 col-xxl-1">
                  <div class="card" id="Audio-card-buy">
                      <a href=""><img src={require("./image/19.png")} alt="Audio" class="card-img-top"/></a>
                  </div>
                  <div class="card-body">
                       <a href="" class="nav-link"><span id="Audio-buy">Audio </span></a>
                  </div>
               </div>

               <div class="col-es-12 col-sm-12 col-md-4 col-lg-1 col-xl-1 col-xxl-1">
                   <div class="card" id="tv-card-buy">
                      <a href=""><img src={require("./image/20.png")} alt="tv" class="card-img-top"/> </a> 
                   </div> 
                   <div class="card-body">
                          <a href="" class="nav-link"><span id="tv-buy">TVs</span></a>
                   </div>
               </div>

               <div class="col-es-12 col-sm-12 col-md-4 col-lg-1 col-xl-1 col-xxl-1">
                   <div class="card" id="Home-Appliances-card-buy">
                       <a href=""><img src={require("./image/21.png")} alt="Home Appliances"  class="card-img-top"/></a>
                   </div>
                   <div class="card-body">
                       <a href="" class="nav-link"><span id="Home-Appliances-buy">Home Appliances</span></a>
                   </div>
               </div>

               <div class="row">
                 <div class="col-12">
                      <span id="two-sub-topic-buy">Furniture</span>
                  </div>
               </div>

                <div class="row">
                  <div class="col-es-12 col-sm-12 col-md-4 col-lg-1 col-xl-1 col-xxl-1">
                      <div class="card" id="Sofas-card-buy">
                         <a href=""><img src={require("./image/22.png")} alt="Sofas" class="card-img-top"/></a>
                      </div>
                      <div class="card-body">
                          <a href="" class="nav-link"><span id="sofa-buy">Sofas</span></a>
                      </div>
                  </div>

                      <div class="col-es-12 col-sm-12 col-md-4 col-lg-1 col-xl-1 col-xxl-1">
                           <div class="card" id="Desks-desk-buy">
                               <a href=""><img src={require("./image/23.png")} alt="Desks" class="card-img-top"/></a>
                           </div>
                           <div class="card-body">
                              <a href="" class="nav-link"><span id="Desks-buy">Desks</span></a>
                           </div>
                      </div>

                      <div class="col-es-12 col-sm-12 col-md-4 col-lg-1 col-xl-1 col-xxl-1">
                          <div class="card" id="Mattresses-card-buy">
                              <a href=""><img src={require("./image/24.png")} alt="Mattresses" class="card-img-top"/></a>
                          </div>
                          <div>
                              <a href="" class="nav-link"><span id="Mattresses-buy">Mattresses</span></a>
                          </div>
                      </div>

                      <div class="col-es-12 col-sm-12 col-md-4 col-lg-1 col-xl-1 col-xxl-1">
                          <div class="card" id="Cupboards-card-buy">
                              <a href=""><img src={require("./image/25.png")} alt="Cupboards" class="card-img-top"/></a>
                          </div>
                          <div class="card-body">
                              <a href="" class="nav-link"> <span id="Cupboards-buy">Cupboards</span></a>
                          </div>
                      </div>

                      <div class="col-es-12 col-sm-12 col-md-4 col-lg-1 col-xl-1 col-xxl-1">
                         <div class="card" id="Beds-card-buy">
                            <a href=""><img src={require("./image/26.png")} alt="Beds"  class="card-img-top"/></a> 
                         </div>
                         <div>
                            <a href="" class="nav-link"><span id="Beds-buy">Beds</span></a>
                         </div>
                      </div>
                  </div>


                  <div class="row">
                      <div class="col-12">
                        <br/>
                           <span  id="three-sub-topic-buy">cloth</span>
                      </div>

                      <div class="col-es-12 col-sm-12 col-md-4 col-lg-1 col-xl-1 col-xxl-1">
                          <div class="card" id="men-card-buy">
                              <a href=""><img src={require("./image/27.jpg")} alt="Men’s Cloth" class="card-img-top"/></a>
                          </div>
                          <div class="card-body">
                               <a href="" class="nav-link"><span id="men-buy">Men’s Cloth</span></a>
                          </div>
                      </div>

                      <div class="col-es-12 col-sm-12 col-md-4 col-lg-1 col-xl-1 col-xxl-1">
                          <div class="card" id="Women-card-buy">
                              <a href=""> <img src={require("./image/28.png")} alt="Women’s Cloth" class="card-img-top"/></a>
                          </div>
                          <div class="card-body">
                              <a href="" class="nav-link"><span id="Women-buy">Women’s Cloth</span></a>
                          </div>
                      </div>

                      <div class="col-es-12 col-sm-12 col-md-4 col-lg-1 col-xl-1 col-xxl-1">
                          <div class="card" id="Kids-card-buy">
                              <a href=""><img src={require("./image/29.png")} alt="Kids’ Cloth" class="card-img-top"/></a>
                          </div>
                          <div class="card-body">
                              <a href="" class="nav-link"><span id="Kids-buy">Kids’ Cloth</span></a>
                          </div>
                      </div>

                      <div class="col-es-12 col-sm-12 col-md-4 col-lg-1 col-xl-1 col-xxl-1">
                         <div class="card" id="Shoes-card-buy">
                              <a href=""><img src={require("./image/30.png")} alt="Shoes" class="card-img-top"/></a>
                         </div>
                         <div class="card-body">
                             <a href="" class="nav-link"><span id="Shoes-buy">Shoes</span></a>
                         </div>
                      </div>

                      <div class="col-es-12 col-sm-12 col-md-4 col-lg-1 col-xl-1 col-xxl-1">
                         <div class="card" id="Bags-card-buy">
                             <a href=""><img src={require("./image/31.png")} alt="Bags" class="card-img-top"/></a>
                         </div>
                         <div class="card-body">
                             <a href="" class="nav-link"><span id="Bags-buy">Bags</span></a>
                         </div>
                      </div>
                </div>

                <div class="row">

                      <div class="col-12">
                          <br/>
                          <span id="four-sub-topic-buy">Sports & Fitness</span>
                      </div>

                      <div class="col-es-12 col-sm-12 col-md-4 col-lg-1 col-xl-1 col-xxl-1">
                          <div class="card" id="ExerciseItem-card-buy">
                              <a href=""><img src={require("./image/32.png")} alt="Exercise Item" class="card-img-top"/></a>
                          </div>
                          <div class="card-body">
                                 <a href="" class="nav-link"> <span id="ExerciseItem-buy">Exercise Item</span></a>
                          </div>
                      </div>

                      <div class="col-es-12 col-sm-12 col-md-4 col-lg-1 col-xl-1 col-xxl-1">
                          <div class="card" id="Bicycle-card-buy">
                              <a href=""><img src={require("./image/33.png")} alt="Bicycles" class="card-img-top"/></a>
                          </div>
                          <div class="card-body">
                              <a href="" class="nav-link"><span id="Bicycle-buy">Bicycles</span></a>
                          </div>
                      </div>

                      <div class="col-es-12 col-sm-12 col-md-4 col-lg-1 col-xl-1 col-xxl-1">
                        <div class="card" id="SportsItem-card-buy">
                           <a href=""><img src={require("./image/34.png")} alt="Sports Item"  class="card-img-top"/></a>
                        </div>
                        <div class="card-body">
                           <a href="" class="nav-link"><span id="SportsItem-buy">Sports Item</span></a>
                        </div>
                      </div>
                </div>

                <div class="row">
                      <div class="col-12">
                          <br/>
                          <span id="five-sub-topic-buy">Vehicles</span>
                      </div>

                      <div class="col-es-12 col-sm-12 col-md-4 col-lg-1 col-xl-1 col-xxl-1">
                          <div class="card" id="bike-card-buy">
                              <a href=""><img src={require("./image/35.png")} alt="bike" class="card-img-top"/></a>
                          </div>
                          <div class="card-body">
                              <a href="" class="nav-link"> <span id="bike-buy">bikes</span></a>
                          </div>
                      </div>

                      <div class="col-es-12 col-sm-12 col-md-4 col-lg-1 col-xl-1 col-xxl-1">
                          <div class="card" id="car-card-buy">
                               <a href=""><img src={require("./image/36.png")} alt="car" class="card-img-top"/></a>
                          </div>
                          <div class="card-body">
                               <a href="" class="nav-link"><span id="car-buy">Cars</span></a>
                          </div>
                      </div>
                </div>
                       <span class="mb-5"></span>

                <div class="row" id="contactDetails-buy">

                          <div class="col-12">
                              <br/><br/>
                          </div>
                           
                          <div class="col-es-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                            
                                <span id="Facebook-buy"> Facebook</span>
                                <br/>
                                <a href="" class="nav-link"><span id="FacebookLink-buy"> www.facebook.com/Green Market</span></a>
                                
                          </div>

                          <div class="col-es-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                               <span id="Whatsapp-buy">Whatsapp</span>
                               <br/>
                               <span id="WhatsappNumber-buy">0777659081</span>
                               <br/>
                               <span id="WhatsappNumber-buy">0761426573</span>
                          </div>

                          <div class="col-es-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                                 <span id="Phone-buy">Phone(Land Line)</span>
                                 <br/>
                                 <span id="PNumber-buy">0119087631</span>
                                 <br/>
                                 <span id="PNumber-buy">0112438965</span>
                          </div>

                          <div class="col-es-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                               <span id="Email-buy">Email Address</span>
                               <br/>
                               <span id="emailaddress-buy">GreenMarket@gmail.com</span>
                          </div>

                           <div class="col-12">
                               <br/><br/>
                           </div>
                           
                    </div>
                </div>

            </div>

    </div>
    
  )
}
