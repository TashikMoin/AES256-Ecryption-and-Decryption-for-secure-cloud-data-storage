import React from "react";
import FileUploadStyles from "../../styles/FileUpload/FileUpload.module.css"
import Button from '@mui/material/Button';
import Image from 'next/image'

const FileUpload = () => {

  return (
    <div className={FileUploadStyles.container}>
      <div className={FileUploadStyles.content}>
        <Image src='/assets/upload.png' height={40} width={40}></Image>
        <input style={{marginLeft: '20px'}} type={'file'}></input>
        <Button variant="contained">Submit</Button>
      </div>
    </div>
  );
};



export default FileUpload;