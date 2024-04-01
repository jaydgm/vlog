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
    <div className="App">
      <h1>Add User</h1>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </label>
        <label>
          Last Name:
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </label>
        <button type="submit">Add User</button>
      </form>
    </div>
  )
}

export default Signup;
