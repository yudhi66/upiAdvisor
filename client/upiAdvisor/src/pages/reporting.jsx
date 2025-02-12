import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './reporting.css';

function Report() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    upiId: '',
    comments: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Report submitted:', formData);
    // Navigate to results page after submission
    
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="report-container">
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="report-content">
        <h1 className="report-title">Report UPI ID</h1>
        
        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label htmlFor="upiId">UPI ID to Report</label>
            <input
              type="text"
              id="upiId"
              name="upiId"
              value={formData.upiId}
              onChange={handleChange}
              placeholder="Enter UPI ID"
              required
            />
          </div>

          

          <div className="form-group">
            <label htmlFor="comments">Comments</label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Describe what happened..."
            />
          </div>



          <button type="submit" className="submit-report">
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}

export default Report;