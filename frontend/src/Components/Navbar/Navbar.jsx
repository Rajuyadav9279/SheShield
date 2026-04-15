import React, { useEffect } from 'react';
import { BiMenuAltRight } from 'react-icons/bi';
import logo from '../../images/logo.png';
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import '../../styles/navbar.css';
import { useAuth } from '../../context/auth';

const Navbar = () => {
  const [auth, setAuth] = useAuth();

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: '' });
    localStorage.removeItem('auth');
    toast.success('Logged Out Successfully');
  };

  useEffect(() => {
    const navLinks = document.querySelectorAll(".nav-link");
    const navCollapse = document.querySelector(".navbar-collapse.collapse");

    const handleNavClick = () => {
      navCollapse.classList.remove("show");
    };

    navLinks.forEach((link) => link.addEventListener("click", handleNavClick));
    return () => navLinks.forEach((link) => link.removeEventListener("click", handleNavClick));
  }, []);

  return (
    <header className='header_wrapper'>
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-fluid mx-3">
          {/* LOGO */}
          <Link to='/'>
            <img src={logo} alt="Logo" style={{ width: '130px' }} />
          </Link>

          {/* TOGGLER BUTTON */}
          <button
            className="navbar-toggler pe-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <BiMenuAltRight size={35} />
          </button>

          <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
            {/* LEFT LINKS */}
            <ul className="navbar-nav menu-navbar-nav">
              <li className="nav-item">
                <Link to='/' className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to='/about' className="nav-link">About Us</Link>
              </li>
              <li className="nav-item">
                <Link to='/contact' className="nav-link">Contact Us</Link>
              </li>
              <li className="nav-item">
                <Link to='/report' className="nav-link">Report Incident</Link>
              </li>
              <li className="nav-item">
                <Link to='/emergency' className="nav-link learn-more-btn-logout">Emergency</Link>
              </li>
            </ul>

            {/* RIGHT AUTH BUTTONS */}
            <ul className="navbar-nav">
              {!auth?.user ? (
                <>
                  <li className="nav-item">
                    <Link to='/login' className="nav-link learn-more-btn btn-extra-header">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to='/register' className="nav-link learn-more-btn">Register</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link
                      to={`/dashboard${auth?.user?.role === 1 ? "/" : "/profile"}`}
                      className="nav-link learn-more-btn"
                    >
                      {auth?.user?.role === 1 ? 'Dashboard' : 'Profile'}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <span
                      onClick={handleLogout}
                      className="nav-link learn-more-btn-logout"
                      style={{ cursor: 'pointer' }}
                    >
                      Logout
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;