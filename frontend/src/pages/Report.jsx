import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import reports from '../images/report.png';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const Report = () => {
  const [report, setReport] = useState('');
  const [pincodeOfIncident, setPincodeOfIncident] = useState('');
  const [address, setAddress] = useState('');

  const BASE_URL = `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/api/v1`; // Your local backend

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!report.trim()) return toast.error('Report is Required!');
    if (!pincodeOfIncident.trim()) return toast.error('PinCode is Required!');
    if (!address.trim()) return toast.error('Address is Required!');

    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      const token = auth?.token;

      if (!token) return toast.error("Please login first");

      const formData = new FormData();
      formData.append("report", report);
      formData.append("pincodeOfIncident", pincodeOfIncident);
      formData.append("address", address);

      const res = await axios.post(`${BASE_URL}/incidents`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 201) {
        toast.success('Incident Reported Successfully');
        setReport('');
        setPincodeOfIncident('');
        setAddress('');
      }
    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Error in Sending Report');
    }
  };

  return (
    <>
      <Navbar />

      <div className="marginStyle">
        <div className="container d-flex justify-content-center align-items-center">
          <div className="row border rounded-5 p-3 bg-white shadow box-area reverseCol">
            {/* LEFT IMAGE */}
            <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box">
              <div className="featured-image mb-3 animateImg">
                <img src={reports} className="img-fluid" alt="report" />
              </div>
            </div>

            {/* FORM */}
            <form className="col-md-6 right-box" onSubmit={handleSubmit}>
              <div className="row align-items-center">
                <div className="header-text mb-4">
                  <h2>Incident Report</h2>
                  <p>Tell us your incident, we will take action against it!</p>
                </div>

                <div className="input-group mb-3">
                  <input
                    type="number"
                    value={pincodeOfIncident}
                    onChange={(e) => setPincodeOfIncident(e.target.value)}
                    className="form-control form-control-lg border-dark fs-6"
                    placeholder="Enter the Pincode of the Incident"
                    required
                  />
                </div>

                <div className="input-group mb-3">
                  <textarea
                    rows={3}
                    value={report}
                    onChange={(e) => setReport(e.target.value)}
                    className="form-control form-control-lg border-dark fs-6"
                    placeholder="Write the Report of the Incident"
                    required
                  />
                </div>

                <div className="input-group mb-3">
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control form-control-lg border-dark fs-6"
                    placeholder="Enter the Address of the Incident"
                    required
                  />
                </div>

                <div className="d-flex my-3">
                  <button
                    type="submit"
                    className="btn text-white btn-lg btn-block"
                    style={{ width: '100%', backgroundColor: 'blueviolet' }}
                  >
                    Submit Incident
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Report;