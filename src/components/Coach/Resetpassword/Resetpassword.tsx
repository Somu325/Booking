import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Domain_URL } from '../../config';

const Reset: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  //const ${Domain_URL} = 'http://localhost:4000/api';

  const handleResetPassword = async () => {
    const email2 = typeof window !== 'undefined' ? localStorage.getItem('email') : null;

    if (!email2) {
      alert('No email found in localStorage.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(`${Domain_URL}/coach/reset-password`, { email: email2, newPassword });

      if (response.status === 200) {
        alert('Password reset successfully!');
        navigate('/Coach-login');
      }
    } catch (error) {
      alert('There was an error resetting the password. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Inline CSS styles
  const styles = {
    background: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(90deg, rgba(106, 17, 203, 1) 0%, rgba(37, 117, 252, 1) 100%)',
    },
    formBox: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '10px',
      width: '90%',
      maxWidth: '400px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    },
    label: {
      fontSize: '18px',
      color: '#333',
      marginBottom: '12px',
    },
    input: {
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '15px',
      width: '100%',
    },
    button: {
      padding: '12px',
      backgroundColor: '#6A11CB',
      color: '#fff',
      fontSize: '16px',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      width: '100%',
    },
    disabledButton: {
      padding: '12px',
      backgroundColor: '#ccc',
      color: '#fff',
      fontSize: '16px',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '5px',
      cursor: 'not-allowed',
      width: '100%',
    },
  };

  return (
    <div style={styles.background}>
      <div style={styles.formBox}>
        <label style={styles.label}>New Password</label>
        <input
          type="password"
          style={styles.input}
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label style={styles.label}>Confirm Password</label>
        <input
          type="password"
          style={styles.input}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          style={loading ? styles.disabledButton : styles.button}
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </div>
  );
};

export default Reset;
