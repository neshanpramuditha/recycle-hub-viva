import React from 'react'
import "./Home.css"
import Services from "./Services"

export default function Home() {
  return (
    <div>
        <div id="background_image">
         <div class="container">
            <div class="row">
                <div class="col-es-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                      <br/><br/><br/><br/><br/><br/>
                    <span id="Recycle_Hub_home">Recycle &nbsp; Hub</span>
                    <br/>
                    <span id="Buy_and_Sell_home">Buy & Sell Second-Hand Items Easily</span>
                    <br/><br/>
                    <a href="/Services" type="button" id="button_home" class="btn btn-success">VIEW SERVICES</a>
                    
                </div>
            </div>
         </div>
        </div>
        <Services/>
    </div>
  )
}
