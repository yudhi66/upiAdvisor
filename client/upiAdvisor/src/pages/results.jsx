/* eslint-disable no-unused-vars */
import { useLocation, useNavigate} from 'react-router-dom';
import { useState, useMemo ,useEffect} from 'react';
import './results.css';

function Results() {
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state?.data;
    const orgUpi=location.state?.upiId;
    const [reportSubmitted, setReportSubmitted] = useState(false);
    const [comments,setComments]=useState([]);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const commentsPerPage = 5;
  const [error,setError]=useState("");
  const[count,setCount]=useState(0);

  const [associatedUpi,setAssociatedUpi]=useState([])
    useEffect(() => {
      if (!data) {
        navigate("/");
      }
     setAssociatedUpi(data.associatedUpi)
     setCount(data.count);
      setLoading(true);
    fetch("http://localhost:4000/api/v1/upi/getComment", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({upi:data.baseUpi})
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw new Error(err.message); });
        }
        return res.json();
    })
    .then(res=> {
      setComments(res.data.commentList);
      setLoading(false);
      
    })
    .catch(err => {
        setError(err.message);
        setLoading(false)
    });


    }, [data, navigate]);
   console.log(comments[0]?.comment.ownerDetails.username);


  const upiId = data.baseUpi;
  

   

  let riskLevel="";
  if(data.count<=3){
    riskLevel="safe"
  }else if(data.count<15){
     riskLevel="moderate risk"
  }else{
    riskLevel="high risk"
  }


  

  const paginatedComments = useMemo(() => {
    const startIndex = (currentPage - 1) * commentsPerPage;
    return comments.slice(startIndex, startIndex + commentsPerPage);
  }, [currentPage, comments]);

  const totalPages = Math.ceil(comments.length / commentsPerPage);

  const getRiskBannerClass = (riskLevel) => {
    switch (riskLevel) {
      case 'high risk':
        return 'risk-banner-high';
      case 'moderate risk':
        return 'risk-banner-moderate';
      case 'safe':
        return 'risk-banner-safe';
      default:
        return '';
    }
  };
  const [popup, setPopup] = useState({ visible: false, message: '', type: '' });
  const handleReport = () => {
     
    setError(null);
    setPopup({ visible: false, message: '', type: '' });
    

     fetch("http://localhost:4000/api/v1/upi/report", {
      method: "POST",
      credentials: "include",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({upi:orgUpi})
  })
  .then(res => {
      if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message); });
      }
      return res.json();
  })
  .then(res=> {
     if(res.statusCode===200){
      setCount(prev=>prev+1);
     }
     if(!associatedUpi.includes(orgUpi)){
      setAssociatedUpi(prev=>[...prev,orgUpi])

     }
    setPopup({ visible: true, message: 'Report submitted successfully!', type: 'success' });
    setReportSubmitted(true);
    
  })
  .catch(err => {
    setPopup({ visible: true, message: err.message, type: 'error' });
      
  });
    
  };
 
  const toggleComments = () => {
     
    setIsCommentsOpen(!isCommentsOpen);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    
    document.querySelector('.comments-list')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="results-container">
      <div className="nav-space"></div>
      
      <div className={`risk-banner ${getRiskBannerClass(riskLevel)}`}>
        <div className="risk-banner-content">
          <span className="risk-level-text">{riskLevel.toUpperCase()}</span>
          <span className="upi-id">{upiId}</span>
        </div>
      </div>

      <div className="results-content">
        <div className="report-summary">
          <div className="report-count">
            <span className="count-value">{count}</span>
            <span className="count-label">Total Reports</span>
          </div>
          <button 
  className={`report-button ${reportSubmitted ? "disabled" : ""}`} 
  onClick={handleReport} 
  disabled={reportSubmitted}
>
  {reportSubmitted ? "Reported" : "Report this UPI"}
</button>

        </div>

        <div className="risk-info">
          <div className="info-box">
            <h3>Associated UPI IDs</h3>
            <ul className="associated-list">
              {associatedUpi.map((id, index) => (
                <li key={index}>{id}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="comments-section">
          <button 
            className="comments-toggle"
            onClick={toggleComments}
            aria-expanded={isCommentsOpen}
            aria-controls="comments-content"
          >
            <h3>Comments ({comments.length})</h3>
            <svg 
              className={`comments-toggle-icon ${isCommentsOpen ? 'open' : ''}`}
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M19 9L12 16L5 9" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div 
            id="comments-content"
            className={`comments-content ${isCommentsOpen ? 'open' : ''}`}
            aria-hidden={!isCommentsOpen}
          >
            <div className="add-comment">
              <div className="comment-header">
                <div className="user-avatar">U</div>
                <textarea
                  placeholder="Add a comment..."
                  className="comment-input"
                />
              </div>
              <button className="submit-comment">Submit Comment</button>
            </div>

            <div className="comments-list">
            {paginatedComments.map(item => (
  <div key={item.comment._id} className="comment-card negative">
    <div className="comment-header">
      <div className="comment-user">
        {item.comment.ownerDetails ? (
          <>
            <div className="user-avatar">{item.comment.ownerDetails.username?.[0] || "A"}</div>
            <div className="user-info">
              <span className="user-name">{item.comment.ownerDetails.username || "Anonymous"}</span>
              <span className="comment-date">{new Date(item.comment.date).toLocaleDateString()}</span>
            </div>
          </>
        ) : (
          <div className="user-info">
            <span className="user-name">Anonymous</span>
          </div>
        )}
      </div>
    </div>
    <p className="comment-content">{item.comment.content}</p>
  </div>
))}


            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  ←
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(index + 1)}
                    aria-label={`Page ${index + 1}`}
                    aria-current={currentPage === index + 1 ? 'page' : undefined}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {popup.visible && (
        <div className={`popup ${popup.type}`}>
          <span>{popup.message}</span>
          <button onClick={() => setPopup({ ...popup, visible: false })}>Close</button>
        </div>
      )}


    </div>
  );
}

export default Results;