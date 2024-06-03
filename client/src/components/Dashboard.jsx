
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faUser, faEnvelope, faLock, faKey } from '@fortawesome/free-solid-svg-icons';
import { getJwt } from "../auth/jwt";
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

function Dashboard() {

    const [visitations, setVisitations] = useState([])

    useEffect(() => {
        getVisitations()
    }, [visitations])

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

    const handleDelete = async (visitation_id) => {
        try {
            const response = await fetch(`http://localhost:3000/delete-visitation?visitation_id=${visitation_id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'authorization': jwt,
          },
        })

        const { success } = await response.json()

        if (success) {
            console.log('Visitation deleted successfully')
            console.log(visitations)
        } else {
            window.alert('error deleting visitation')
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
            // Filter visitations based on date
            const filteredVisitations = data.filter(visitation => {
                const visitationDate = new Date(visitation.visit_date);
                const currentDate = new Date();
                return visitationDate > currentDate;
            });
            setVisitations(filteredVisitations);
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
                    <th scope='col'></th>

                    </tr>
                </thead>
                <tbody>
                    
                    {visitations.map((visitation, index) => (
                        <tr>
                            <th scope="row">{index+1}</th>
                            <td>{visitation.member}</td>
                            <td>{visitation.attendees}</td>
                            <td>{new Date(visitation.visit_date).toLocaleDateString('en-US')}</td>
                            <td>{visitation.visit_time}</td>
                            <td>
                                <button className="delete-button" onClick={() => handleDelete(visitation.visitation_id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default Dashboard;