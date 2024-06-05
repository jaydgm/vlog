
import {useState, useEffect} from 'react';
import { getJwt } from "../auth/jwt";
const jwt = getJwt();


function Profile() {

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

    return (
        <div className="profileContainer" >
            <div className="card text-center" style={{ maxWidth: "25rem", maxHeight: "25rem"}}>
                <div className="profile-body">
                    <div className="circle">{user && user.name}</div>
                    <h5 className="card-title mt-3"></h5>
                    <p className="profile-text">This is a sample user profile card. You can customize it with user information.</p>
                    <a href="#" className="btn btn-primary">Delete Profile</a>
                </div>
            </div>
        </div>
    );
}

export default Profile;