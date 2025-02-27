import { useEffect, useState } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Profile() {
    const [activeSection, setActiveSection] = useState('account');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const Data = useSelector((state) => state.auth.userData);
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [reports, setReports] = useState([{}]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: ""
    })
    useEffect(() => {

        if (!Data) {
            navigate("/")
        } else {
            setUserData(Data)

            setReports(Data?.userData?.reports || []);
        }


    }, [Data, navigate])



    const handlePasswordChange = (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (passwords.currentPassword === passwords.newPassword) {
            setError("New password should be different from current password")
            return;
        }
        fetch(`${import.meta.env.VITE_API_URL}api/v1/users/updatePassword`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ oldPassword: passwords.currentPassword, newPassword: passwords.newPassword })
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(err => { throw new Error(err.message); });
                }
                return res.json();
            })
            .then(
                setSuccess("Password Change SuccessFully")
            )
            .catch(err => {

                setError(err.message);
            });
        setPasswords({
            currentPassword: "",
            newPassword: ""
        });

    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setPasswords(prev => ({
            ...prev,
            [name]: value

        }))

    }



    const renderContent = () => {
        switch (activeSection) {
            case 'account':
                return (
                    <div className="content-section">
                        <h2>Account Details</h2>
                        <div className="details-box">
                            <div className="detail-item">
                                <label>Username</label>
                                <p>{userData?.userData?.username}</p>
                            </div>
                            <div className="detail-item">
                                <label>Email</label>
                                <p>{userData?.userData?.email}</p>
                            </div>
                            <div className="detail-item">
                                <label>Member Since</label>
                                <p>{new Date(userData?.userData?.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="detail-item">
                                <label>Reports Submitted</label>
                                <p>{reports.length}</p>
                            </div>


                        </div>
                    </div>
                );

            case 'reports':
                return (
                    <div className="content-section">
                        <h2>Your Reports</h2>
                        <div className="reports-list">
                            {reports.map(report => (
                                <div key={report.createdAt} className="report-card">
                                    <div className="report-header">
                                        <h3>{report.upi}</h3>

                                    </div>
                                    <p className="report-date">Reported on {new Date(report?.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'password':
                return (
                    <div className="content-section">
                        <h2>Change Password</h2>
                        <form onSubmit={handlePasswordChange} className="password-form">
                            <div className="form-group">
                                <label htmlFor="currentPassword">Current Password</label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    required
                                    value={passwords.currentPassword}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    required
                                    value={passwords.newPassword}
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit" className="submit-button">
                                Update Password
                            </button>
                            <h1 className='text-red-500 text-center mt-1'>{error}</h1>
                            <h1 className='text-green-400 text-center mt-1'>{success}</h1>
                        </form>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="profile-container">
            <div className="floating-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className={`profile-content ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
                <button
                    className="sidebar-toggle"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>

                    <nav className="nav-menu">
                        <button
                            className={`nav-item ${activeSection === 'account' ? 'active' : ''}`}
                            onClick={() => setActiveSection('account')}
                        >
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" />
                                <path d="M19 12C19 14.0504 18.3018 15.8125 17.2848 17C15.7083 18.8125 13.7721 20 12 20C10.2279 20 8.29168 18.8125 6.71516 17C5.69824 15.8125 5 14.0504 5 12C5 9.94962 5.69824 8.18751 6.71516 7C8.29168 5.18751 10.2279 4 12 4C13.7721 4 15.7083 5.18751 17.2848 7C18.3018 8.18751 19 9.94962 19 12Z" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <span>Account Details</span>
                        </button>
                        <button
                            className={`nav-item ${activeSection === 'reports' ? 'active' : ''}`}
                            onClick={() => setActiveSection('reports')}
                        >
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span>Reports</span>
                        </button>
                        <button
                            className={`nav-item ${activeSection === 'password' ? 'active' : ''}`}
                            onClick={() => setActiveSection('password')}
                        >
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span>Change Password</span>
                        </button>
                    </nav>
                </aside>

                <main className="main-content">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

export default Profile;