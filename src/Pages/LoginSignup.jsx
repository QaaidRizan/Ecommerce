import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CSS/LoginSignup.css';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    username: '', // Changed from 'name' to 'username'
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: '', // Changed from 'name' to 'username'
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setErrors({ username: '', email: '', password: '' }); // Changed from 'name' to 'username'
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { username: '', email: '', password: '' }; // Changed from 'name' to 'username'

    if (!isLogin && !formData.username) { // Changed from 'name' to 'username'
      newErrors.username = 'Username is required'; // Changed from 'Name is required'
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        if (isLogin) {
          // Login logic here
          const response = await axios.get('http://localhost:8080/db-api/login/users');
          const users = response.data;

          const user = users.find(
            (user) => user.email === formData.email && user.password === formData.password
          );

          if (user) {
            navigate('/dashboard');
          } else {
            alert('Invalid email or password');
          }
        } else {
          // Sign-up logic here
          await axios.post('http://localhost:8080/db-api/login/users/login', formData);
          alert('User created successfully!');
          setIsLogin(true);
        }
      } catch (error) {
        console.error('Error during form submission:', error.response || error.message);
        alert('An error occurred. Please try again.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        <form onSubmit={handleSubmit}>
          <div className="loginsignup-fields">
            {!isLogin && (
              <input
                type="text"
                name="username" // Changed from 'name' to 'username'
                value={formData.username}
                onChange={handleChange}
                placeholder='Username' // Changed from 'User Name'
              />
            )}
            {errors.username && <p className="error">{errors.username}</p>} {/* Changed from 'name' to 'username' */}

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder='Email Address'
            />
            {errors.email && <p className="error">{errors.email}</p>}

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder='Enter Password'
            />
            {errors.password && <p className="error">{errors.password}</p>}

            <button type="submit">{isLogin ? 'Login' : 'Continue'}</button>
          </div>
        </form>
        <p className="loginsignup-toggle">
          {isLogin ? (
            <>Don't have an account? <span onClick={handleToggle}>Sign up here</span></>
          ) : (
            <>Already have an account? <span onClick={handleToggle}>Login here</span></>
          )}
        </p>
      </div>
    </div>
  );
}

export default LoginSignup;
