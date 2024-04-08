import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faKey } from '@fortawesome/free-solid-svg-icons';

function Signup() {
  const [name,setName] = useState('');
  const [username,setUsername] = useState('')
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('')
  const [repeatPassword,setRepeatPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false)
  
  const handleSignup = async (event) => {
    event.preventDefault();

    if (password !== repeatPassword) {
      setPasswordMatchError(true)
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const data = await response.json()
    } catch (error) {
      console.error('error:', error)
    }
  }

  const handleSignin = async () => {
    try {
    const res = await fetch('http://localhost:3000/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      }),
    })
  } catch (err) {
    console.log('Error: ', error)
  }

    const data = await res.json();
  }

  const handleRepeatPasswordChange = (event) => {
    setRepeatPassword(event.target.value);
    setPasswordMatchError(password !== event.target.value);
  };

  return (
    <>
      <section className="vh-100" style={{ backgroundColor: "#eee" }}>
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black" style={{ borderRadius: "25px" }}>
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

                      <form 
                        className="mx-1 mx-md-4"
                        onSubmit={handleSignup}
                        >

                        <div className="d-flex flex-row align-items-center mb-4">
                          <FontAwesomeIcon icon={faUser} className="fa-lg me-3 fa-fw" />
                          <div className="form-outline flex-fill mb-0">
                            <input type="text" id="form3Example1c" className="form-control" onChange={(e) => setName(e.target.value)} />
                            <label className="form-label" htmlFor="form3Example1c">Your Name</label>
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <FontAwesomeIcon icon={faEnvelope} className="fa-lg me-3 fa-fw" />
                          <div className="form-outline flex-fill mb-0">
                            <input type="email" id="form3Example3c" className="form-control" onChange={(e) => setEmail(e.target.value)} />
                            <label className="form-label" htmlFor="form3Example3c">Your Email</label>
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <FontAwesomeIcon icon={faLock} className="fa-lg me-3 fa-fw" />
                          <div className="form-outline flex-fill mb-0">
                            <input type="password" id="form3Example4c" className="form-control" onChange={(e) => setPassword(e.target.value)} />
                            <label className="form-label" htmlFor="form3Example4c">Password</label>
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <FontAwesomeIcon icon={faKey} className="fa-lg me-3 fa-fw" />
                          <div className="form-outline flex-fill mb-0">
                            <input type="password" id="form3Example4cd" className="form-control" onChange={handleRepeatPasswordChange}/>
                            <label className="form-label" htmlFor="form3Example4cd">Repeat your password</label>
                          </div>
                        </div>
                        {passwordMatchError && (
                          <div className="text-danger">Passwords do not match!</div>
                        )}
                        <div className="form-check d-flex justify-content-center mb-5">
                          <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3c" />
                          <label className="form-check-label" htmlFor="form2Example3">
                            I agree all statements in <a href="#!">Terms of service</a>
                          </label>
                        </div>

                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <button  
                            type="submit" 
                            className="btn btn-primary btn-lg"
                            >Register</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
      );
  }


export default Signup;
