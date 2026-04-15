import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Navbar from "../Components/Navbar/Navbar";
import { toast } from "react-hot-toast";

// Fix missing marker icons in leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const LiveLocationView = () => {
  const { userId } = useParams();
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLocation = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/api/v1/location/${userId}`
      );
      const data = await res.json();
      if (res.status === 200 && data.success) {
        setLocationData(data.location);
      }
    } catch (error) {
      console.error("Error fetching live location:", error);
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchLocation();

    // Poll every 5 seconds
    const interval = setInterval(fetchLocation, 5000);

    return () => clearInterval(interval);
  }, [userId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "50px", textAlign: "center" }}>
          <h3>Locating user...</h3>
        </div>
      </>
    );
  }

  if (!locationData) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "50px", textAlign: "center" }}>
          <h3>No live location data available for this user.</h3>
        </div>
      </>
    );
  }

  const { lat, long, user, updatedAt } = locationData;
  const timeStr = new Date(updatedAt).toLocaleTimeString();

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px", background: "#f9f9f9" }}>
        <h2 style={{ color: "#d9534f" }}>🔴 Live Tracking</h2>
        <p>
          <strong>User:</strong> {user?.uname || "Unknown"} | {" "}
          <strong>Emergency Contact:</strong> {user?.emergencyNo || "N/A"}
        </p>
        <p style={{ color: "gray", fontSize: "14px" }}>
          Last updated: {timeStr}
        </p>

        <div style={{ height: "600px", width: "100%", borderRadius: "10px", overflow: "hidden", border: "2px solid #ddd" }}>
          <MapContainer 
            center={[lat, long]} 
            zoom={16} 
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, long]}>
              <Popup>
                {user?.uname}'s current location.<br />
                Updated at {timeStr}.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default LiveLocationView;
