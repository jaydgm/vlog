import { useState } from 'react'

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
    </>
      );
  }


export default Signup;
