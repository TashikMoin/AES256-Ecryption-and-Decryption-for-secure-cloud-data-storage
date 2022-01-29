import React from "react";
import DashboardStyles from "../../styles/Dashboard/Dashboard.module.css"
import Card from "./Card"

const Dashboard = () => {

  return (
    <div className={DashboardStyles.container}>
      <Card filename="abcd.txt"/>
    </div>
  );
};



export default Dashboard;