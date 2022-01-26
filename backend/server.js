import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import aes256 from "aes256";
import dotenv from 'dotenv'
dotenv.config()
import mysql from 'mysql2' ;


const database_connection = mysql.createPool( 
    {
        host: '172.17.0.1', // always use this ip for host DO NOT USE LOCALHOST or mysql as host
        user: `${process.env.USER}`,
        password: `${process.env.PASSWORD}`,
        database: `${process.env.DATABASE}`,
        multipleStatements: true,
        waitForConnections: true,
        connectionLimit: 100,
        queueLimit: 0,
        port:'3306',
        connectTimeout: 20000,
        acquireTimeout: 20000
    }
);




var key = '89876f213a8f69e4cb7fca1b0ac21142fda7dde45f35de3d47129657';



const app = express();
app.use(bodyParser.raw({type:'application/octet-stream', limit:'100mb'}));
app.use(cors({
  origin: 'http://localhost:3000',
}));


app.use('/uploads', express.static('uploads'));


app.post('/upload', (req, res) => {
  const {name,currentChunkIndex,totalChunks} = req.query;
  const firstChunk = parseInt(currentChunkIndex) === 0;
  const lastChunk = parseInt(currentChunkIndex) === parseInt(totalChunks) -1;
  const data = req.body.toString().split(',')[1];
  var cipher = aes256.createCipher(key);
  var encryptedPlainText = cipher.encrypt(data);
  // console.log(data); 
  // data is not actual plaintext, data ---> bytes, encryption bytes will be done
  // console.log(encryptedPlainText);
  var decryptedPlainText = cipher.decrypt(encryptedPlainText);
  // console.log(decryptedPlainText);
  const buffer = new Buffer(decryptedPlainText, 'base64');
  if (firstChunk && fs.existsSync('./uploads/'+name)) {
    fs.unlinkSync('./uploads/'+name);
  }
  fs.appendFileSync('./uploads/'+name, buffer);
  if (lastChunk) {
    const finalFilename = name;
    fs.renameSync('./uploads/'+name, './uploads/'+finalFilename);
    if (!name) {
      throw new Error('Please fill the required data and try again.');
    }
  const query = `INSERT INTO secureFileUpload.File (Filename, Publickey, Email) 
  VALUES ('${name}', '${key}', 'tashikmoinsheikh@gmail.com');`;
  try {
    database_connection.query(query, (err, result) => {
        console.log(err);
    });
  } 
  catch (error) {
      throw new Error(error.message);
  }
  res.json({finalFilename});
  } else {
    res.json('ok');
  }
});

app.listen(8080);