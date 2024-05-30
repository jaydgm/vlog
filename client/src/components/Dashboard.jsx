
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faKey } from '@fortawesome/free-solid-svg-icons';
import { getJwt } from "../auth/jwt";
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

function Dashboard() {

    const [visitations, setVisitations] = useState([])

    useEffect(() => {
        getVisitations()
    , []})

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
            navigate('/vlog/new')
        }
        
        } catch (error) {
            console.log(error)
        }
    }

    const getVisitations = async () => {
        try {
            const response = await fetch('http://localhost:3000/show-visitations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': jwt,
          },
        })

        const { success, data } = await response.json()

        if (success) {
            setVisitations(data)
        } else {
            window.alert('error getting visitations')
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
            {/* table for scheduled meetings */}
            <table class="table table-success table-striped">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Member</th>
                    <th scope="col">Attendees</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>

                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td></td>
                    </tr>
                    <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    <td></td>
                    </tr>
                    <tr>
                    <th scope="row">3</th>
                    <td colspan="2">Larry the Bird</td>
                    <td>@twitter</td>
                    <td></td>
                    </tr>                    
                    <tr>
                    <th scope="row">4</th>
                    <td colspan="2">Larry the Bird</td>
                    <td>@twitter</td>
                    <td></td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default Dashboard;