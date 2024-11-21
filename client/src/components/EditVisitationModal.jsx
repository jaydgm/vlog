import React, { useState } from 'react';
import { Form, Badge, InputGroup, Modal, Button } from 'react-bootstrap';

const EditVisitationModal = ({ show, handleClose, visitation, users }) => {
  
  // split attendees by comma
  const [attendees, setAttendees] = useState(visitation.attendees ? visitation.attendees.split(',') : []);
  const [officers, setOfficers] = useState(users ? users.split(",") : []);
  const [visitDate, setVisitDate] = useState(new Date(visitation.visit_date).toISOString().slice(0, 10));
  const [visitTime, setVisitTime] = useState(visitation.visit_time);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/users')
    } catch (error) {
      console.log("failed to fetch users: ", error);
    }
  }
  const updateVisitation = async () => {
    try {
      const response = await fetch('http://localhost:3000/update-visitation', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'authorization': jwt,
        },
        body: JSON.stringify({
            visitation_id: visitation.visitation_id,
            visit_date: visitDate,
            visit_time: visitTime,
        })
      });
      const { success, data } = await response.json()

      if (success) {
          console.log('Visitation updated successfully')
          console.log(data)
      } else {
          window.alert('error updating visitation')
      }

    } catch (error) {
      console.log("failed to update visitation: ", error);
    }
  }


  const handleAddAttendee = () => {
    if (search && !attendees.includes(search)) {
      setAttendees([...attendees, search])
    }

    setSearch("");
  }

  // when removing attendee, call this function and filter out
  // attendees that are removed 
  const handleRemoveAttendee = (removedName) => {
    setAttendees(attendees.filter(attendee => attendee !== removedName));
  }

  const test = () => {
    console.log(visitDate)
    console.log(visitTime)
  }


  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Visitation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Your form or content for editing the visitation */}
        <form>
          <div className="mb-3">
            <Form.Label>Attendees</Form.Label>
            <InputGroup className="mb-2">
              <Form.Control
                type="text"
                placeholder="Add attendee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="outline-secondary" onClick={handleAddAttendee}>
                Add
              </Button>
            </InputGroup>

            {/* map over attendees and display them as badges */}
            <div>
              {attendees.map((name, index) => (
                <Badge
                  key={index}
                  pill
                  bg="primary"
                  className="me-2"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRemoveAttendee(name)}
                >
                  {name} ✕
                </Badge>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="visit_date" className="form-label">Date</label>
            <input 
              type="date" 
              className="form-control" 
              id="visit_date" 
              defaultValue={new Date(visitation.visit_date).toISOString().slice(0, 10)} 
              onChange={(e) => setVisitDate(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="visit_time" className="form-label">Time</label>
            <input 
              type="time" 
              className="form-control" 
              id="visit_time" 
              defaultValue={visitation.visit_time} 
              onChange={(e) => {setVisitTime(e.target.value)}}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary"
          onClick={test()}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditVisitationModal;
