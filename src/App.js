import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
  Link,
  NavLink,
} from 'react-router-dom';
import './App.css';

// ----- Sidebar Component -----
function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>
        <h2>Dementia Admin</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="9"></rect>
                <rect x="14" y="3" width="7" height="5"></rect>
                <rect x="14" y="12" width="7" height="9"></rect>
                <rect x="3" y="16" width="7" height="5"></rect>
              </svg>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/users" className={({ isActive }) => isActive ? "active" : ""}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Users
            </NavLink>
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

// ----- Bar Chart Component -----
function BarChart({ data }) {
  const maxValue = Math.max(...data.map(item => item.value), 1); // safety for empty or all-zero

  return (
    <div className="chart-container">
      <div className="bar-chart">
        {data.map((item, index) => {
          const barHeight = Math.max((item.value / maxValue) * 100, 8); // min 8% height
          const barColor = item.color || `hsl(${index * 40}, 70%, 60%)`;

          return (
            <div key={index} className="bar-container">
              <div 
                className="bar" 
                style={{
                  height: `${barHeight}%`,
                  backgroundColor: barColor
                }}
              >
                <span className="bar-value">{item.value}</span>
              </div>
              <div className="bar-label">{item.label}</div>
            </div>
          );
        })}
      </div>
      <div className="chart-axis"></div>
    </div>
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
            <button onClick={() => navigate('/users')} className="back-button">
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

// ----- Dashboard Page -----
function Dashboard() {
  const [users, setUsers] = useState([]);
  const [domainStats, setDomainStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // useEffect(() => {
  //   setLoading(true);
  //   fetch('https://dementia-backend-gamma.vercel.app/api/users')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setUsers(data.users);
        
  //       // Calculate domain stats
  //       const domains = {};
  //       const categories = {};
        
  //       // Process all users
  //       data.users.forEach(user => {
  //         // Check if user has activities
  //         if (user.activities && user.activities.length > 0) {
  //           // Process each activity
  //           user.activities.forEach(activity => {
  //             // Count domains
  //             if (activity.domain) {
  //               domains[activity.domain] = (domains[activity.domain] || 0) + 1;
  //             }
              
  //             // Count categories
  //             if (activity.category) {
  //               categories[activity.category] = (categories[activity.category] || 0) + 1;
  //             }
  //           });
  //         }
  //       });
        
  //       // Convert domain counts to array for chart
  //       const domainData = Object.entries(domains).map(([label, value]) => ({
  //         label,
  //         value
  //       })).sort((a, b) => b.value - a.value).slice(0, 8); // Get top 8 domains
        
  //       // Convert category counts to array for chart
  //       const categoryData = Object.entries(categories).map(([label, value]) => ({
  //         label,
  //         value,
  //         color: `hsl(${Math.floor(Math.random() * 260)}, 70%, 65%)`
  //       })).sort((a, b) => b.value - a.value).slice(0, 8); // Get top 8 categories
        
  //       setDomainStats(domainData);
  //       setCategoryStats(categoryData);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error('Error fetching users:', err);
  //       setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    setLoading(true);
    fetch('https://dementia-backend-gamma.vercel.app/api/users')
      .then((res) => res.json())
      .then(async (data) => {
        const enrichedUsers = await Promise.all(
          data.users.map(async (user) => {
            try {
              const res = await fetch(`https://dementia-backend-gamma.vercel.app/api/users/${user._id}`);
              const fullUser = await res.json();
              return fullUser.user;
            } catch (err) {
              console.error('Failed to fetch user by ID:', user._id);
              return user;
            }
          })
        );
  
        setUsers(enrichedUsers);
  
        // Aggregate domain + category stats
        const domains = {};
        const categories = {};
  
        enrichedUsers.forEach(user => {
          if (user.activities) {
            user.activities.forEach(activity => {
              domains[activity.domain] = (domains[activity.domain] || 0) + 1;
              categories[activity.category] = (categories[activity.category] || 0) + 1;
            });
          }
        });
  
        const domainData = Object.entries(domains).map(([label, value]) => ({
          label, value
        })).sort((a, b) => b.value - a.value).slice(0, 8);
  
        const categoryData = Object.entries(categories).map(([label, value]) => ({
          label, value,
          color: `hsl(${Math.floor(Math.random() * 260)}, 70%, 65%)`
        })).sort((a, b) => b.value - a.value).slice(0, 8);
  
        setDomainStats(domainData);
        setCategoryStats(categoryData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setLoading(false);
      });
  }, []);
  

  // Calculate total activities
  const totalActivities = users.reduce((total, user) => {
    return total + (user.activities ? user.activities.length : 0);
  }, 0);

  // Find the most active users
  const activeUsers = [...users]
    .sort((a, b) => {
      const aCount = a.activities ? a.activities.length : 0;
      const bCount = b.activities ? b.activities.length : 0;
      return bCount - aCount;
    })
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <h1>Analytics Dashboard</h1>
        <button className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
            <path d="M21 12a9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9z"></path>
            <path d="M9 12l2 2 4-4"></path>
          </svg>
          Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="stats-grid">
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
            
            <div className="stat-card">
              <div className="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20v-6M6 20V10M18 20V4"></path>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-label">Total Activities</div>
                <div className="stat-value">{totalActivities}</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-label">Avg. Activities Per User</div>
                <div className="stat-value">
                  {users.length ? (totalActivities / users.length).toFixed(1) : 0}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Popular Categories</h2>
            </div>
            {categoryStats.length > 0 ? (
              <BarChart data={categoryStats} />
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No category data available</p>
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Top Domains</h2>
            </div>
            {domainStats.length > 0 ? (
              <BarChart data={domainStats} />
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No domain data available</p>
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Most Active Users</h2>
            </div>
            {activeUsers.length > 0 ? (
              <div className="user-list">
                {activeUsers.map(user => {
                  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
                  const activityCount = user.activities ? user.activities.length : 0;
                  
                  return (
                    <div key={user._id} className="user-item" onClick={() => navigate(`/user/${user._id}`)}>
                      <div className="user-item-header">
                        <div className="user-avatar">{userInitial}</div>
                        <div>
                          <div className="user-name">{user.name || 'Unnamed User'}</div>
                          <div className="user-id">{activityCount} activities</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No user activity data available</p>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

// ----- Users Page -----
function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        <h1>User Management</h1>
        <button className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
            <path d="M21 12a9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9z"></path>
            <path d="M9 12l2 2 4-4"></path>
          </svg>
          Refresh Data
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>All Users</h2>
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
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/user/:id" element={<UserPage />} />
      </Routes>
    </Router>
  );
}
