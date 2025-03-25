import React, { useState } from "react"; 
import { useNavigate } from 'react-router-dom';  
import "./Login.css";
import api from '../../../services/Api';
import CrewMateLogo from "../../../assets/images/crewmate-logo.svg";
import OfficePhoto from "../../../assets/images/officePhoto2.png";
import { useToast } from "../../../context/Toast/Toast";
import { jwtDecode } from 'jwt-decode'
import { useUser } from "../../../context/User/useUser";
import GoogleLogo from "../../../assets/images/googleLogo.png"

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { setToken } = useUser();

  const onLoginSuccess = (accountType) => {
    showToast('Success', 'Login Successfully')
    if (accountType === 'hr') {
      navigate('/hr')
    } else {
      navigate('/employee')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('api/v0.1/guest/login', { email, password });
      if (response.data.success) {
        const token = response.data.user.token;
        localStorage.setItem('token', token)
        setToken(token);
        // localStorage.setItem('id', response.data.user.id);
        // localStorage.setItem('fullname', `${response.data.user.first_name} ${response.data.user.last_name}`);
        // localStorage.setItem('account_type', response.data.user.account_type);
        console.log(jwtDecode(token))
        onLoginSuccess(jwtDecode(token).account_type);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
      showToast('Error', 'Email or Password not correct')
    }
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault()
    const googleAuthURL = 'http://localhost:8000/api/v0.1/guest/auth/google'

    const width = 500
    const height = 600
    const left = (window.innerWidth - width) / 2
    const top = (window.innerHeight - height) / 2

    const popup = window.open(
      googleAuthURL,
      'Google Login',
      `width=${width},height=${height},top=${top},left=${left},resizable=no`
    )

    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return

      if (!event.data?.token) {
        navigate('/', { state: { loginError: true } })
        showToast('Error', 'You are not allowed to login')
      } else if (event.data?.token) {
        const token = event.data.token
        localStorage.setItem('token', token)
        setToken(token)
        onLoginSuccess(jwtDecode(token).account_type)
        showToast('Success', 'Login successfully')
      }

      popup.close()
      window.removeEventListener('message', handleMessage)
    }
    window.addEventListener('message', handleMessage)
  }

  return (
    <div className="login-form">
      <form className="login-box" onSubmit={handleSubmit}>
        <div className="container1">
          <div className="login-logo">
            <img src={CrewMateLogo} alt="Crewmate" className="logo" />
            <h3 className="logo_title">Crewmate</h3>
          </div>

          <h1 className="login-h1">Welcome Back!</h1>

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
              <p className="login-p">Forgot Password?</p>
            </div>
          </div>

          <div className="login-btn2">
            <button className="login-btn" type="submit">Login</button>
          </div>

          <div className="apply">
          {error && <p className="error">{error}</p>}
            <p className="login-p">Do you want to join our company?</p>
            <p className="login-p">Click Here</p>
          </div>
          <div
            className='google-container'
            onClick={(e) => handleGoogleLogin(e)}
          >
            <img
              src={GoogleLogo}
              alt='googleloge.png'
            />
            <p>Login using google</p>
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
