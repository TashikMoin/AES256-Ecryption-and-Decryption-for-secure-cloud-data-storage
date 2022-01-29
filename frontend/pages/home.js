import React from "react";
import Navbar from "../components/Navbar/Navbar"
import FileUpload from "../components/FileUpload/FileUpload";
import Dashboard from "../components/Dashboard/Dashboard";

const Home = () => {


  return (
    <div style={{overflow: 'hidden'}}>
      <Navbar/>
      <FileUpload/>
      <Dashboard/>
    </div>
  );
};



export default Home;