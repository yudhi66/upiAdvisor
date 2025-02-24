/* eslint-disable no-unused-vars */
import { useState } from 'react'
import './forgotPassword.css'
import { useNavigate } from 'react-router-dom';
function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [error, setError] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null);

    fetch(`${import.meta.env.VITE_API_URL}api/v1/users/generateOtp`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message); });
        }
        return res.json();
      })
      .then(res => {
        console.log(res)

        navigate("/reset", { state: { email } });
      })
      .catch(err => {
        setError(err.message);
      });


  }

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <div className="lock-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="white" />
          </svg>
        </div>

        <h1 className="forgot-title">Forgot password</h1>

        <p className="forgot-description">
          Enter your email address and we will send you otp to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="forgot-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="forgot-input"
              required
            />
          </div>

          <button type="submit" className="reset-button">
            Send reset otp
          </button>
        </form>
        <h1 className='text-red-500'>{error}</h1>
      </div>
    </div>
  )
}

export default ForgotPassword