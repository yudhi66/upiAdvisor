/* eslint-disable no-unused-vars */
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import './results.css';
import { useSelector } from 'react-redux';

function Results() {
  const location = useLocation();
  const data = location.state?.data;
  const navigate = useNavigate();

  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData);

  const [commentLoading, setCommentLoading] = useState(false)


  const orgUpi = location.state?.upiId;
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [comments, setComments] = useState([]);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshComments, setRefreshComments] = useState(false);
  const [userComment, setUserComment] = useState("");

  const commentsPerPage = 5;
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);

  const [associatedUpi, setAssociatedUpi] = useState([])
  useEffect(() => {
    if (!data) {
      navigate("/");
    }
    setAssociatedUpi(data.associatedUpi)
    setCount(data.count);
    setCommentLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}api/v1/upi/getComment`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ upi: data.baseUpi })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message); });
        }
        return res.json();
      })
      .then(res => {
        setComments(res.data.commentList.reverse());


      })
      .catch(err => {
        setError(err.message);

      });
    setCommentLoading(false)

  }, [data, navigate, userData, refreshComments]);



  const upiId = data.baseUpi;



  let riskLevel = "";
  if (data.count <= 3) {
    riskLevel = "safe"
  } else if (data.count < 15) {
    riskLevel = "moderate risk"
  } else {
    riskLevel = "high risk"
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
    if (!authStatus) {
      setPopup({ visible: true, message: "Login to Report", type: 'error' });
      return;
    }
    setError(null);
    setPopup({ visible: false, message: '', type: '' });


    fetch(`${import.meta.env.VITE_API_URL}api/v1/upi/report`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ upi: orgUpi })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message); });
        }
        return res.json();
      })
      .then(res => {
        if (res.statusCode === 200) {
          setCount(prev => prev + 1);
        }
        if (!associatedUpi.includes(orgUpi)) {
          setAssociatedUpi(prev => [...prev, orgUpi])

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

  const deleteComment = (id) => {

    setError(null);
    setPopup({ visible: false, message: '', type: '' });


    fetch(`${import.meta.env.VITE_API_URL}api/v1/upi/deleteComment`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message); });
        }
        return res.json();
      })
      .then(res => {
        setComments(prev => prev.filter(item => item.comment._id !== id));




      })
      .catch(err => {
        setPopup({ visible: true, message: err.message, type: 'error' });

      });

  }

  const handleInputChange = (e) => {

    const value = e.target.value
    setUserComment(value)
  }


  const submitComment = () => {
    setCommentLoading(true)
    if (!userComment) {
      setPopup({ visible: true, message: "Comment shouldnt be empty", type: 'error' });
      return;
    }
    if (!userData) {
      setPopup({ visible: true, message: "Login to comment", type: 'error' });
      setUserComment("")
      return;
    }

    setPopup({ visible: false, message: '', type: '' })
    fetch(`${import.meta.env.VITE_API_URL}api/v1/upi/createComment`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ associatedUpi: upiId, content: userComment })
    }).then(res => {
      if (!res.ok) {
        return res.json().then(err => { throw new Error(err.message); });
      }
      return res.json()
    }).then(() => {
      setRefreshComments(prev => !prev)
      setCommentLoading(false)
    }


    ).catch(err => {
      setPopup({ visible: true, message: err.message, type: 'error' });
      setUserComment("")
      setCommentLoading(false)
    })
  }


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
                  value={userComment}
                  onChange={handleInputChange}
                />
              </div>
              <button disabled={commentLoading} className="submit-comment" onClick={() => submitComment()}>
                {commentLoading ? (
                  <div className="loader"></div>
                ) : (
                  "Submit Comment"
                )}
              </button>
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

                      )



                      }
                      {item.comment.ownerDetails.username === userData?.userData?.username && (
                        <button
                          className="delete-comment-btn"
                          onClick={() => deleteComment(item.comment._id)}
                          aria-label="Delete comment"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="red"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-2 14H7L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
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