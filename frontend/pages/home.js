import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar"
import FileUpload from "../components/FileUpload/FileUpload";
import Dashboard from "../components/Dashboard/Dashboard";
import Axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";


const Home = () => {

  const [user, setUser] = useState(null);
  const router = useRouter();

  Axios.defaults.withCredentials = true;
  useEffect(async () => {
    await Axios.get("http://localhost:8080/login")
      .then((response) => {
        if (response.data.user) {
          setUser({Username: response.data.user.Username, Email: response.data.user.Email})
        }
        else{
          router.push("/");
        }
      })
      .catch((error) => {
        setTimeout(()=> router.push("/"), 2000)
        return;
      });
  }, []);

  if(user == null){
    return (
      <div style={{ display: 'flex', justifyContent:'center', alignItems: 'center', flexDirection: 'column', width: '100%', height: '100vh'}}>
        <Image src="/assets/unauthorized.png" height={100} width={100}></Image>
        Unauthorized Access
      </div>
    )
  }
  else{
    return (
      <div style={{overflow: 'hidden'}}>
        <Navbar user={user}/>
        <FileUpload user={user}/>
        <Dashboard user={user}/>
      </div>
    );
  }



};



export default Home;