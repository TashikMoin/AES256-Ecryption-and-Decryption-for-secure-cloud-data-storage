import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar"
import FileUpload from "../components/FileUpload/FileUpload";
import Dashboard from "../components/Dashboard/Dashboard";
import Axios from "axios";
import { useRouter } from 'next/router'

const Home = () => {

  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter()

  useEffect( () => {
    Axios.get("http://localhost:8080/login")
    .then((response) => {
      if(response.data.loggedIn == true)
      {
        setCurrentUser(response.data.user);
      }
    });

    if(currentUser == null){
      router.push("/login");
    }
  }, [])

  return (
    <>
    { currentUser != null && (
      <>
        <Navbar/>
        <FileUpload/>
        <Dashboard/>
      </>
    )}
    </>
  );
};



export default Home;