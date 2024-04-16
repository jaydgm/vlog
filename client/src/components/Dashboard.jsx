
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faKey } from '@fortawesome/free-solid-svg-icons';
import { getJwt } from "../auth/jwt";
import { useNavigate } from 'react-router';

function Dashboard() {

    const navigate = useNavigate()

    return (
        <>
            {/* hero */}
            <div className="heroContainer d-flex justify-content-center align-items-center">
                <button 
                    className="scheduleBtn rounded-pill" 
                    type="button"
                    onClick={() => navigate('/vlog/schedule-meeting')}>
                    Schedule Meeting</button>
            </div>
        </>
    )
}

export default Dashboard;