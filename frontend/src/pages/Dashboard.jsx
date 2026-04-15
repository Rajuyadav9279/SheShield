import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Dash/Sidebar";
import { useAuth } from "../context/auth";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [auth] = useAuth();
  const [emerg, setEmer] = useState([]);
  const [ack, setAck] = useState(false);
  const [txt, setTxt] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://womensecbackend.onrender.com/api/v1/emergency",
          { method: "GET", headers: { "Content-type": "application/json" } }
        );

        if (res.status === 200) {
          const data = await res.json();
          setEmer(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [ack]);

  const ackn = async (uid) => {
    try {
      const res = await fetch(
        `https://womensecbackend.onrender.com/api/v1/emergency/${uid}`,
        { method: "PATCH", headers: { "Content-type": "application/json" } }
      );
      if (res.status === 200) toast.success("Updated Successfully");
    } catch (e) {
      toast.error("Error while Updating!");
    } finally {
      setAck(!ack);
    }
  };

  const addChat = async (receiverId, emergId) => {
    if (!txt.trim()) return;
    try {
      const payload = {
        senderId: auth?.user?._id,
        receiverId,
        text: txt,
        emergId,
      };
      const res = await fetch(
        "https://womensecbackend.onrender.com/api/v1/chats",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (res.status === 201) {
        toast.success("Chat added");
        setTxt("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="d-flex justify-content-start">
      <Sidebar />
      <div className="container table-responsive mx-3">
        <div className="features_wrapper" style={{ marginTop: "-50px" }}>
          <div className="row">
            <div className="col-12 text-center">
              <p className="features_subtitle">Latest Women Emergency Alert!</p>
              <h2 className="features_title">Women Emergency Data</h2>
            </div>
          </div>
        </div>

        <table
          className="table table-striped table-bordered table-hover"
          style={{ marginTop: "-50px" }}
        >
          <thead className="table-dark text-center">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Address of Incident</th>
              <th scope="col">Map View</th>
              <th scope="col">Emergency No.</th>
              <th scope="col">Incident recorded at</th>
              <th scope="col">Acknowledgement Status</th>
              <th scope="col">Chat with victim</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {emerg.map((ee, index) => (
              <React.Fragment key={ee._id || index}>
                <tr>
                  <th scope="row" style={{ color: ee.isResolved ? "green" : "red" }}>
                    {ee.username}
                  </th>
                  <td>{ee.addressOfInc}</td>
                  <td>
                    <a
                      href={ee.mapLct}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                    >
                      View in map
                    </a>
                  </td>
                  <td>{ee.emergencyNo}</td>
                  <td>{ee.createdAt}</td>
                  <td>
                    {ee.isResolved ? (
                      <button className="btn btn-success">Acknowledged</button>
                    ) : (
                      <button onClick={() => ackn(ee._id)} className="btn btn-danger">
                        Acknowledge
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-dark"
                      data-bs-toggle="modal"
                      data-bs-target={`#modal-${ee._id}`}
                    >
                      Chat
                    </button>
                  </td>
                </tr>

                {/* Modal */}
                <div
                  className="modal fade"
                  id={`modal-${ee._id}`}
                  tabIndex="-1"
                  aria-labelledby={`modalLabel-${ee._id}`}
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id={`modalLabel-${ee._id}`}>
                          Chat with {ee.username}
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div className="d-flex justify-content-start align-items-start">
                          <p>Hello <br /> -Rehman</p>
                        </div>
                        <div className="d-flex justify-content-end align-items-end">
                          <p>Hello <br /> -Rehman</p>
                        </div>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            addChat(ee.userId, ee._id);
                          }}
                        >
                          <div className="d-flex">
                            <input
                              className="form-control mx-3"
                              value={txt}
                              onChange={(e) => setTxt(e.target.value)}
                              type="text"
                              placeholder="Enter your message"
                            />
                            <button className="btn btn-primary" type="submit">
                              Submit
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;