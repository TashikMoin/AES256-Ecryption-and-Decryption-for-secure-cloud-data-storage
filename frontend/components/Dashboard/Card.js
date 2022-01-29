import React from "react";
import CardStyles from "../../styles/Dashboard/Card.module.css"
import Image from "next/image"
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

const Card = ({filename}) => {

  return (
    <>
      <div className={CardStyles.card}>
        <div className={CardStyles.content}>
          <Image src="/assets/files.png" height={60} width={50}>
          </Image>
          <label style={{marginLeft: '10px', fontWeight: '100'}}> 
            {filename}
          </label>
        </div>

        
        <Button  
          style={{margin: '15px 0px', backgroundColor: '#000000'}}
          variant="contained" 
          startIcon={<DeleteIcon />}
        > 
          Delete
        </Button>
        

        <Button  
          style={{backgroundColor: '#000000'}}
          variant="contained" 
          startIcon={<DeleteIcon />}
        > 
          Download
        </Button>

      </div>
    </>
  );
};



export default Card;