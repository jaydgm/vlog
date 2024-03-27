import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [firstName,setFirstName] = useState('')
  const [lastName,setLastName] = useState('')
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
        }),
      })

      const data = await response.json()
      console.log(data)

      // clear input fields after submission
      setFirstName('')
      setLastName('')
    } catch (error) {
      console.error('error adding user:', error)
    }
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

export default App
