/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './reporting.css';

function Report() {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status)

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    upiId: ''
  });
  useEffect(() => {
    if (!authStatus) {
      navigate('/login');
    }
  }, [authStatus, navigate])

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null)
    setLoading(true);
    if (!formData.upiId) {
      setError("Upi id field shouldn't be empty")
    }

    fetch(`${import.meta.env.VITE_API_URL}api/v1/upi/report`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ upi: formData.upiId })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message); });
        }
        return res.json();
      })
      .then(res => {
        setFormData({ upiId: '' });

        window.location.reload();
        setSuccess("Successfully Reported")
      })
      .catch(err => {
        setFormData({ upiId: '' });
        setError(err.message);
      });

    setLoading(false)

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





          <button disabled={loading} type="submit" className="submit-report">
            {loading ? "Reporting..." : "Report"}
          </button>
        </form>
        <h1 className='text-red-500 text-center'>{error}</h1>
        <h1 className='text-green-400 text-center'>{success}</h1>
      </div>
    </div>
  );
}

export default Report;