import React, { useState } from 'react';
import "./Buy_And_Sale.css";

let Mode = 0;

function Main_BAS() {
  switch (Mode) {
    case 0:
      Mode = 1;
      document.body.style.backgroundColor = "#01002E";
      document.getElementById("light_BAS").style.color = "white";
      document.getElementById("light_BAS").className ="bi bi-moon-fill";
      document.getElementById("light_BAS").style.borderBottom = "3px solid white";
      document.getElementById("Main_topic_BAS").style.color = "white";
      document.getElementById("Main_topic_BAS").style.borderBottom = "3px solid white";
      document.getElementById("card_01_BAS").style.border = "4px solid white";
      document.getElementById("card_02_BAS").style.border = "4px solid white";
      break;

    case 1:
      Mode = 0;
      document.body.style.backgroundColor = "rgb(235, 246, 228)";
      document.getElementById("light_BAS").style.color = "black";
      document.getElementById("light_BAS").className = "bi bi-moon";
      document.getElementById("light_BAS").style.borderBottom = "3px solid black";
      document.getElementById("Main_topic_BAS").style.color = "black";
      document.getElementById("Main_topic_BAS").style.borderBottom = "3px solid black";
      document.getElementById("card_01_BAS").style.border = "3px solid black";
      document.getElementById("card_02_BAS").style.border = "3px solid black";
      break;
  }
}

function Buy_And_Sale() {
  const [A, setA] = useState(false);

  const click = () => {
    setA(true);
  };

  const Yes = () => {
    setA(false);
  };

  const No=()=>{
       setA(false);
  }

  return (
    <div>
      <div id="background_BuyAndSale">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <br /><br /><br /><br />
              <a href="#"><i id="light_BAS" className="bi bi-moon" onClick={Main_BAS}></i></a>
              <span id="Main_topic_BAS" className="mt-5 mb-5">For Buy And Sale Second-Hand Items Here!</span>
            </div>

            <div className="row">
              <div className="col-es-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6">
                <div className="card" id="card_01_BAS">
                  <img id="image_01_BAS" src={require('./image/10.gif')} alt="Buy" />
                  <div className="card-body" id="card_body_01_BAS">
                    <a href="/Buy" type="button" id="btn_01_BAS" className="btn btn-dark ">BUY NOW</a>
                  </div>
                </div>
              </div>

              <div className="col-es-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6">
                <div className="card" id="card_02_BAS">
                  <img id="image_02_BAS" src={require('./image/12.gif')} alt="Sale" />
                  <div id="card_body_02_BAS" className="card-body">
                    <button type="button" id="btn_02_BAS" className="btn btn-dark" onClick={click}>SALE</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

           {A && (
           <div style={{
           position: 'fixed',
           top: '50%',
           left: '60%',
           padding: '50px',
           backgroundColor: 'white',
           border: '5px solid #ccc',
           boxShadow: '0 0 0px rgba(30, 184, 115, 0.3)'
           }}>
          <h6>Are you Registered Before?</h6>
          <a href="/Sale_Add_Item" type="button" class="btn btn-success" onClick={Yes}>Yes</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a href="/Register" type="button" class="btn btn-success" onClick={No}>No</a>
          </div>
          )}
          
    </div>
  );
}

export default Buy_And_Sale;



