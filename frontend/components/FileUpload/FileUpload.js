import React from "react";
import FileUploadStyles from "../../styles/FileUpload/FileUpload.module.css"
import {useState, useEffect} from "react";
import axios from "axios";
import Image from "next/image"

const chunkSize = 300 * 1024;


const FileUpload = () => {
  const [dropzoneActive, setDropzoneActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(null);
  const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setFiles([...files, ...e.dataTransfer.files]);
  }

  const readAndUploadCurrentChunk = () => {
    const reader = new FileReader();
    const file = files[currentFileIndex];
    if (!file) {
      return;
    }
    const from = currentChunkIndex * chunkSize;
    const to = from + chunkSize;
    const blob = file.slice(from, to);
    reader.onload = e => uploadChunk(e);
    reader.readAsDataURL(blob);
  }

  const uploadChunk = (readerEvent) => {
    const file = files[currentFileIndex];
    const data = readerEvent.target.result;
    const params = new URLSearchParams();
    params.set('name', file.name);
    params.set('size', file.size);
    params.set('currentChunkIndex', currentChunkIndex);
    params.set('totalChunks', Math.ceil(file.size / chunkSize));
    const headers = {'Content-Type': 'application/octet-stream'};
    const url = 'http://localhost:8080/upload?'+params.toString();
    axios.post(url, data, {headers})
      .then(response => {
        const file = files[currentFileIndex];
        const filesize = files[currentFileIndex].size;
        const chunks = Math.ceil(filesize / chunkSize) - 1;
        const isLastChunk = currentChunkIndex === chunks;
        if (isLastChunk) {
          file.finalFilename = response.data.finalFilename;
          setLastUploadedFileIndex(currentFileIndex);
          setCurrentChunkIndex(null);
        } else {
          setCurrentChunkIndex(currentChunkIndex + 1);
        }
      });
  }

  useEffect(() => {
    if (lastUploadedFileIndex === null) {
      return;
    }
    const isLastFile = lastUploadedFileIndex === files.length - 1;
    const nextFileIndex = isLastFile ? null : currentFileIndex + 1;
    setCurrentFileIndex(nextFileIndex);
  }, [lastUploadedFileIndex]);

  useEffect(() => {
    if (files.length > 0) {
      if (currentFileIndex === null) {
        setCurrentFileIndex(
          lastUploadedFileIndex === null ? 0 : lastUploadedFileIndex + 1
        );
      }
    }
  }, [files.length]);

  useEffect(() => {
    if (currentFileIndex !== null) {
      setCurrentChunkIndex(0);
    }
  }, [currentFileIndex]);

  useEffect(() => {
    if (currentChunkIndex !== null) {
      readAndUploadCurrentChunk();
    }
  }, [currentChunkIndex]);



  return (
    <div className={FileUploadStyles.container}>
      <div
        onDragOver={e => {setDropzoneActive(true); e.preventDefault();}}
        onDragLeave={e => {setDropzoneActive(false); e.preventDefault();}}
        onDrop={e => handleDrop(e)}
        className={FileUploadStyles.dropzone}>
        <Image src='/assets/drop.png' height={40} width={40}></Image>
        
        <div className={"dropzone" + (dropzoneActive ? " active" : "")}> 
          Drop your files here 
        </div>
      </div>
      <div className={FileUploadStyles.files}>
        {files.map((file,fileIndex) => {
          let progress = 0;
          if (file.finalFilename) {
            progress = 100;
          } else {
            const uploading = fileIndex === currentFileIndex;
            const chunks = Math.ceil(file.size / chunkSize);
            if (uploading) {
              progress = Math.round(currentChunkIndex / chunks * 100);
            } else {
              progress = 0;
            }
          }
          return (
            <div className={FileUploadStyles.progress}>
              {file.name} 
              <div style={{width:progress+'%', display:'flex', justifyContent: 'center', marginTop: '10px', borderRadius: '5%', backgroundColor: '#03b35e'}}>
                {progress}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};



export default FileUpload;