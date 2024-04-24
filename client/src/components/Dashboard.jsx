
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faKey } from '@fortawesome/free-solid-svg-icons';
import { getJwt } from "../auth/jwt";
import { useNavigate } from 'react-router';

function Dashboard() {

    const navigate = useNavigate()
    const jwt = getJwt();

    const handleScheduler = async () => {
        try {
            const response = await fetch('http://localhost:3000/scheduler', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': jwt,
          },
        })

        const data = await response.json()

        
        if (data.err === "Invalid authorization, no authorization headers" || 
        data.err === "Invalid authorization, invalid authorization scheme") {
            console.log('Error authenticating jwt')
        } else if (data.success) {
            navigate()
        }
        
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {/* hero */}
            <div className="heroContainer d-flex justify-content-center align-items-center">
                <button 
                    className="scheduleBtn rounded-pill" 
                    type="button"
                    onClick={handleScheduler}>
                    Schedule Meeting</button>
            </div>
        </>
    )
}

export default Dashboard;