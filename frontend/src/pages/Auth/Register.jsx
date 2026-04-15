import React, { useEffect, useState } from 'react'
import '../../styles/auth.css'
import { Link, useNavigate } from 'react-router-dom'
import register from '../../images/register.png'
import axios from 'axios'
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate()
    const [uname, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [emergencyNo, setEmrNumber] = useState('')
    const [emergencyMail, setEmrEmail] = useState('')
    const [pincode, setPincode] = useState('')

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Register clicked"); // ✅ DEBUG

        if (!uname.trim()) return toast.error('Name is required');

        if (!email.trim()) {
            toast.error('Email is required');
            return;
        }
        if (!validateEmail(email)) {
            toast.error('Invalid Email Format');
            return;
        }

        if (!phone.trim()) return toast.error('Phone Number is required');
        if (!password.trim()) return toast.error('Password is required');
        if (!emergencyNo.trim()) return toast.error('Emergency Number is required');
        if (phone === emergencyNo) return toast.error('Numbers must be different');
        if (!emergencyMail.trim()) return toast.error('Emergency Email is required');
        if (email === emergencyMail) return toast.error('Emails must be different');
        if (!pincode.trim()) return toast.error('Pincode is required');

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/api/v1/users/register`,
                {
                    uname,
                    email,
                    phone,
                    password,
                    emergencyNo,
                    emergencyMail,
                    pincode
                }
            );

            if (res.status === 201) {
                toast.success("Register Successfully");
                navigate('/login');
            }

        } catch (err) {
            console.log(err);
            if (err.response && err.response.status === 400) {
                toast.error("Email Already Exists!");
            } else {
                toast.error("Error While Register");
            }
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className='my-5'>
            <div className="container d-flex justify-content-center align-items-center">
                <div className="row border rounded-5 p-3 bg-white shadow box-area reverseCol">

                    <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box">
                        <div className="featured-image mb-3 animateImg">
                            <img src={register} className="img-fluid mt-5" width={500} alt="register" />
                        </div>
                    </div>

                    <div className="col-md-6 right-box">

                        {/* ✅ FORM START */}
                        <form onSubmit={handleSubmit} className="row align-items-center">

                            <div className="header-text mb-2">
                                <h2>Welcome</h2>
                                <p>We are happy to have you Here</p>
                            </div>

                            <input value={uname} onChange={(e) => setName(e.target.value)} className="form-control mb-2" placeholder="Full Name" />
                            <input value={email} onChange={(e) => setEmail(e.target.value)} className="form-control mb-2" placeholder="Email Address" />
                            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control mb-2" placeholder="Phone Number" />
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control mb-2" placeholder="Password" />
                            <input value={emergencyNo} onChange={(e) => setEmrNumber(e.target.value)} className="form-control mb-2" placeholder="Emergency Number" />
                            <input value={emergencyMail} onChange={(e) => setEmrEmail(e.target.value)} className="form-control mb-2" placeholder="Emergency Email" />
                            <input value={pincode} onChange={(e) => setPincode(e.target.value)} className="form-control mb-2" placeholder="Pincode" />

                            <button type="submit" className="btn btn-lg text-white mt-3" style={{ backgroundColor: 'blueviolet', width: '100%' }}>
                                Register
                            </button>

                            <Link to='/login' className="btn btn-outline-dark mt-2" style={{ width: '100%' }}>
                                Login
                            </Link>

                        </form>
                        {/* ✅ FORM END */}

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Register;