 
import { useState } from 'react'
import './home.css'
function Home() {
    const [searchValue, setSearchValue] = useState('')

    const handleSearch = (e) => {
      e.preventDefault()
      console.log('Searching for:', searchValue)
    }
  
    return (
      <div className="home-container">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        
        <main className="hero-section">
          <h1 className="hero-title">
            Secure
            <span className="accent-text"> Payments</span>
          </h1>
          
          <p className="hero-subtitle">
            Verify and secure your UPI transactions 
          </p>
  
          <div className="features">
            <div className="feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>Real-time Verification</span>
            </div>
            
            <div className="feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M19 12C19 14.0504 18.3018 15.8125 17.2848 17C15.7083 18.8125 13.7721 20 12 20C10.2279 20 8.29168 18.8125 6.71516 17C5.69824 15.8125 5 14.0504 5 12C5 9.94962 5.69824 8.18751 6.71516 7C8.29168 5.18751 10.2279 4 12 4C13.7721 4 15.7083 5.18751 17.2848 7C18.3018 8.18751 19 9.94962 19 12Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span>Fraud Protection</span>
            </div>
            
          
          </div>
  
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-container">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Enter a UPI ID to verify"
                className="search-input"
              />
              <button type="submit" className="search-button">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </form>
        </main>
      </div>
    )
}

export default Home;
