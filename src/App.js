import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
  Link,
} from 'react-router-dom';
import './App.css';

// ----- Sidebar Component -----
function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Dementia Admin</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Users
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

// ----- Dashboard Layout Component -----
function DashboardLayout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

// ----- User List -----
function UserList({ users }) {
  const navigate = useNavigate();

  return (
    <ul className="user-list">
      {users.map((user) => {
        const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
        
        return (
          <li
            key={user._id}
            className="user-item"
            onClick={() => navigate(`/user/${user._id}`)}
          >
            <div className="user-item-header">
              <div className="user-avatar">{userInitial}</div>
              <div>
                <div className="user-name">{user.name || 'Unnamed User'}</div>
                <div className="user-id">ID: {user._id}</div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ----- User Details Page -----
function UserPage() {
  const { id } = useParams();
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://dementia-backend-gamma.vercel.app/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedUser(data);
      })
      .catch((err) => {
        console.error('Error fetching user by ID:', err);
      });
  }, [id]);

  if (!selectedUser) {
    return (
      <DashboardLayout>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </DashboardLayout>
    );
  }

  const user = selectedUser.user;
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <DashboardLayout>
      <div className="user-details">
        <div className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button onClick={() => navigate('/')} className="back-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <h1>User Details</h1>
          </div>
        </div>

        <div className="card">
          <div className="user-profile-header">
            <div className="user-profile-avatar">{userInitial}</div>
            <div>
              <h2>{user.name || 'Unnamed User'}</h2>
              <p>{user.email || 'No email'}</p>
            </div>
          </div>

          <div className="user-info-grid">
            <div className="user-info-item">
              <div className="user-info-label">User ID</div>
              <div className="user-info-value">{user._id}</div>
            </div>
            
            <div className="user-info-item">
              <div className="user-info-label">Session Token</div>
              <div className="session-token">
                <code>{user.sessionToken}</code>
              </div>
            </div>
          </div>
        </div>

        <div className="activities-container">
          <div className="card-header">
            <h2>Activities</h2>
          </div>
          
          {user.activities.length > 0 ? (
            <div className="activities-grid">
              {user.activities.map((activity) => (
                <div key={activity._id} className="activity-card">
                  <div className="activity-header">
                    <div className="activity-title">{activity.category}</div>
                    <div className="activity-domain">{activity.domain}</div>
                  </div>
                  <div className="activity-stats">
                    <div>
                      <div className="activity-stat-label">Completion Count</div>
                      <div className="activity-stat-value">{activity.count}</div>
                    </div>
                    <div>
                      <div className="activity-stat-label">Last Played</div>
                      <div className="activity-stat-value">
                        {new Date(activity.lastPlayed).toLocaleDateString()}
                      </div>
                      <div className="activity-date">
                        {new Date(activity.lastPlayed).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card">
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No activities found for this user</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// ----- Home Page -----
function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('https://dementia-backend-gamma.vercel.app/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setLoading(false);
      });
  }, []);

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
            <path d="M21 12a9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9z"></path>
            <path d="M9 12l2 2 4-4"></path>
          </svg>
          Refresh Data
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{users.length}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>User Management</h2>
        </div>
        
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
          <UserList users={users} />
        )}
      </div>
    </DashboardLayout>
  );
}

// ----- Main App -----
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:id" element={<UserPage />} />
      </Routes>
    </Router>
  );
}
