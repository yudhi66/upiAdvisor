/* eslint-disable no-unused-vars */
import { useLocation, useNavigate} from 'react-router-dom';
import { useState, useMemo ,useEffect} from 'react';
import './results.css';

function Results() {
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state?.data;
   
  
    useEffect(() => {
      if (!data) {
        navigate("/");
      }
    }, [data, navigate]);
  console.log(data);

  const [comments,setComments]=useState([]);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const upiId = data.baseUpi;
  const commentsPerPage = 5;
  const [error,setError]=useState("");

   

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

  const handleReport = () => {
    console.log('Report submitted');
  };
 const fetchComment=async()=>{
    setLoading(true);
    fetch("http://localhost:4000/api/v1/upi/getComment", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({upi:upiId})
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw new Error(err.message); });
        }
        return res.json();
    })
    .then(res=> {
      setComments(res.data.commentList);
      setLoading(false)
      
    })
    .catch(err => {
        setError(err.message);
        setLoading(false)
    });

 }
  const toggleComments = () => {
    if(comments.length===0){
        fetchComment()
    }
    setIsCommentsOpen(!isCommentsOpen);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of comments list
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
            <span className="count-value">{data.count}</span>
            <span className="count-label">Total Reports</span>
          </div>
          <button className="report-button" onClick={handleReport}>
            Report this UPI
          </button>
        </div>

        <div className="risk-info">
          <div className="info-box">
            <h3>Associated UPI IDs</h3>
            <ul className="associated-list">
              {data.associatedUpi.map((id, index) => (
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
              {paginatedComments.map(comment => (
                <div key={comment.id} className={`comment-card ${comment.rating}`}>
                  <div className="comment-header">
                    <div className="comment-user">
                      <div className="user-avatar">{comment.user[0]}</div>
                      <div className="user-info">
                        <span className="user-name">{comment.user}</span>
                        <span className="comment-date">{comment.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="comment-content">{comment.content}</p>
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
    </div>
  );
}

export default Results;