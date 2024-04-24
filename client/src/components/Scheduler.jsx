import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@popperjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faKey } from '@fortawesome/free-solid-svg-icons';
import { getJwt } from "../auth/jwt";
import { Form } from 'react-bootstrap';

function Scheduler() {
    const [selectedItem, setSelectedItem] = useState('');
    const [members, setMembers] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const jwt = getJwt();


    useEffect(() => {
        fetchMembers();
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

    const handleSchedule = () => {
        // Implement your schedule logic here
        console.log(selectedItem);
        console.log(selectedDate)
        console.log(selectedTime)
    };

    return (
        <>
        <div className="container d-flex flex-column justify-content-center align-items-center">
            {/* members dropdown */}
            <Form.Label>Select Member</Form.Label>
            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"> 
                {selectedItem ? selectedItem : "Choose a member"}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                {members.map(member => (
                    <li key={member.member_id}>
                        <a className="dropdown-item" href="#" onClick={() => setSelectedItem(member.member)}>{member.member}</a>
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
            {/* schedule button */}
            <button variant="primary" onClick={handleSchedule}>Schedule</button>
    </div>

        </>
    )
}

export default Scheduler;
