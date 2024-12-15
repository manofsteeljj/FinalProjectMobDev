import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Validation: Check if fields are empty
    if (!username || !password) {
      setError('Please fill in both fields');
      return;
    }

    // Using axios to make a POST request
    axios
      .post('http://192.168.1.2/finalprojectv2/validate_loginjs.php', {
        username,
        password
      })
      .then((response) => {
        const data = response.data;

        if (data.status === 'success') {
          console.log('Login successful:', data);

          // Store user_id in localStorage after successful login
          localStorage.setItem('user_id', data.user_id);  // Assuming the response includes a user_id

          // Clear any previous errors and redirect to dashboard
          setError(null);
          navigate('/dashboard');
        } else {
          setError(data.message || 'Login failed');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('An unexpected error occurred.');
      });
  };

  return (
    <div style={styles.body}>
      <div style={styles.loginContainer}>
        <h1 style={styles.header}>Login</h1>
        {error && <p style={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
        <div style={styles.registerContainer}>
          <p>Don't have an account?</p>
          <button
            onClick={() => navigate('/register')}  // Updated to use navigate
            style={styles.registerButton}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  body: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
    fontFamily: 'Arial, sans-serif',
    color: '#fff',
  },
  loginContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: '20px 40px',
    borderRadius: '10px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  },
  header: {
    marginBottom: '20px',
    fontSize: '2.5rem',
    fontWeight: '600',
    color: '#f4f4f9',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '15px 0',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#f9f9f9',
    color: '#333',
    fontSize: '16px',
  },
  button: {
    backgroundColor: '#4e73df',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '20px',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  errorMessage: {
    color: '#ff6b6b',
    animation: 'shake 0.5s ease-in-out',
  },
  registerContainer: {
    marginTop: '20px',
  },
  registerButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default Login;
