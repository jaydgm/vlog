
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faKey } from '@fortawesome/free-solid-svg-icons';
import { getJwt } from "../auth/jwt";

function Dashboard() {

    const handleScheduler = async () => {
        const jwt = getJwt();
    }

    return (
        <>
            {/* navbar */}
            <nav className="navbar navbar-light bg-dark d-flex justify-content-center">
                <span className="navbar-brand mb-0 h1 text-light">VLog</span>
            </nav>
            {/* hero */}
            <div className="d-flex justify-content-center">
                <button 
                    type="button" 
                    onClick={handleScheduler}
                    className="btn btn-danger btn-lg">Schedule a meeting
                </button>
            </div>
        </>
    )
}

export default Dashboard;