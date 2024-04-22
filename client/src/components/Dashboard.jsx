
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faKey } from '@fortawesome/free-solid-svg-icons';
import { getJwt } from "../auth/jwt";
import { useNavigate } from 'react-router';

function Dashboard() {

    const navigate = useNavigate()

    const handleScheduler = async () => {
        try {
            const response = await fetch('http://localhost:3000/scheduler', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${getJwt}`
          },
        })

        const data = await response.json()

        if (data.success && data.jwt) {
            navigate('/vlog/new')
        } else{
            console.log('Error authenticating jwt')
        }
        
        } catch (error) {

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