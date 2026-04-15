import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Dash/Sidebar";
import toast from "react-hot-toast";

const Dashboard = () => {

  const [incidentreport, setincidentreport] = useState([]);
  const [report, setReport] = useState("");
  const [ack, setAck] = useState(false);

  // ✅ FIXED BASE URL
  const BASE_URL = "http://localhost:8000/api/v1";

  // ================= GET INCIDENTS =================
  const getAllIncident = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const res = await fetch(`${BASE_URL}/incidents`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setincidentreport(data);
      } else {
        toast.error(data.message || "Failed to fetch incidents");
      }

    } catch (err) {
      console.log("GET ERROR:", err);
      toast.error("Server Error");
    }
  };

  // ================= ACKNOWLEDGE =================
  const acknowledge = async (incId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const res = await fetch(`${BASE_URL}/incidents/${incId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Updated Successfully");
      } else {
        toast.error(data.message || "Update failed");
      }

    } catch (e) {
      console.log("PATCH ERROR:", e);
      toast.error("Error while Updating!");
    } finally {
      setAck(!ack);
    }
  };

  // ================= LOAD DATA =================
  useEffect(() => {
    getAllIncident();
  }, [ack]);

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="container">
        <h2 className="text-center mt-3">Women Incident Data</h2>

        <table className="table mt-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>Report</th>
              <th>Address</th>
              <th>Pincode</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {incidentreport.length > 0 ? (
              incidentreport.map((p) => (
                <tr key={p._id}>
                  
                  {/* NAME */}
                  <td style={{ color: p.isSeen ? "green" : "red" }}>
                    {p.uname || "Unknown"}
                  </td>

                  {/* REPORT */}
                  <td>
                    {p.isSeen ? (
                      p.report
                    ) : (
                      <button
                        className="btn btn-dark btn-sm"
                        onClick={() => setReport(p.report)}
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        View
                      </button>
                    )}
                  </td>

                  {/* ADDRESS */}
                  <td>{p.address}</td>

                  {/* PINCODE */}
                  <td>{p.pincode}</td>

                  {/* DATE */}
                  <td>
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleString()
                      : "N/A"}
                  </td>

                  {/* STATUS */}
                  <td>
                    {p.isSeen ? (
                      <button className="btn btn-success btn-sm">
                        Done
                      </button>
                    ) : (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => acknowledge(p._id)}
                      >
                        Ack
                      </button>
                    )}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No incidents found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <div className="modal fade" id="exampleModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Incident Report</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {report}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;