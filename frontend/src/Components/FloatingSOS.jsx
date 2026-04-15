import React, { useState, useCallback } from 'react';
import { useAuth } from '../context/auth';
import { toast } from 'react-hot-toast';
import './FloatingSOS.css';

const FloatingSOS = () => {
  const [auth] = useAuth();
  const [isSending, setIsSending] = useState(false);

  const handleSOS = useCallback(async () => {
    if (!auth?.user?._id) {
      toast.error('Please login first to use SOS');
      return;
    }

    setIsSending(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;

          try {
            const payload = {
              userId: auth?.user?._id,
              lat,
              long,
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
              toast.error(data.message || "Failed to send SOS");
            }
          } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
          } finally {
            setIsSending(false);
          }
        },
        (error) => {
          console.error(error);
          toast.error("Allow location access to send SOS");
          setIsSending(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
      setIsSending(false);
    }
  }, [auth]);

  return (
    <div className="floating-sos-container">
      <button 
        className={`floating-sos-btn ${isSending ? 'pulse' : ''}`}
        onClick={handleSOS}
        disabled={isSending}
        title="Emergency SOS"
      >
        SOS
      </button>
    </div>
  );
};

export default FloatingSOS;
