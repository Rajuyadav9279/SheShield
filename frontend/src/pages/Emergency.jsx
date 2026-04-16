import React, { useState, useEffect, useCallback } from "react";
import "../styles/Emergency.css";
import { PiShieldCheckBold } from "react-icons/pi";
import Parallelx from "../Components/Parallelx";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import { useAuth } from "../context/auth";
import { toast } from "react-hot-toast";

const Emergency = () => {
  const [long, setLong] = useState("");
  const [lat, setLat] = useState("");
  const [auth] = useAuth();

  const handleSubmit = async () => {
    try {
      if (!auth?.user?._id) {
        toast.error("Please login first");
        return;
      }

      if (!lat || !long) {
        toast.error("Location not loaded");
        return;
      }

      const payload = {
        userId: auth?.user?._id,
        lat: lat,
        long: long,
      };

      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/api/v1/emergency/emergencyPressed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.status === 200) {
        toast.success("SOS SENT SUCCESSFULLY");
        toast.success("Live Location Tracking Started! 📍");

        // Start live tracking
        if (navigator.geolocation) {
          navigator.geolocation.watchPosition(
            async (pos) => {
              try {
                await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:8000"}/api/v1/location/update`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ 
                    userId: auth?.user?._id, 
                    lat: pos.coords.latitude, 
                    long: pos.coords.longitude 
                  })
                });
              } catch (e) {
                console.error("Live track error:", e);
              }
            },
            (err) => console.error("Watch location error:", err),
            { enableHighAccuracy: true, maximumAge: 2000 }
          );
        }

      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const showPosition = (position) => {
    setLat(position.coords.latitude);
    setLong(position.coords.longitude);
  };

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        showPosition,
        (error) => {
          console.log(error);
          toast.error("Allow location access");
        }
      );
    }
  }, []);

  useEffect(() => {
    getLocation();
    window.scrollTo(0, 0);
  }, [getLocation]);

  return (
    <>
      <Navbar />
      <div className="heightRes">
        <section className="banner_wrapper">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-12 text-center">
                <p className="banner-subtitle">
                  SheShield – Your Safety Our Priority
                </p>

                <h1 className="banner-title mb-5">
                  Help us bring <span>Women Safety</span> to Reality
                </h1>

                <button className="button-30" onClick={handleSubmit}>
                  <PiShieldCheckBold size={180} color="red" />
                </button>

                <div className="mt-5">
                  <h4 className="fw-bold mb-3">National Emergency Helplines</h4>
                  <div className="d-flex flex-wrap justify-content-center gap-3">
                    <a href="tel:112" className="btn btn-danger btn-lg rounded-pill fw-bold px-4 py-2 shadow-sm d-flex align-items-center gap-2">
                      🚓 Police Helpline (112)
                    </a>
                    <a href="tel:1091" className="btn btn-danger btn-lg rounded-pill fw-bold px-4 py-2 shadow-sm d-flex align-items-center gap-2">
                      👩 Women Helpline (1091)
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Parallelx />
      <Footer />
    </>
  );
};

export default Emergency;
