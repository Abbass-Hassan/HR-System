import React, { useState } from "react"; 
import { useNavigate } from 'react-router-dom';  
import "./Login.css";
import api from '../../../services/Api';
import CrewMateLogo from "../../../assets/images/crewmate-logo.svg";
import OfficePhoto from "../../../assets/images/officePhoto2.png";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onLoginSuccess = () => {
    const accountType = localStorage.getItem('account_type');
    if (accountType === 'hr') {
      navigate('/hr');
    } else {
      navigate('/employee');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('api/v0.1/guest/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.user.token);
        localStorage.setItem('id', response.data.user.id);
        localStorage.setItem('fullname', `${response.data.user.first_name} ${response.data.user.last_name}`);
        localStorage.setItem('account_type', response.data.user.account_type);
        onLoginSuccess();
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-form">
      <form className="login-box" onSubmit={handleSubmit}>
        <div className="container1">
          <div className="login-logo">
            <img src={CrewMateLogo} alt="Crewmate" className="logo" />
            <h3 className="logo_title">Crewmate</h3>
          </div>

          <h1>Welcome Back!</h1>

          <div className="form-field">
            <label htmlFor="email">Email*</label>
            <input
              type="text"
              placeholder="jhondoe@gmail.com"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password*</label>
            <input
              type="password"
              placeholder="*****"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="forgot-password">
              <p>Forgot Password?</p>
            </div>
          </div>

          <div className="login-btn">
            <button type="submit">Login</button>
          </div>

          <div className="apply">
          {error && <p className="error">{error}</p>}
            <p>Do you want to join our company?</p>
            <p>Click Here</p>
          </div>
          

        </div>

        <div className="container2">
          <img src={OfficePhoto} alt="Office Photo" />
        </div>
      </form>
    </div>
  );
}

export default Login;
