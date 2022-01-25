import React, { useState } from "react";
import loginStyles from "../../styles/Login/Login.module.css";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import Image from "next/image"
import Button from '@mui/material/Button';


const Login = (props) =>
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginUser = (event) => {
        event.preventDefault();
        if( (email == '') || (password == '') ){
            alert(`Please fill all the required fields!`);
        }
        else{
            const credentials = { 
                email: email,
                password: password
            };
            props.loginUserAction(credentials);
        }
    };

  return (
    <>

      <div className={loginStyles.container}>
        <form action="/login" method="POST" className={loginStyles.form}>
          <div className={loginStyles.formheader}>
            <h1 className={loginStyles.logo}>Sign in</h1>
            <Image src={'/assets/secure.png'} height={50} width={50}></Image>
          </div>

          <div className={loginStyles.inputs}>
            <div className={loginStyles.textinput}>
              <TextField
                inputProps={{
                  id: "emailInput",
                  autoComplete: "on",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                label="Email"
                fullWidth
                size="small"
              />
            </div>

            <div className={loginStyles.textinput}>
              <TextField
                inputProps={{
                  id: "passwordInput",
                  autoComplete: "off",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                label="Password"
                type="password"
                fullWidth
                size="small"
              />
            </div>

          </div>

          <div className={loginStyles.formfooter}>
            <div className={loginStyles.formfooterleft}>
              <Link href="/register">
                <a className={loginStyles.createaccount}>
                  <Button style={{backgroundColor: '#303030'}} variant="contained">Register</Button>
                </a>
              </Link>
            </div>

            <div className={loginStyles.formfooterright}>
            <Button variant="contained">Sign in</Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};



export default Login;