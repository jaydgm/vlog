
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { faUser, faEnvelope, faLock, faKey } from '@fortawesome/free-solid-svg-icons';
import { getJwt } from "../auth/jwt";
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import EditVisitationModal from './EditVisitationModal'

function Dashboard() {

    const [visitations, setVisitations] = useState([])
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedVisitation, setSelectedVisitation] = useState(null)

    useEffect(() => {
        getVisitations()
    }, [])

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
            getVisitations()
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
          });
      
          const { success, data } = await response.json();
      
          if (success) {
            const currentUtcDate = new Date(); // Keep the current time

              // Subtract 7 hours from the current UTC time
              currentUtcDate.setUTCHours(currentUtcDate.getUTCHours() - 7);
              
              const filteredVisitations = data.filter(visitation => {
                  const visitDatePart = visitation.visit_date.split('T')[0];
                  const visitTimePart = visitation.visit_time.split(':');
              
                  // Create a Date object in UTC for visitation
                  const visitationDateTime = new Date(Date.UTC(
                      parseInt(visitDatePart.split('-')[0]), // year
                      parseInt(visitDatePart.split('-')[1]) - 1, // month (0-based index)
                      parseInt(visitDatePart.split('-')[2]), // day
                      parseInt(visitTimePart[0]), // hours
                      parseInt(visitTimePart[1]), // minutes
                      0 // seconds
                  ));
              
                  console.log('Visitation DateTime (UTC):', visitationDateTime.toISOString());
                  console.log('Adjusted Current DateTime (UTC):', currentUtcDate.toISOString());
              
                  return visitationDateTime > currentUtcDate;
            });
            setVisitations(filteredVisitations);
          } else {
            window.alert('error getting visitations');
          }
        } catch (error) {
          console.log(error);
        }
      };
      
    const handleEditModal = (visitation) => {
      setSelectedVisitation(visitation)
      setShowEditModal(true)
    }

    const closeModal = () => {
      setShowEditModal(false)
      setSelectedVisitation(null)
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
            <h2 className="title-header text-center my-4">Scheduled Visitations</h2>
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
                        <tr className='table-row'>
                            <th scope="row">{index+1}</th>
                            <td>{visitation.member}</td>
                            <td>{visitation.attendees}</td>
                            <td>{new Date(visitation.visit_date).toLocaleDateString('en-US')}</td>
                            <td>{convertTo12HourFormat(visitation.visit_time)}</td>
                            <td className="table-actions">
                                <button className="btn btn-danger btn-sm me-2" onClick={() => handleDelete(visitation.visitation_id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                                <button className="btn btn-icon" onClick={() => handleEditModal(visitation)}>
                                    <FontAwesomeIcon icon={faEllipsisV} />
                                </button>
                                {showEditModal && selectedVisitation && (
                                  <EditVisitationModal
                                      show={showEditModal}
                                      handleClose={closeModal}
                                      visitation={selectedVisitation}
                                  />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default Dashboard;