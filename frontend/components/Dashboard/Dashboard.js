import React, {useState, useEffect} from "react";
import DashboardStyles from "../../styles/Dashboard/Dashboard.module.css"
import Card from "./Card"
import Axios from 'axios'
import { useRouter } from 'next/router'

const Dashboard = ({user}) => {

  const [files, setFiles] = useState([]);
  const router = useRouter();

  useEffect(async () => {
    const params = new URLSearchParams();
    params.set('Email', user.Email);
    await Axios.get("http://localhost:8080/files?"+params.toString())
      .then((response) => {
        if (response) {
          setFiles(response.data.files)
        }
      })
      .catch((error) => {
        console.log(error);
        return;
      });
  }, []);

  return (
    <div className={DashboardStyles.container}>
      { files.map((item, index) => {
        return(
          <Card key={index} Email={user.Email} filename={item.Filename}/>
        )
      })}
    </div>
  );
};



export default Dashboard;