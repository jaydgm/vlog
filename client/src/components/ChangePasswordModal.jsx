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
    const jwt = getJwt();
    const navigate = useNavigate()

    const handleChangePassword = async () => {
        if (newPassword === confirmNewPassword) {
            try {
                const response = await fetch('http://localhost:3000/change-password', {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        'authorization': jwt,
                    },
                    body: JSON.stringify({
                        newPassword
                    })
                });
    
                if (response.ok) {
                    const data = await response.json();
                    console.log('hello')
                    handlePasswordModal()
                    resetForm()
                    navigate('/login')

                } else {
                    console.error("Failed to change password");
                }
                
            } catch (error) {
                console.error("Error changing password:", error);
            }
        } else {
            alert("New passwords do not match");
        }
    };

    const resetForm = () => {
        setOldPassword('')
        setNewPassword('')
        setConfirmNewPassword('')
    };

    return (
        <>
            <Modal show={showPasswordModal} onHide={handlePasswordModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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

                    <Button 
                        variant="primary" 
                        type="submit"
                        onClick={handleChangePassword}>
                        Change Password
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ChangePasswordModal;
