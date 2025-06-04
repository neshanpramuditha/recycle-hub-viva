import React from 'react'
import "./Contact.css"


let Mode=0;
function MainContact(){
      
      //light=0
     //dark=1 

     switch(Mode)
     {
        case 0:

            Mode=1;
            document.body.style.backgroundColor="#01002E"
            document.getElementById("Main-topic-contact").style.color="white"
            document.getElementById("Main-topic-contact").style.borderBottom="3px solid white"
            document.getElementById("light_contact").style.color="white"
            document.getElementById("light_contact").className="bi bi-moon-fill"
            document.getElementById("light_contact").style.borderBottom="3px solid white"
            document.getElementById("question-contact").style.color="white"
            document.getElementById("Email-contact").style.color="white"
            document.getElementById("name-contact").style.color="white"
            document.getElementById("massage-contact").style.color="white"
            document.getElementById("social-media-contact").style.backgroundColor="rgb(235, 224, 211)"
            document.getElementById("Facebook-contact").style.color="black"
            document.getElementById("link-01-contact").style.color="black"
            document.getElementById("Whatsapp-contact").style.color="black"
            document.getElementById("link-02-contact").style.color="black"
            document.getElementById("link-03-contact").style.color="black"
            document.getElementById("Phone-contact").style.color="black"
            document.getElementById("link-04-contact").style.color="black"
            document.getElementById("link-05-contact").style.color="black"
            document.getElementById("Facebook-contact").style.borderBottom="2px solid black"
            document.getElementById("Whatsapp-contact").style.borderBottom="2px solid black"
            document.getElementById("Phone-contact").style.borderBottom="2px solid black"

            break;

        case 1:

           Mode=0;

           document.body.style.backgroundColor="rgb(241, 237, 231)"
           document.getElementById("Main-topic-contact").style.color="black"
           document.getElementById("Main-topic-contact").style.borderBottom="3px solid black"
           document.getElementById("light_contact").style.color="black"
           document.getElementById("light_contact").className="bi bi-moon"
           document.getElementById("light_contact").style.borderBottom="3px solid black"
           document.getElementById("question-contact").style.color="black"
           document.getElementById("Email-contact").style.color="black"
           document.getElementById("name-contact").style.color="black"
           document.getElementById("massage-contact").style.color="black"
           document.getElementById("social-media-contact").style.backgroundColor="black"
           document.getElementById("Facebook-contact").style.color="white"
           document.getElementById("link-01-contact").style.color="white"
           document.getElementById("Whatsapp-contact").style.color="white"
           document.getElementById("link-02-contact").style.color="white"
           document.getElementById("link-03-contact").style.color="white"
           document.getElementById("Phone-contact").style.color="white"
           document.getElementById("link-04-contact").style.color="white"
           document.getElementById("link-05-contact").style.color="white"
           document.getElementById("Facebook-contact").style.borderBottom="2px solid white"
           document.getElementById("Whatsapp-contact").style.borderBottom="2px solid white"
           document.getElementById("Phone-contact").style.borderBottom="2px solid white"

           break;

     }
}
  


function Details_contact(){
    let email;
    let name;
    let massage;
    email=document.getElementById("input-01-contact").value;
    name=document.getElementById("input-02-contact").value;
    massage=document.getElementById("textarea-contact").value;

    alert(
        "Your Email Address:"+email+ 
        "\n"+
        "your Name:"+ name+
        "\n"+
        "your Massage:"+massage
    );
  
}

export default function Contact() {
  return (
    <div>
         <div id="background">
            <div class="container">
                <div class="row">
                    <div class="col-12 mt-5">
                        <br/><br/>
                        <a href="#"><i id="light_contact" className="bi bi-moon" onClick={MainContact}></i></a>
                        <span  id="Main-topic-contact">CONTACT  US</span>
                    </div>
                    <div class="col-12 mt-3">
                        <span id="question-contact">Any questions or remark? just write us a massage!</span>
                    </div>
                </div>

                <div class="row">
                   <form action="" method="post">
                      <div class="col-12">
                          <table>
                              <tr>
                                 <th>
                                        <label class="mb-2 mt-4" for="Email" id="Email-contact">Email:</label>
                                        <input id="input-01-contact" type="text" class="form-control" placeholder="Enter yor Email Address"/>
                                </th>
                                <th>
                                        <label class="mb-2 mt-4" for="name" id="name-contact">Name:</label>
                                        <input id="input-02-contact" type="text" class="form-control" placeholder="Enter your Name"/>
                                </th>
                               </tr>
                           </table>
                       </div>

                       <div class="col-12">
                            <label class="mb-3 mt-3" for="massage" id="massage-contact"><b>Massage:</b></label>
                            <textarea id="textarea-contact" class="form-control"  placeholder="Type Here" cols="30" rows="4"></textarea>
                            <input id="submit-contact" type="submit" class="btn btn-success mt-5" placeholder="submit" onClick={(Details_contact)}/>
                       </div>

                   </form>
                    </div>

                      <div class="row mt-5" id="social-media-contact">
                          
                          <div  class="col-es-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4">
                          <br/><br/>
                              <span id="Facebook-contact"> Facebook</span><br/>
                              <span id="link-01-contact"> www.facebook.com/Recycle  Hub</span>
                          <br/><br/>

                          </div>

                          <div class="col-es-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4">
                          <br/><br/>
                             <span id="Whatsapp-contact">Whatsapp</span><br/>
                             <span id="link-02-contact">0777659081/</span>
                             <span id="link-03-contact">0761426573</span>
                          <br/><br/>
                          </div>

                          <div  class="col-es-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4">
                          <br/><br/>
                              <span id="Phone-contact">Phone(Land Line)</span><br/>
                              <span id="link-04-contact">0119087631/</span>
                              <span id="link-05-contact"> 0112438965</span>
                          <br/><br/><br/>
                          </div>  
                      </div>
                      <br/><br/>
                </div>
            </div>
         </div>

  )
}
