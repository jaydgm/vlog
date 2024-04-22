import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@popperjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faKey } from '@fortawesome/free-solid-svg-icons';
import { getJwt } from "../auth/jwt";
import { useNavigate } from 'react-router';

function Scheduler() {

    const [selectedItem, setSelectedItem] = useState('');

    return (
        <>
            <h1>Choose a household</h1>
            <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"> 
                    {selectedItem ? selectedItem : "Dropdown Link"}
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li><a className="dropdown-item" href="#" onClick={() => setSelectedItem('Action')}>Action</a></li>

                </ul>
            </div>
        </>
    )
}

export default Scheduler;