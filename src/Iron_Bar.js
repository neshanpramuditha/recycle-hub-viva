import React from 'react'
import "./Classic_Item.css"


function sub(){
      let x=document.getElementById("input_01_classicItem").value;
      x=document.getElementById("item_01").innerHTML=x;
      
}



function one(){
     let previous=document.getElementById("count_classicItem").innerHTML;
     document.getElementById("count_classicItem").innerHTML=previous+1;
}

function two(){
  let previous=document.getElementById("count_classicItem").innerHTML;
  document.getElementById("count_classicItem").innerHTML=previous+2;
     
}

function three(){
   let previous=document.getElementById("count_classicItem").innerHTML;
   document.getElementById("count_classicItem").innerHTML=previous+3;
}

function four(){
   let previous=document.getElementById("count_classicItem").innerHTML;
   document.getElementById("count_classicItem").innerHTML=previous+4;
}

function five(){
   let previous=document.getElementById("count_classicItem").innerHTML;
   document.getElementById("count_classicItem").innerHTML=previous+5;

}

function sis(){
   let previous=document.getElementById("count_classicItem").innerHTML;
   document.getElementById("count_classicItem").innerHTML=previous+6;
   
}

function seven(){
     let previous=document.getElementById("count_classicItem").innerHTML;
     document.getElementById("count_classicItem").innerHTML=previous+7;
}

function eight(){
     let previous=document.getElementById("count_classicItem").innerHTML;
     document.getElementById("count_classicItem").innerHTML=previous+8;
}

function nine(){
     let previous=document.getElementById("count_classicItem").innerHTML;
     document.getElementById("count_classicItem").innerHTML=previous+9;
}

function zero(){
      let previous=document.getElementById("count_classicItem").innerHTML;
      document.getElementById("count_classicItem").innerHTML=previous+0;
}

function clear(){
      document.getElementById("count_classicItem").innerHTML=" ";
}

function submit(){
         let previous=document.getElementById("count_classicItem").innerHTML;
         document.getElementById("item_02").innerHTML=previous;
}

function Mainsubmit(){
      let Contact=document.getElementById("input_02_classicItem").value;
      document.getElementById("item_03").innerHTML=Contact;

      let Location=document.getElementById("input_03_classicItem").value;
      document.getElementById("item_04").innerHTML=Location;

      let Massage=document.getElementById("Massage").value;
      document.getElementById("Item_05").innerHTML=Massage;

      document.getElementById("click_classicItem").innerHTML="Clear";
      document.getElementById("subsubmit_classicItem").style.backgroundColor="green";

      
}


let Mode=0;
function Mainplastic(){

   //light 0
   //dark 1

   switch(Mode)
   {
     case 0:
       Mode=1;
       document.body.style.backgroundColor="#01002E";
       document.getElementById("light_classicItem").style.color="black";
       document.getElementById("light_classicItem").className="bi bi-lightbulb-fill";
       break;

     case 1:
      Mode=0;
       document.body.style.backgroundColor="white";
       document.getElementById("light_classicItem").style.color="black";
       document.getElementById("light_classicItem").className="bi bi-lightbulb"
       break;

     
   }

}


export default function Iron_Bar() {
  return (
    <div>
        <div>
        <br/><br/>
            <div class="container">
                     <br/><br/><br/>
                <div class="row">
                    <div class="col-6" id="information_box_classicItem">
                        <br/>
                          <center>
                             <a href="#"><i id="light_classicItem" class="bi bi-lightbulb" onClick={Mainplastic}></i></a>
                             <span  id="Main_topic_classicItem">Needed Some Information</span>
                          </center>
                          <br/><br/> 
                          <span class="mb-3" id="Item_Name">Item Name:</span>
                           <input id="input_01_classicItem" type="text" class="form-control" placeholder="Iterm Name"/> 
                          <a id="Enter_classicItem" type="button" class="btn btn-success mb-4"  onClick={sub}>Enter</a>


                           <div id="calculater_classicItem">
                            <div>
                              <span id="countofitem_classicItem">Count of item</span>
                              <br/>
                              <span id="count_classicItem">&nbsp;</span>
                            </div>
                            <div>
                               <button id="one_classicItem" class="btn btn-outline-dark" onClick={one}>1</button>
                               <button id="two_classicItem" class="btn btn-outline-dark" onClick={two}>2</button>
                               <button id="three_classicItem" class="btn btn-outline-dark" onClick={three}>3</button>
                            </div>

                            <div>
                               <button id="fore_classicItem" class="btn btn-outline-dark" onClick={four}>4</button>
                               <button id="five_classicItem" class="btn btn-outline-dark" onClick={five}>5</button>
                               <button id="six_classicItem" class="btn btn-outline-dark" onClick={sis}>6</button>
                            </div>

                            <div>
                                <button id="seven_classicItem" class="btn btn-outline-dark" onClick={seven}>7</button>
                                <button id="eight_classicItem" class="btn btn-outline-dark" onClick={eight}>8</button>
                                <button id="nine_classicItem" class="btn btn-outline-dark" onClick={nine}>9</button>
                            </div>

                            <div>
                              <button id="clear_classicItem" class="btn btn-outline-dark" onClick={clear}>C</button>
                              <button id="zero_classicItem" class="btn btn-outline-dark" onClick={zero}>0</button>
                              <button id="submit_classicItem" class="btn btn-outline-dark" onClick={submit}>S</button>
                            </div>
                            </div>

                            <div class="mt-4 ">
                               <input type="file" id="image"/>
                               <img id="previewImage" width="300"/>
                            </div>

                            <div>
                               <label id="contact_classicItem" for="contact">Contact Number:</label>
                               <input id="input_02_classicItem" type="Number" class="form-control" placeholder="Enter Contact Number"/>
                            </div>

                            <div>
                               <label id="location_classicItem" for="location">Location</label>
                               <input id="input_03_classicItem" type="Location" class="form-control" placeholder="Location"/>
                            </div>
                               <br/>
                            <div>
                                <span  id="massage">Massage</span>
                                <textarea id="Massage" class="form-control" cols="20" rols="3" placeholder='Type here'></textarea>
                            </div>

                            <div>
                               <button id="submit_button_classicItem" class="btn btn-success" onClick={Mainsubmit}>Submit</button>
                            </div>

                          <br/>
                    </div>

                          


                     <div class="col-6">
                     <img src={require("./image/37.png")} alt="animation image" id="animation-image-classicItem"/>
                         <div id="card_01" class="card">
                              <div class="card-body">
                                    <li id="list_01_classicItem">Item Name:<span  id="item_01"></span></li>
                                    <li id="list_02_classicItem">Count of Item:<span  id="item_02"></span></li>
                                    <li id="list_03_classicItem">Contact Number:<span id="item_03"></span></li>
                                    <li id="list_04_classicItem">Location:<span id="item_04"></span></li>
                                    <li id="list_05_classicItem">Massage:<span id="Item_05"></span></li>
                                    <a href="" type="button" class="btn btn-primary" id="subsubmit_classicItem" ><span id="click_classicItem"></span></a>
                              </div>
                         </div>
                   </div>
  
                </div>
            </div>
            <br/><br/><br/>
        </div>
    </div>
  )
}
