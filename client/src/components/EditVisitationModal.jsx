import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const EditVisitationModal = ({ show, handleClose, visitation }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Visitation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Your form or content for editing the visitation */}
        <form>
          <div className="mb-3">
            <label htmlFor="member" className="form-label">Member</label>
            <input type="text" className="form-control" id="member" defaultValue={visitation.member} />
          </div>
          <div className="mb-3">
            <label htmlFor="attendees" className="form-label">Attendees</label>
            <input type="text" className="form-control" id="attendees" defaultValue={visitation.attendees} />
          </div>
          <div className="mb-3">
            <label htmlFor="visit_date" className="form-label">Date</label>
            <input type="date" className="form-control" id="visit_date" defaultValue={new Date(visitation.visit_date).toISOString().substr(0, 10)} />
          </div>
          <div className="mb-3">
            <label htmlFor="visit_time" className="form-label">Time</label>
            <input type="time" className="form-control" id="visit_time" defaultValue={visitation.visit_time} />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary">
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditVisitationModal;
