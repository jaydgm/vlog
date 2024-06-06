import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@popperjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faKey } from '@fortawesome/free-solid-svg-icons';
import { getJwt } from "../auth/jwt";
import { Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router';

const ChangePasswordModal = ({ handlePasswordModal, showPasswordModal}) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add logic to handle password change
        if (newPassword === confirmNewPassword) {
            console.log("Old Password:", oldPassword);
            console.log("New Password:", newPassword);
            // Call your password change API here
            handlePasswordModal(); // Close modal after successful password change
        } else {
            alert("New passwords do not match");
        }
    };

    return (
        <>
              <Modal show={showPasswordModal} onHide={handlePasswordModal}>
            <Modal.Header closeButton>
                <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formOldPassword">
                        <Form.Label>Old Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter old password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formNewPassword">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formConfirmNewPassword">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Change Password
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
        </>
    );
}

export default ChangePasswordModal;
