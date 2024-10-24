import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { setJwt } from "../auth/jwt";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faKey } from '@fortawesome/free-solid-svg-icons';

function Login() {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('')

    const navigate = useNavigate();


    const handleSignin = async () => {

      if (!email) {
        window.alert('missing email')
        return
      } else if (!password) {
        window.alert('missing password')
        return
      }

      try {
        const response = await fetch('http://localhost:3000/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          }),
        })

        const data = await response.json()
        
        // if successful and a jwt token are true
        // save token & navigate to dashboard
        if (data.success && data.jwt) {
          setJwt(data.jwt)
          navigate("/vlog")
        } else {
          window.alert('error signing in')
        }

      } catch (err) {
        console.log('Error: ', err)
      }
  
    }

    return (
        <>
        <section className="login-container vh-100">
            <div className="container h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-lg-12 col-xl-11">
                <div className="card text-black" style={{ borderRadius: "25px" }}>
                    <div className="card-body p-md-5">
                    <div className="row justify-content-center">
                        <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Log in</p>

                        <form 
                            className="mx-1 mx-md-4"
                            >
                            <div className="d-flex flex-row align-items-center mb-4">
                            <FontAwesomeIcon icon={faEnvelope} className="fa-lg me-3 fa-fw" />
                            <div className="form-outline flex-fill mb-0">
                                <input type="email" id="form3Example3c" className="form-control" onChange={(e) => setEmail(e.target.value)} />
                                <label className="form-label" htmlFor="form3Example3c">Email</label>
                            </div>
                            </div>

                            <div className="d-flex flex-row align-items-center mb-4">
                            <FontAwesomeIcon icon={faLock} className="fa-lg me-3 fa-fw" />
                            <div className="form-outline flex-fill mb-0">
                                <input type="password" id="form3Example4c" className="form-control" onChange={(e) => setPassword(e.target.value)} />
                                <label className="form-label" htmlFor="form3Example4c">Password</label>
                            </div>
                            </div>

                            <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                            <button  
                                type="button" 
                                className="btn btn-primary btn-lg"
                                onClick={handleSignin}
                                >Sign In</button>
                            </div>
                            <div className="d-flex justify-content-center mb-5">
                                <label className="form-check-label" htmlFor="form2Example3">
                                Don't have an account? <Link to="/signup">Sign up</Link>
                          </label>
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
    )
}

export default Login;