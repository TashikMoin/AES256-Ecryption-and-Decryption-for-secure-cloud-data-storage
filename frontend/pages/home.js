import React from "react";
import Navbar from "../components/Navbar/Navbar"
import FileUpload from "../components/FileUpload/FileUpload";
import Dashboard from "../components/Dashboard/Dashboard";

const Home = () => {

  return (
    <>
      <Navbar/>
      <FileUpload/>
      <Dashboard/>
    </>
  );
};



export default Home;