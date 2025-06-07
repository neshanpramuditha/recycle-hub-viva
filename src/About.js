import React from 'react'
import "./About.css"
import 'bootstrap-icons/font/bootstrap-icons.css';


let mode=0;

function MainAbout(){
  
   //light=0
   //dark=1
    
   
   switch(mode)
   {
    case 0:
       
        mode=1;

        document.body.style.backgroundColor="#01002E";
        document.getElementById("Your_second_hand_marketplace_about").style.color="white";
        document.getElementById("Your_second_hand_marketplace_about").style.borderBottom="3px solid white";
        document.getElementById("light").style.borderBottom="3px solid white";
        document.getElementById("Promote_Effective_about").style.color="white";
        document.getElementById("Foster_Circular_Economy_about").style.color="white";
        document.getElementById("Drive_Behavioral_Change").style.color="white";
        document.getElementById("list01_about").style.color="white";
        document.getElementById("list02_about").style.color="white";
        document.getElementById("list03_about").style.color="white";
        document.getElementById("light").style.color="white";
        document.getElementById("light").className="bi bi-moon-fill";
        document.getElementById("image_about").style.border="2px solid white";
        document.getElementById("image_about").style.border="none";

        break;

       case 1:
          mode=0;

          document.body.style.backgroundColor="rgb(224, 234, 207)";
          document.getElementById("Your_second_hand_marketplace_about").style.color="black";
          document.getElementById("Your_second_hand_marketplace_about").style.borderBottom="3px solid black";
          document.getElementById("light").style.borderBottom="3px solid black";
          document.getElementById("Promote_Effective_about").style.color="black";
          document.getElementById("Foster_Circular_Economy_about").style.color="black";
          document.getElementById("Drive_Behavioral_Change").style.color="black";
          document.getElementById("list01_about").style.color="black";
          document.getElementById("list02_about").style.color="black";
          document.getElementById("list03_about").style.color="black";
          document.getElementById("light").style.color="black";
          document.getElementById("light").className="bi bi-moon";
          document.getElementById("image_about").style.border="none";

          break;

   }

}



export default function About() {
  return (
    <div>
       <div id="background_about">
          <div class="row">
             <div class="col-12">
              <br/><br/><br/><br/>
             <a href="#"><i id="light" className="bi bi-moon" onClick={MainAbout} ></i></a>
             <span id="Your_second_hand_marketplace_about">Your second-hand  marketplace.</span>
             </div>
          </div>
              <div class="row">
            <div class="col-es-12 col-sm-12 col-md-12 col-lg-12 col-xl-4 col-xxl-4">
                 <img id="image_about" src="/image/3.png"/>
            </div>

            <div class="col-es-12 col-sm-12 col-md-12 col-lg-12 col-xl-8 col-xxl-8">
              <br/><br/>
                <span  id="Promote_Effective_about"><b>Promote Effective Waste Reduction, Reuse, and Recycling</b></span>
                    <ul class="mt-3" id="list01_about">
                       <li class="lead mb-3" >To educate and empower users to reduce, reuse, and recycle waste
                        effectively by providing tools like the Waste Sorting Guide,Upcycling &   Repair Hub, and Local Recycling Center Locator.</li>
                       
                       <li class="lead  mb-4" >Outcome: Users will have the knowledge and resources to properly sort waste
                         ,  repair and upcycle items, and <br/>locate recycling facilities, leading to a significant
                        reduction in waste sent to landfills and an increase in recycling<br/> rates.</li>
                    </ul>

                <span id="Foster_Circular_Economy_about"><b>Foster a Circular Economy Through Community and Marketplace
                    &nbsp;&nbsp;Engagement</b></span>
                    <ul class="mt-3" id="list02_about">
                      <li class="lead mb-4">Objective: To create a Second-Hand Marketplace and Community Challenges
                          that encourage users to buy, sell,<br/> and donate second-hand items, participate
                          in recycling challenges, and engage with like-minded individuals and businesses.</li>
                    </ul>

                    <span id="Drive_Behavioral_Change"><b> Drive Behavioral Change Through Gamification and Convenience</b></span>
                    <ul class="mt-3" id="list03_about">
                      <li class="lead" >Objective: To motivate users to adopt sustainable habits through Waste Tracker
                           & Gamification features, such as tracking waste reduction progress, earning
                           rewards,
                          and competing in challenges, while also making recycling <br/>more 
                          convenient through
                          the Local Recycling Center Locator and Business 
                           Partnerships.</li>
                    </ul>


            </div>
          
            </div>
         
       </div>
    </div>
  )
}

