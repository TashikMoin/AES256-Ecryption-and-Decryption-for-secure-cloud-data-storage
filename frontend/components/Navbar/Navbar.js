import React from "react";
import Image from "next/image"
import NavbarStyles from "../../styles/Navbar/Navbar.module.css"
import Axios from "axios";
import { useRouter } from "next/router";

const Navbar = ({user}) => {

    const router = useRouter();

    const logout = async () => {
        await Axios.get("http://localhost:8080/logout")
        .then((response) => {
            router.push("/");
        })
        .catch((error) => {
          console.log(error);
          return;
        });
    }

  return (
    <div className={NavbarStyles.navbar}>
        <div className={NavbarStyles.logo}>
            <h3 style={{marginLeft: '15px'}}> Secure Fileupload</h3>
        </div>

        <div className={NavbarStyles.profile}>

            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', marginRight: '25px'}}>
                <Image src="/assets/user.png" height={40} width={40}></Image>
                <div style={{marginLeft: '10px' , color: '#606060'}}>
                    {user.Username}
                </div>
            </div>


            <div 
            onClick={logout}
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', marginRight: '25px'}}>
                <Image src="/assets/logout.png" height={40} width={40}></Image>
                <div style={{marginLeft: '10px' , color: '#606060'}}>
                    Logout
                </div>
            </div>
        </div>
    </div>
  );
};



export default Navbar;