
import {useState, useEffect} from 'react';
import { getJwt } from "../auth/jwt";
import ChangePasswordModal from './ChangePasswordModal';
const jwt = getJwt();


function Profile() {
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        fetchUser()
    }, [])

    const [user, setUser] = useState('')

    const fetchUser = async () => {
        try {
            const response = await fetch(`http://localhost:3000/user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'authorization': jwt,
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.data[0])
                console.log(user.name)
                
            } else {
                console.error("Failed to fetch members");
            }
            
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    const handlePasswordModal = () => {
        setShowPasswordModal(!showPasswordModal);
    };

    const handleLinkClick = (e) => {
        e.preventDefault();
        handlePasswordModal();
    };

    return (
        <div className="profileContainer">
            <div className="card text-center" style={{ maxWidth: "25rem", maxHeight: "25rem"}}>
                <div className="profile-body">
                    <div className="circle">{user && user.name}</div>
                    <h5 className="card-title mt-3"></h5>
                    <p className="profile-text">This is a sample user profile card. You can customize it with user information.</p>
                    <div className="d-flex justify-content-between mt-5" style={{ gap: "10px" }}>
                        <a href="#" className="btn btn-primary">Change Username</a>
                        <a href="#" className="btn btn-primary" onClick={handleLinkClick}>Change Password</a>
                        <ChangePasswordModal 
                            handlePasswordModal={handlePasswordModal} 
                            showPasswordModal={showPasswordModal} 
                        />
                    </div>
                    <a href="#" className="btn btn-danger mt-5">Delete Profile</a>
                </div>
            </div>
        </div>
    );
}

export default Profile;