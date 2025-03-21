import React from "react";
import "./Login.css";
import CrewMateLogo from "../../../assets/images/crewmate-logo.svg";
import OfficePhoto from "../../../assets/images/officePhoto2.png";

function Login() {
  return (
    <div className="login-form">
      <div className="login-box">
        <div className="container1">
            <div className="login-logo">
              <img src={CrewMateLogo} alt="Crewmate" className="logo" />
              <h3 className="logo_tile">Crewmate</h3>
            </div>

          <h1>Welcome Back!</h1>

          <div className="form-field">
            <label htmlFor="email">Email*</label>
            <input type="text" placeholder="jhondoe@gmail.com" id="email" name="email"/>
          </div>

          <div className="form-field">
            <label htmlFor="password">Password*</label>
            <input type="password" placeholder="*****" id="password"name="password"/>

            <div className="forgot-password">
            <p>Forgot Password?</p>
            </div>
          </div>

          <div className="login-btn">
            <button>Login</button>
          </div>
          <div className="apply">
            <p>Do you want to join our company?</p>
            <p>Click Here</p>
          </div>

        </div>

        <div className="container2">
          <img src={OfficePhoto} alt="Office Photo" />
        </div>
      </div>
    </div>
  );
}

export default Login;
