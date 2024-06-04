import React, { useState } from 'react';
import { Outlet, Link } from "react-router-dom";
import Vlog from './images/vlog.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';
import { getJwt } from "./auth/jwt";

function Layout() {
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const navigate = useNavigate();
  const jwt = getJwt();

  // Function to open the modal
  const openModal = () => {
    setShowModal(true);
  }

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
  }

  // Function to handle scheduler
  const handleScheduler = async () => {
    try {
      const response = await fetch('http://localhost:3000/scheduler', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': jwt,
        },
      })

      const data = await response.json()

      if (data.err === "Invalid authorization, no authorization headers" || 
          data.err === "Invalid authorization, invalid authorization scheme") {
        console.log('Error authenticating jwt')
      } else if (data.success) {
        navigate('/vlog/new')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="layout" style={{backgroundColor: '#343a40'}}>
      {/* Navbar */}
      <nav className="navbar navbar-light bg-dark py-3 d-flex justify-content-between align-items-center">
        <Link to='/vlog' className="navbar-brand mb-0 h1 text-light fs-1">
          <img src={Vlog} alt="Vlog" style={{ width: '100px', height: '100px' }} />
        </Link>
        {/* Add Icon */}
        <button type='button' onClick={openModal} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faCirclePlus} size="lg" style={{ color: "#8CB561", fontSize: "50px" }} />
        </button>
      </nav>

      {/* Bootstrap Modal */}
      {showModal && (
        <div className="modal fade show" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Add Item</h5>
                <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {/* Add your form or content for adding item here */}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                {/* Add button to save item here */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <nav className="footer d-flex justify-content-center align-items-center fixed-bottom navbar-dark bg-dark">
        <Link to='/login' className="navbar-brand mb-0 h1 text-light fs-1">Logout</Link>
      </nav>

      <Outlet />
    </div>
  );
}

export default Layout;
