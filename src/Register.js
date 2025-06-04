
import React from 'react'
import "./Register.css"







export default function Register() {

  function ConfirmDetails(){

    

         let Full_Name;
         let Email_Address;
         let Password;
         let Phone_Number;
         let Address;
         let City;
         let NIC_Number;
         let Bank_Name;
         let account_number;
         let branch;
        

         Full_Name=document.getElementById("fname").value; 
         Email_Address=document.getElementById("email").value;
         Password=document.getElementById("password").value;
         Phone_Number=document.getElementById("PNumber").value;
         Address=document.getElementById("Address").value;
         City=document.getElementById("city").value;
         NIC_Number=document.getElementById("NIC").value;
         Bank_Name=document.getElementById("bank").value;
         account_number=document.getElementById("accNumber").value;
         branch=document.getElementById("branch").value;
      
         alert("Confirm Details"+"\n \n"+
               "Full Name:"+Full_Name+
               "\n"+
               "Email Address:"+Email_Address+
               "\n"+
               "Password:"+Password+
               "\n"+
               "Phone Number:"+Phone_Number+
               "\n"+
               "Address:"+Address+
               "\n"+
               "City:"+City+
               "\n"+
               "NIC Number:"+NIC_Number+
               "\n"+
               "Bank Name:"+Bank_Name+
               "\n"+
               "Account Number:"+account_number+
               "\n"+
               "Branch:"+branch
         );

         alert("Thank you!");

         
        
  }


  

 
  

  return (
    <div>
        <div id="background-image-register">
            <br/><br/><br/><br/><br/><br/><br/>
            <div class="row" >

                <div class="col-es-6  col-sm-6  col-md-4  col-lg-4  col-xl-4  col-xxl-4">
                </div>
                
                <div  class="col-es-12  col-sm-12  col-md-4  col-lg-4  col-xl-4  col-xxl-4" id="second-div-register">
                     <br/>
                     <div>
                       <span  id="create-account-register">CREATE  ACCOUNT</span>
                     </div>

                     <div class="mt-3">
                        <form action="">
                            <label for="fname">Full Name:</label>
                            <input id="fname" type="text" class="form-control" placeholder='Full Name'/>
                            <br/>

                            <label for="email">Email Address:</label>
                            <input id="email" type="text" class="form-control" placeholder='Email Address'/>
                            <br/>

                            <label for="password">Password:</label>
                            <input id="password" type="password" class="form-control" placeholder='password'></input>
                            <br/>

                            <label for="Cpassword">Confirm Password:</label>
                            <input type="password" class="form-control" placeholder='Confirm Password'/>
                            <br/>

                            <label for="PNumber">Phone Number:</label>
                            <input id="PNumber" type="number" class="form-control" placeholder='Phone Number'/>
                            <br/>

                            <label for="address">Address:</label>
                            <input id="Address" type="text" class="form-control" placeholder='Address'/>
                            <br/>

                            <label for="city">City:</label>
                            <input id="city" type="text" class="form-control" placeholder='City'/>
                            <br/>

                            <label for="NIC">NIC Number:</label>
                            <input id="NIC" type="number" class="form-control" placeholder='NIC'/>
                            <br/><br/>


                            <span id="Banking-Information-register" >Banking  Information</span>
                            <br/>

                            <label id="Bank-Name-register"  for="Bname">Bank Name:</label>
                            <input id="bank" type="text" class="form-control" placeholder='Bank Name'/>
                            <br/>

                            <label for="AccNumber">Account Number:</label>
                            <input id="accNumber" type="number" class="form-control" placeholder='Account Number'/>
                            <br/>

                            <label for="Branch">Branch:</label>
                            <input id="branch" type="text" class="form-control" placeholder='Branch Name'/>
                            <br/>

                            <a href="/Sale_Add_Item"  id="submit-register" type="submit" class="btn btn-success" onClick={ConfirmDetails}>Submit</a>
                            
                        </form>
                     </div>
                </div>

                <div class="col-es-6  col-sm-6  col-md-4  col-lg-4  col-xl-4  col-xxl-4">
                </div>
                
            </div>
              <br/><br/><br/><br/>
        </div>
      
       
    </div>
  )
}


