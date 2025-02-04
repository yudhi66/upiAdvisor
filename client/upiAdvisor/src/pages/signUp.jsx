/* eslint-disable no-unused-vars */
import { useState } from 'react'
import './signUp.css'
import img1 from "../assets/images/padlock_icon.png"
import { useNavigate } from 'react-router-dom';
function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
      email: '',
      username: '',
      password: ''
    })
    const [error,setError]=useState("");
    const navigate = useNavigate();
  
    const handleInputChange = (e) => {
      const { name, value } = e.target
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  
    const handleSubmit = (e) => {
      e.preventDefault()
      setError(null);
      fetch("http://localhost:4000/api/v1/users/register", {
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
    .then(response => {
        console.log(response.sucess);
      
        if (response.sucess===true) {  // Check if success is true
            navigate("/login");
        } else {
            throw new Error("Registration failed");  
        }
    })
    .catch(err => {
        setFormData({ username: "", email: "", password: "" });
        setError(err.message);
    });
    }
  
    return (
      <div className="app-container">
        <div className="split-layout">
          <div className="form-section">
          
            <div className="form-container">
              <h2 className="form-title">Create an account</h2>
              
              <form onSubmit={handleSubmit}>
  
                <div className="input-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
  
                <div className="input-group">
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
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
                </div>
  
                <button type="submit" className="submit-button">
                  Create account
                </button>
                <h1 className='text-red-500'>{error}</h1>
  
                <div className="divider">
                  <span>OR</span>
                </div>
  
                <div className="login-link">
                  Already have an account?{' '}
                  <a href="/login">Log in</a>
                </div>
              </form>
            </div>
          </div>
  
          <div className="image-section">
            <div className="lock-icon"></div>
            <img src={img1} className='padlock-image'></img>
            <h2 className="confidence-text">Pay with confidence</h2>
          </div>
        </div>
      </div>
    )
}

export  default SignUp
