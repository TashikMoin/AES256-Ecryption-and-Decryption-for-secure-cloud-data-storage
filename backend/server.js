import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import aes256 from "aes256";

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
    res.json({finalFilename});
  } else {
    res.json('ok');
  }
});

app.listen(8080);