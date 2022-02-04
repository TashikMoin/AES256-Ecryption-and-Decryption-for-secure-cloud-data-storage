import React from "react";
import CardStyles from "../../styles/Dashboard/Card.module.css"
import Image from "next/image"
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CancelIcon from '@mui/icons-material/Cancel';
import PublishIcon from '@mui/icons-material/Publish';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    outline: 'none',
    boxShadow: 24,
    p: 4,
  };

const Card = ({filename}) => {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

  return (
    <>
      <div className={CardStyles.card}>
        <div className={CardStyles.content}>
        <Image src="/assets/files.png" height={60} width={60}>
          </Image>
          <label style={{marginLeft: '10px', fontWeight: '100'}}> 
            {filename}
          </label>
        </div>

        
        <Button  
          style={{margin: '15px 0px', backgroundColor: '#606060'}}
          variant="contained" 
          startIcon={<DeleteIcon />}
        > 
          Delete
        </Button>
        

        <Button  
          style={{backgroundColor: '#606060'}}
          variant="contained" 
          startIcon={<FileDownloadIcon />}
          onClick={handleOpen}
        > 
          Download
        </Button>

        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Upload the private key of {filename}
          </Typography>
        <input style={{marginTop: '10px'}} type="file"></input>

        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '15px'}}>
          <Button  
            style={{margin: '15px 5px', backgroundColor: '#606060'}}
            variant="contained" 
            startIcon={<CancelIcon/>}
            onClick={handleClose}
          > 
            Cancel
          </Button>

          <Button  
            style={{margin: '15px 5px', backgroundColor: '#606060'}}
            variant="contained" 
            startIcon={<PublishIcon/>}
          > 
            Submit
          </Button>
        </div>
        </Box>

      </Modal>

      </div>
    </>
  );
};



export default Card;