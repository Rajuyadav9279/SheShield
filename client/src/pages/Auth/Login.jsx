import React, { useEffect, useState } from 'react';
import '../../styles/auth.css';
import { Link, useNavigate } from 'react-router-dom';
import loginImg from '../../images/login.png';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  // Validate email format
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      toast.error('Email is required');
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      toast.error('Invalid Email Format');
      return;
    }
    if (!trimmedPassword) {
      toast.error('Password is required');
      return;
    }

    try {
      // Use your local backend URL if remote is suspended
      const res = await axios.post('http://localhost:8000/api/v1/users/login', {
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (res.status === 200) {
        toast.success('Login Successfully');

        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });

        localStorage.setItem('auth', JSON.stringify(res.data));
        navigate('/'); // redirect to dashboard/home
      }
    } catch (err) {
      console.log(err.response?.data || err);
      toast.error(err.response?.data?.message || 'Invalid Email or Password');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="marginStyle">
      <div className="container d-flex justify-content-center align-items-center">
        <div className="row border rounded-5 p-3 bg-white shadow box-area reverseCol">
          {/* Left Image */}
          <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box">
            <div className="featured-image mb-3 animateImg">
              <img src={loginImg} alt="Login illustration" className="img-fluid" width={500} />
            </div>
          </div>

          {/* Right Form */}
          <div className="col-md-6 right-box">
            <div className="row align-items-center">
              <div className="header-text mb-4">
                <h2>Welcome</h2>
                <p>We are happy to have you back</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="input-group d-flex align-items-center mb-3">
                  <input
                    type="email"
                    className="form-control form-control-lg border-dark fs-6"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group d-flex flex-row align-items-center mb-3">
                  <input
                    type="password"
                    className="form-control form-control-lg border-dark fs-6"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-flex flex-row align-items-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-lg text-white"
                    style={{ backgroundColor: 'blueviolet', width: '100%' }}
                  >
                    Login
                  </button>
                </div>
              </form>

              <div className="d-flex flex-row align-items-center my-3">
                <Link
                  to="/register"
                  className="btn btn-outline-dark btn-lg btn-block"
                  style={{ width: '100%' }}
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;