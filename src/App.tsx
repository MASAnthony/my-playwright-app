import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom'

function LoginComponent() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated authentication
    if (username === 'Anthony' && password === 'Test@123') {
      setError('')
      navigate('/dashboard')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ padding: '60px', width: '100%', minWidth: '400px', maxWidth: '600px', margin: '0 20px', fontFamily: 'sans-serif', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', color: '#333', textAlign: 'left', boxSizing: 'border-box' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '30px', color: '#111' }}>Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '8px', fontSize: '1.1rem', fontWeight: 500 }}>Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1.1rem', backgroundColor: '#f9f9f9', color: '#333' }}
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontSize: '1.1rem', fontWeight: 500 }}>Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1.1rem', backgroundColor: '#f9f9f9', color: '#333' }}
              placeholder="Enter password"
              required
            />
          </div>
          
          {error && <p id="error-message" style={{ color: '#d32f2f', margin: 0, fontWeight: 500, fontSize: '1.05rem', textAlign: 'center' }}>{error}</p>}
          
          <button 
            id="login-button" 
            type="submit" 
            style={{ marginTop: '10px', padding: '14px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '6px', fontSize: '1.2rem', fontWeight: 600, transition: 'background-color 0.2s' }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

function DashboardComponent() {
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ padding: '60px', width: '100%', minWidth: '400px', maxWidth: '600px', margin: '0 20px', textAlign: 'center', fontFamily: 'sans-serif', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', color: '#333' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Dashboard Overview</h2>
        <p id="success-message" style={{ fontSize: '1.2rem', marginBottom: '30px' }}>Welcome! You have successfully logged in.</p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Link to="/user" style={{ padding: '12px 24px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '6px', fontSize: '1.1rem', fontWeight: 600 }}>Manage Users</Link>
          <button 
            id="logout-button" 
            onClick={() => navigate('/')} 
            style={{ padding: '12px 24px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1.1rem', fontWeight: 600 }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

function UserComponent() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ padding: '60px', width: '100%', minWidth: '400px', maxWidth: '600px', margin: '0 20px', textAlign: 'center', fontFamily: 'sans-serif', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', color: '#333' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>User Management</h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>Here you can view and edit user details.</p>
        <Link to="/dashboard" style={{ padding: '12px 24px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '6px', fontSize: '1.1rem', fontWeight: 600 }}>Back to Dashboard</Link>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/dashboard" element={<DashboardComponent />} />
        <Route path="/user" element={<UserComponent />} />
      </Routes>
    </Router>
  )
}

export default App