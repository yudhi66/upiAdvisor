/* eslint-disable no-unused-vars */
import { useState } from 'react'
import './resetPassword.css'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const navigate=useNavigate();
  const [error,setError]=useState("");

  const location=useLocation();
  const email=location.state?.email || "";
  const [formData, setFormData] = useState({
    code: '',
    newPassword: '',
    retypePassword: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null);

    if(!email){
      setError("Invalid email");
      return;
    }
   
    if (formData.newPassword !== formData.retypePassword) {
      setError('Passwords do not match')
      return;
    }
    fetch("http://localhost:4000/api/v1/users/validateOtp", {
      method: "POST",
      credentials: "include",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({email,otp:formData.code,newPassword:formData.newPassword})
  })
  .then(res => {
      if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message); });
      }
      return res.json();
  })
  .then(res=> {
    navigate("/login");
    
  })
  .catch(err => {
      setError(err.message);
  });
    
  }

  return (
    <div className="reset-container">
      <div className="reset-card">
        <div className="key-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.65 10C11.83 7.67 9.61 6 7 6C3.69 6 1 8.69 1 12C1 15.31 3.69 18 7 18C9.61 18 11.83 16.33 12.65 14H17V18H21V14H23V10H12.65ZM7 14C5.9 14 5 13.1 5 12C5 10.9 5.9 10 7 10C8.1 10 9 10.9 9 12C9 13.1 8.1 14 7 14Z" fill="white"/>
          </svg>
        </div>

        <h1 className="reset-title">Create new password</h1>
        
        <p className="reset-description">
          Enter the code received in your email along with the new password
        </p>

        <form onSubmit={handleSubmit} className="reset-form">
          <div className="input-group">
            <input
              type="text"
              name="code"
              placeholder="Code"
              value={formData.code}
              onChange={handleChange}
              className="reset-input"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="newPassword"
              placeholder="New password"
              value={formData.newPassword}
              onChange={handleChange}
              className="reset-input"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="retypePassword"
              placeholder="Retype password"
              value={formData.retypePassword}
              onChange={handleChange}
              className="reset-input"
              required
            />
          </div>

          <button type="submit" className="confirm-button">
            Confirm
          </button>
        </form>
        <h1 className='text-red-500 mt-3'>{error}</h1>
      </div>
    </div>
  )
}

export default ResetPassword