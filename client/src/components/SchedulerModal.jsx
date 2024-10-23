import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@popperjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faKey } from '@fortawesome/free-solid-svg-icons';
import { getJwt } from "../auth/jwt";
import { Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router';

const SchedulerModal = ({ handleModal, showModal }) => {
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedAttendee, setSelectedAttendee] = useState('');
    const [attendees, setAttendees] = useState([]);
    const jwt = getJwt();

    const navigate = useNavigate();

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

            // is response is successful, extract the visitation_id to use in addAttendees
            if (response.ok) {
                const { visitation_id } = await response.json();
                await addAttendees(visitation_id);
                resetForm();
                handleModal();
            } else {
                console.error("Failed to create visitation");
            }
            
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    const addArchive = async () => {
        try {
            const response = await fetch('http://localhost:3000/archive', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'authorization': jwt,
                },
                body: JSON.stringify({
                    visitation_id: visitation_id,
                    host_id: selectedMember.member_id,
                    visit_date: selectedDate,
                    visit_time: selectedTime,
                })
            });
            if (response.ok) {
                console.log("Archive added successfully");
            }

        } catch (error) {
            console.log("Error adding to archive", error);
        }
    }

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
                    console.log(attendees)
                } else {
                    console.error("Failed to add attendee");
                }
            }
        } catch (error) {
            console.error("Error adding attendees:", error);
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
        console.log(visitationDateTime)
        console.log(currentDateTime)

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

        scheduleVisitation();
        addArchive();
    };

    const resetForm = () => {
        setSelectedMember('');
        setSelectedDate('');
        setSelectedTime('');
        setSelectedAttendee('');
        setAttendees([]);
    };

    return (
        <>
           <Modal show={showModal} onHide={handleModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Schedule a Visitation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Members dropdown */}
                <Form.Group controlId="formMember">
                    <Form.Label>Select a member:</Form.Label>
                    <div className="dropdown">
                        <Button variant="secondary" className="dropdown-toggle w-100" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            {selectedMember.member ? selectedMember.member : "Choose a member"}
                        </Button>
                        <ul className="dropdown-menu w-100" aria-labelledby="dropdownMenuButton1">
                            {members.map(member => (
                                <li key={member.member_id}>
                                    <a className="dropdown-item" href="#" onClick={() => setSelectedMember(member)}>{member.member}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Form.Group>

                {/* Date and Time Picker */}
                <Form.Group controlId="formDateTime" className="my-3">
                    <Form.Label>Select Date and Time: </Form.Label>
                    <div className="d-flex justify-content-between">
                        <Form.Control
                            type="date"
                            className="me-2"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        <Form.Control
                            type="time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                        />
                    </div>
                </Form.Group>

                {/* Attendees dropdown */}
                <Form.Group controlId="formAttendees">
                    <Form.Label>Select Attendee(s):</Form.Label>
                    <div className="dropdown">
                        <Button variant="secondary" className="dropdown-toggle w-100" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                            {selectedAttendee ? selectedAttendee : "Choose an attendee"}
                        </Button>
                        <ul className="dropdown-menu w-100" aria-labelledby="dropdownMenuButton2">
                            {users.map(user => (
                                <li key={user.user_id}>
                                    <a className="dropdown-item" href="#" onClick={() => handleAddAttendee(user)}>{user.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Form.Group>

                <div className="mt-3">
                    <strong>Attendees:</strong>
                    <ul className="list-group">
                        {attendees.map(attendee => (
                            <li key={attendee.user_id} className="list-group-item list-group-item-action">{attendee.name}</li>
                        ))}
                    </ul>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSchedule}>Schedule</Button>
                <Button variant="secondary" onClick={() => { handleModal(); resetForm(); }}>Close</Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}

export default SchedulerModal;
