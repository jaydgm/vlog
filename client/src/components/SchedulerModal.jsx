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

    const navigate = useNavigate()

    useEffect(() => {
        fetchMembers();
        fetchUsers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await fetch('http://localhost:3000/members', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'authorization': jwt,
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMembers(data.data);
            } else {
                console.error("Failed to fetch members");
            }
            
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/users', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'authorization': jwt,
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data.data);
            } else {
                console.error("Failed to fetch members");
            }
            
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

        // creates a new visitation upon scheduling 
        const scheduleVisitation = async () => {
            try {
                const response = await fetch('http://localhost:3000/schedule-visitation', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'authorization': jwt,
                    },
                    body: JSON.stringify({
                        host_id: selectedMember.member_id,
                        visit_date: selectedDate,
                        visit_time: selectedTime,
                    })
                });
    
                // is response is successful, extract the visitatio_id to use in addAttendees
                if (response.ok) {
                    const { visitation_id } = await response.json();
                    addAttendees(visitation_id)
                    handleModal()
    
                } else {
                    console.error("Failed to create visitation");
                }
                
            } catch (error) {
                console.error("Error fetching members:", error);
            }
        };

        const addAttendees = async (visitation_id) => {
            try {
                for (const attendee of attendees) {
                    const response = await fetch('http://localhost:3000/add-attendees', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            'authorization': jwt,
                        },
                        body: JSON.stringify({
                            visit_id: visitation_id,
                            attendee_id: attendee.user_id,
                        })
                    });
    
                    if (response.ok) {
                        const data = await response.json();
                    } else {
                        console.error("Failed to create visitation");
                    }
                }
            } catch (error) {
                console.error("Error fetching members:", error);
            }
        }

            // keeps users from adding same user more than once
        const handleAddAttendee = (user) => {
            if (!attendees.includes(user)) {
            setAttendees(prevAttendees => [...prevAttendees, user]);
            }
        };

        const handleSchedule = () => {
            const visitationDateTime = new Date(selectedDate + ' ' + selectedTime);
            const currentDateTime = new Date();

            // Checks if at least 1 attendee is added
            if (!attendees || attendees.length === 0) {
                window.alert('Please select attendee(s)');
                return;
            }

            // Checks if member is selected
            if (!selectedMember) {
                window.alert('Please select a member.');
                return;
            }

            // Checks if time is selected
            if (!selectedDate) {
                window.alert('Please select a Date.');
                return;
            }

            // Checks if time is selected
            if (!selectedTime) {
                window.alert('Please select a time.');
                return;
            }
            
            // keeps visitations from being scheduled if its past the current date
            if (visitationDateTime < currentDateTime) {
                window.alert('Please choose another date and time.');
                return;
            }

            scheduleVisitation()
        };

    return (
        <>
            {/* Bootstrap Modal */}
            {showModal && (
        <div className="modal fade show" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Schedule</h5>
                <button type="button" className="btn-close" onClick={handleModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {/* Add your form or content for adding item here */}
                            {/* members dropdown */}
            <Form.Label>Select Member</Form.Label>
            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"> 
                {selectedMember.member ? selectedMember.member : "Choose a member"}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                {members.map(member => (
                    <li key={member.member_id}>
                        <a className="dropdown-item" href="#" onClick={() => setSelectedMember(member)}>{member.member}</a>
                    </li>
                ))}
            </ul>
             {/* date and time picker */}
             <div className="d-flex">
                {/* date */}
                <div className="mr-3">
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Select Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {setSelectedDate(e.target.value)}}
                        />
                    </Form.Group>
                </div>
                {/* time */}
                <div>
                    <Form.Group controlId="exampleForm.ControlInput2">
                        <Form.Label>Select Time</Form.Label>
                        <Form.Control
                            type="time"
                            value={selectedTime}
                            onChange={(e) => {setSelectedTime(e.target.value)}}
                        />
                    </Form.Group>
                </div>
            </div>
            {/* Attendees dropdown */}
            <Form.Label>Select Attendee(s)</Form.Label>
            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                {selectedAttendee ? selectedAttendee : "Choose an attendee"}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                {users.map(user => (
                    <li key={user.user_id}>
                        <a className="dropdown-item" href="#" onClick={() => handleAddAttendee(user)}>{user.name}</a>
                    </li>
                ))}
            </ul>
                <div>
                    <strong>Attendees:</strong>
                    <ul>
                        {attendees.map(attendee => (
                            <li key={attendee.id}>{attendee.name}</li>
                        ))}
                    </ul>
                </div>
                
            {/* schedule button */}
            <button variant="primary" onClick={handleSchedule}>Schedule</button>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleModal}>Close</button>
                {/* Add button to save item here */}
              </div>
            </div>
          </div>
        </div>
      )}
        </>
    )
}

export default SchedulerModal;