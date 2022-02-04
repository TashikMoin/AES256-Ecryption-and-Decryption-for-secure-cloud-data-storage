import React, { useState, useEffect } from "react";
import registerStyles from "../../styles/Register/Register.module.css";
import TextField from "@mui/material/TextField";
import Image from "next/image"
import Button from '@mui/material/Button';
import Axios from 'axios'
import { useRouter } from 'next/router'


const Register = (props) =>
{
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [Firstname, setFirstname] = useState('');
    const [Lastname, setLastname] = useState('');
    const router = useRouter()

    Axios.defaults.withCredentials = true;
    useEffect(async () => {
      await Axios.get("http://localhost:8080/login")
        .then((response) => {
          if (response) {
            router.push("/home");
          }
        })
        .catch((error) => {
          console.log(error);
          return;
        });
    }, []);


    const registerUser = async (event) => {
        event.preventDefault();
        if( (Email == '') || (Password == '') || (Firstname == '') || (Lastname == '') ){
            alert(`Please fill all the required fields!`);
        }
        else{      
          const Data = { 
              Email: Email,
              Password: Password,
              Firstname: Firstname,
              Lastname: Lastname
          };
          await Axios.post("http://localhost:8080/register", Data)
          .then((response) => { alert(`User Registered!`); router.push("\\");  } )
          .catch((error) => alert(error));
          // router.push("/");
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
                value={Firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
                label="Firstname"
                fullWidth
                size="small"
              />
            </div>

            <div className={registerStyles.textinput}>
              <TextField
                value={Lastname}
                onChange={(e) => setLastname(e.target.value)}
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
                value={Email}
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

          <div className={registerStyles.formfooter}>
            <div className={registerStyles.formfooterleft}>
            </div>

            <div className={registerStyles.formfooterright}>
            <Button onClick={(e) => registerUser(e)} variant="contained">Register</Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};



export default Register;