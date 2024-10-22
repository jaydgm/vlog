import React, { useState } from 'react';
import { Outlet, Link } from "react-router-dom";
import Vlog from './images/vlog.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faArrowRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';
import { getJwt } from "./auth/jwt";
import SchedulerModal from './components/SchedulerModal'
import Profile from './components/Profile';

function Layout() {
  const [showModal, setShowModal] = useState(false)

  const navigate = useNavigate();
  const jwt = getJwt();



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

  const handleModal = () => {
    setShowModal(prevShowModal => !showModal)
    console.log(showModal)
  }

  return (
    <>
    <div className="layout" style={{backgroundColor: '#343a40'}}>
      {/* Navbar */}
      <nav className="navbar navbar-light bg-dark py-3 d-flex justify-content-between align-items-center">
        <Link to='/vlog' className="icons mb-0 h1 text-light fs-1">
          <img src={Vlog} alt="Vlog"/>
        </Link>
        {/* Add Icon */}
        <button type='button' className="icons" onClick={handleModal} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <FontAwesomeIcon className="fontAwesome" icon={faCirclePlus} size="lg" />
        </button>
        <SchedulerModal handleModal={handleModal} showModal={showModal} />
      </nav>

      {/* Footer */}
      <nav className="footer d-flex justify-content-evenly align-items-center fixed-bottom navbar-dark bg-dark">
        <Link to='/' className="icons mb-0 h1 text-light fs-1">  
          <FontAwesomeIcon className="fontAwesome"  icon={faArrowRightFromBracket} />
        </Link>
        <Link to='/vlog/profile' className="icons">
          <FontAwesomeIcon className="fontAwesome"  icon={faUser} />  
        </Link>
      </nav>
    </div>

<Outlet />
</>
  );
}

export default Layout;
