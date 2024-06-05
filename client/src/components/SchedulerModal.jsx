import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@popperjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faKey } from '@fortawesome/free-solid-svg-icons';
import { getJwt } from "../auth/jwt";
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router';

const SchedulerModal=({ handleModal, showModal }) => {
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedAttendee, setSelectedAttendee] = useState('');
    const [attendees, setAttendees] = useState([])
    const jwt = getJwt();

    return (
        <>
            {/* Bootstrap Modal */}
            {showModal && (
        <div className="modal fade show" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Add Itemssss</h5>
                <button type="button" className="btn-close" onClick={handleModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {/* Add your form or content for adding item here */}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleModal}>Close</button>
                {/* Add button to save item here */}
                <SchedulerModal handleModale={handleModal}/>
              </div>
            </div>
          </div>
        </div>
      )}
        </>
    )
}

export default SchedulerModal;