/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './login.css'
import { useDispatch } from 'react-redux';
import {login} from "../store/authSlice.js"
function Login() {
    const navigate = useNavigate();
    const dispatch =useDispatch();
    const [showPassword, setShowPassword] = useState(false)

    const [error,setError]=useState("");
    const [formData, setFormData] = useState({
        email: '',
        password: ''
      })
  
    const handleInputChange = (e) => {
      const { name, value } = e.target
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        fetch("http://localhost:4000/api/v1/users/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => { throw new Error(err.message); });
            }
            return res.json();
        })
        .then(data => {
          dispatch(login({userData:data}))
            navigate("/");
        })
        .catch(err => {
          setFormData({  email: '',
            password: ''});
            setError(err.message);
        });
    }
  
    return (
      <div className="app-container">
        <div className="split-layout">
          <div className="form-section">
          
            <div className="form-container">
              <h2 className="form-title">Welcome Back!</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    name="email"
                    placeholder="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
  
                <div className="input-group password-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>

                  <h1 className='text-red-500'>{error}</h1>
                </div>
  
                <button type="submit" className="submit-button">
                  Log In
                </button>
  
                <div className="divider">
                  <span>OR</span>
                </div>
  
                <div className="forgot-password">
                  <a href="/forgot">Forgot password?</a>
                </div>
              </form>
            </div>
          </div>
  
          <div className="image-section warning-section">
            <div className="warning-icon">⚠️</div>
            <h2 className="warning-text">Stay safe from scams</h2>
          </div>
        </div>
      </div>
    )
}

export default Login
