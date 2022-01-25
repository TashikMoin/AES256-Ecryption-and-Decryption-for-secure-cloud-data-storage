import React, { useState } from "react";
import registerStyles from "../../styles/Register/Register.module.css";
import TextField from "@mui/material/TextField";
import Image from "next/image"
import Button from '@mui/material/Button';


const Register = (props) =>
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

      <div className={registerStyles.container}>
        <form action="/Register" method="POST" className={registerStyles.form}>
          <div className={registerStyles.formheader}>
            <h1 className={registerStyles.register}>Register</h1>
            <Image src={'/assets/secure.png'} height={50} width={50}></Image>
          </div>

          <div className={registerStyles.inputs}>

            <div className={registerStyles.textinput}>
              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                label="Firstname"
                fullWidth
                size="small"
              />
            </div>

            <div className={registerStyles.textinput}>
              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                label="Lastname"
                fullWidth
                size="small"
              />
            </div>

            <div className={registerStyles.textinput}>
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

            <div className={registerStyles.textinput}>
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

          <div className={registerStyles.formfooter}>
            <div className={registerStyles.formfooterleft}>
            </div>

            <div className={registerStyles.formfooterright}>
            <Button variant="contained">Register</Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};



export default Register;