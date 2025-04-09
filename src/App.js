import React, { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch all users
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

  const handleUserClick = (id) => {
    fetch(`https://dementia-backend-gamma.vercel.app/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedUser(data);
      })
      .catch((err) => {
        console.error('Error fetching user by ID:', err);
      });
  };

  const renderUserDetails = (userData) => {
    const user = userData.user;

    return (
      <div style={{
        marginTop: '30px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        backgroundColor: '#fafafa',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Selected User Details</h2>

        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user._id}</p>
        <p><strong>Session Token:</strong> <code>{user.sessionToken}</code></p>

        <h3 style={{ marginTop: '20px' }}>Activities:</h3>
        {user.activities.length > 0 ? (
          <ul style={{ paddingLeft: '20px' }}>
            {user.activities.map((activity) => (
              <li key={activity._id} style={{ marginBottom: '10px' }}>
                <strong>Category:</strong> {activity.category} <br />
                <strong>Domain:</strong> {activity.domain} <br />
                <strong>Count:</strong> {activity.count} <br />
                <strong>Last Played:</strong> {new Date(activity.lastPlayed).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No activities found.</p>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>🧠 Dementia Admin Panel</h1>
      <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>All Users</h2>

      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {users.map((user) => (
          <li
            key={user._id}
            onClick={() => handleUserClick(user._id)}
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

      {selectedUser && renderUserDetails(selectedUser)}
    </div>
  );
}

export default App;
