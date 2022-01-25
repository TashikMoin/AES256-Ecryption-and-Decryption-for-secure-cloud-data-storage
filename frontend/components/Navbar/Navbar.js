import React from "react";
import Image from "next/image"
import NavbarStyles from "../../styles/Navbar/Navbar.module.css"

const Navbar = () => {

  return (
    <div className={NavbarStyles.navbar}>
        <div className={NavbarStyles.logo}>
            <Image src="/assets/secure.png" height={50} width={50}></Image>
            <h3 style={{marginLeft: '15px'}}> Secure Fileupload</h3>
        </div>

        <div className={NavbarStyles.profile}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', marginRight: '25px'}}>
                <Image src="/assets/logout.png" height={40} width={40}></Image>
                <div style={{marginLeft: '10px'}}>
                    Logout
                </div>
            </div>
        </div>
    </div>
  );
};



export default Navbar;