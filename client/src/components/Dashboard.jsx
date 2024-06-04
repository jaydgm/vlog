
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
    
    // Function to convert time from 24-hour format to 12-hour format
    const convertTo12HourFormat = (timeString) => {
        const [hour, minute] = timeString.split(':');
        const suffix = hour >= 12 ? 'PM' : 'AM';
        const adjustedHour = hour % 12 || 12;
        return `${adjustedHour}:${minute} ${suffix}`;
    };

    return (
        <>
            {/* table for scheduled meetings */}
            <table className="table table-success table-striped">
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
                            <td>{convertTo12HourFormat(visitation.visit_time)}</td>
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