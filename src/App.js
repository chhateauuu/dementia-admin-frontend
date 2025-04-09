import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from 'react-router-dom';

// ----- User List -----
function UserList({ users }) {
  const navigate = useNavigate();

  return (
    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
      {users.map((user) => (
        <li
          key={user._id}
          onClick={() => navigate(`/user/${user._id}`)}
          style={{
            cursor: 'pointer',
            backgroundColor: '#f0f0f0',
            padding: '10px 15px',
            marginBottom: '10px',
            borderRadius: '6px',
            transition: '0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
        >
          {user.name || 'Unnamed'} (ID: {user._id})
        </li>
      ))}
    </ul>
  );
}

// ----- User Details Page -----
function UserPage() {
  const { id } = useParams();
  const [selectedUser, setSelectedUser] = useState(null);

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

  if (!selectedUser) return <p>Loading...</p>;

  const user = selectedUser.user;

  return (
    <div style={{ padding: '20px' }}>
      <h2>🧑‍⚕️ User: {user.name}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Session Token:</strong> <code>{user.sessionToken}</code></p>

      <h3>Activities</h3>
      {user.activities.length > 0 ? (
        <ul>
          {user.activities.map((act) => (
            <li key={act._id} style={{ marginBottom: '10px' }}>
              <strong>{act.category}</strong> - {act.domain}<br />
              Count: {act.count}, Last Played: {new Date(act.lastPlayed).toLocaleString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No activities</p>
      )}
    </div>
  );
}

// ----- Home Page -----
function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('https://dementia-backend-gamma.vercel.app/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
      });
  }, []);

  return (
    <div style={{ padding: '40px' }}>
      <h1>Dementia Admin Panel</h1>
      <h2>All Users</h2>
      <UserList users={users} />
    </div>
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
