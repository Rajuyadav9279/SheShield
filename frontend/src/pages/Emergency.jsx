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
        "http://localhost:8000/api/v1/emergency/emergencyPressed",
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
