import React, { useState } from "react";
import loginStyles from "../../styles/Login/Login.module.css";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import Image from "next/image"
import Button from '@mui/material/Button';
import { useRouter } from 'next/router'
import Axios from 'axios'


const Login = (props) =>
{
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const router = useRouter();

    Axios.defaults.withCredentials = true;

    const loginUser = (event) => {
        event.preventDefault();
        if( (Email == '') || (Password == '') ){
            alert(`Please fill all the required fields!`);
        }
        else{
            const credentials = { 
                Email: Email,
                Password: Password
            };
            Axios.post("http://localhost:8080/login", credentials)
            .then((response) => router.push("/home"))
            .catch((error) => console.log(error));
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
                value={Email}
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
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                required
                label="Password"
                type="Password"
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
            <Button onClick={(e)=>{loginUser(e)}} variant="contained">Sign in</Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};



export default Login;