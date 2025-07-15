import React, { useState } from 'react'
import "./RegistrationPage.css"

function RegistrationPage() {

  const [action, setAction] = useState("Sign Up");
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();


  

  return (
    <div className='container'>
      <div className='header'>
        <div className='text'>{action}</div>
        <div className='underline'></div>
      </div>
      <div className="inputs">
        <div className="input" >
            <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="input">
            <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
      </div>
      <div className='submit-container'>
        <div className={action==="Login"?"submit gray":"submit"} onClick={() =>{setAction("Sign Up")}}>Sign Up</div>
        <div className={action==="Submit"?"submit gray":"submit"} onClick={() =>{setAction("Login")}}>Log In</div>
      </div>
    </div>
  )
}

export default RegistrationPage
