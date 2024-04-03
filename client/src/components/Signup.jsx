import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

function Signup() {
  const [firstName,setFirstName] = useState('')
  const [lastName,setLastName] = useState('')
  const [username,setUsername] = useState('')
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('')
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  }

  return (
    <>
      <button className="btn btn-primary">Primary Button</button>
    </>
      );
  }


export default Signup;
