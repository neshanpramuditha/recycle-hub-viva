import React from "react";
import "./Register.css";

export default function Register() {
  return (
    <div>
      <div id="background-image-register">
        <div className="container-fluid py-5">
          <div className="row justify-content-center">
            <div
              className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4"
              id="second-div-register"
            >
              <div className="p-4">
                <div className="text-center mb-4">
                  <span id="create-account-register">CREATE ACCOUNT</span>
                </div>

                <div className="mt-3">
                  <form action="">
                    <label htmlFor="fname">Full Name:</label>
                    <input
                      id="fname"
                      type="text"
                      className="form-control mb-3"
                      placeholder="Full Name"
                    />

                    <label htmlFor="email">Email Address:</label>
                    <input
                      id="email"
                      type="text"
                      className="form-control mb-3"
                      placeholder="Email Address"
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                      id="password"
                      type="password"
                      className="form-control mb-3"
                      placeholder="Password"
                    ></input>

                    <label htmlFor="PNumber">Phone Number:</label>
                    <input
                      id="PNumber"
                      type="number"
                      className="form-control mb-3"
                      placeholder="Phone Number"
                    />

                    <label htmlFor="address">Address:</label>
                    <input
                      id="Address"
                      type="text"
                      className="form-control mb-3"
                      placeholder="Address"
                    />

                    <label htmlFor="city">City:</label>
                    <input
                      id="city"
                      type="text"
                      className="form-control mb-3"
                      placeholder="City"
                    />

                    <label htmlFor="NIC">NIC Number:</label>
                    <input
                      id="NIC"
                      type="number"
                      className="form-control mb-4"
                      placeholder="NIC"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
