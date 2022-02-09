import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import aes256 from "aes256";
import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import keypair from "keypair";
import forge from "node-forge";
import fileUpload from "express-fileupload";
import arrayBufferToString from "arraybuffer-to-string";


const database_connection = mysql.createPool({
  host: "172.17.0.1", // always use this ip for host DO NOT USE LOCALHOST or mysql as host
  user: `${process.env.USER}`,
  password: `${process.env.PASSWORD}`,
  database: `${process.env.DATABASE}`,
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
  port: 3306,
  connectTimeout: 20000,
  acquireTimeout: 20000,
});

const app = express();
app.use(fileUpload());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.raw({ type: "application/octet-stream", limit: "100mb" }));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.post("/register", (req, res) => {
  const Email = req.body.Email;
  const Password = req.body.Password;
  const Firstname = req.body.Firstname;
  const Lastname = req.body.Lastname;
  // 10 salt rounds
  bcrypt.hash(Password, 10, (error, hashedPassword) => {
    if (error) {
      res.send({ error: error });
      return;
    }

    const query = `INSERT INTO secureFileUpload.User (Firstname, Lastname, Email, Password) 
    VALUES ('${Firstname}', '${Lastname}', '${Email}', '${hashedPassword}');`;

    database_connection.query(query, (error, result) => {
      if (error) {
        res.status(200).send({ error: error });
      } else {
        res.status(200).send("User Registered!");
      }
    });
  });
});




app.get("/login", (req, res) => {
  if (req.cookies.token) {
    const decoded = jwt.verify(req.cookies.token, `${process.env.secret}`);
    res
      .status(200)
      .send({ message: "User is authorized!", user: decoded });
  } else {
    res.status(401).send({ message: "User is unauthorized!" });
  }
});


app.get("/logout", (req, res) => {
  res.status(202).clearCookie('token').send('cookie cleared');
});

app.post("/login", (req, res) => {
  const Email = req.body.Email;
  const Password = req.body.Password;

  database_connection.query(
    `SELECT * FROM User WHERE Email = ?;`,
    Email,
    (error, result) => {
      if (error) {
        res.send({ error: error });
        return;
      }
      if (result.length > 0) {
        bcrypt.compare(
          Password,
          result[0].Password,
          (error, password_result) => {
            if (password_result) {
              let token = jwt.sign({ Username: result[0].Firstname+ ' ' + result[0].Lastname,  Email: result[0].Email }, `${process.env.secret}`);
              res.cookie("token", token);
              res.send(result);
            } else {
              res.status(404).send(`Wrong Email or Password!\n ${error}`);
            }
          }
        );
      } else {
        res.status(404).send({ Message: `User Does Not Exists!` });
      }
    }
  );
});

app.post("/upload", (req, res) => {
  const { name, currentChunkIndex, totalChunks, Email } = req.query;
  const firstChunk = parseInt(currentChunkIndex) === 0;
  const lastChunk = parseInt(currentChunkIndex) === parseInt(totalChunks) - 1;
  const data = req.body.toString().split(",")[1];
  console.log("Hereeeeeee");
  const buffer = new Buffer(data, "base64"); 
  console.log(buffer);
  // console.log(buffer.toString()); for real plaintext

  if (firstChunk && fs.existsSync("./uploads/" + name)) {
    fs.unlinkSync("./uploads/" + name);
  }
  fs.appendFileSync("./uploads/" + name, buffer);

  if (lastChunk) {
    const finalFilename = name;
    fs.renameSync("./uploads/" + name, "./uploads/" + finalFilename);
      var pair = keypair(); 
    var privateKey = pair.private;
    /* using only private part of the pair and generating a public key from it and then 
    storing the public key in the database and sending private to the client */
    var bytePrivateKey = forge.pki.privateKeyFromPem(privateKey); 
    // PEM to Byte format conversion
    var publicKey  = forge.pki.setRsaPublicKey(bytePrivateKey.n, bytePrivateKey.e)
    publicKey = forge.pki.publicKeyToPem(publicKey);

    fs.readFile("./uploads/" + name, function(err,file_data){
      if (!err) {
          var cipher = aes256.createCipher(publicKey);
          console.log(file_data);
          var data = file_data.toString();
          console.log(data);
          var encryptedPlainText = cipher.encrypt(data); //
          console.log(encryptedPlainText);
          fs.unlinkSync("./uploads/" + name);
          const buffer = new Buffer(encryptedPlainText, "base64");
          console.log(buffer);
          fs.appendFileSync("./uploads/" + name, buffer);
          // var stream = fs.createWriteStream("./uploads/" + name);
          // stream.once('open', function(fd) {
          //   const buffer = new Buffer(encryptedPlainText, "base64");
          //   stream.write(buffer); // or encryptedPlainText.toString()
          //   stream.end();
          // });
          /* Encrypting data from the generated public key because AES256 is a symmetric key algorithm 
          so using public key for encryption and decryption */
      } else {
          console.log(err);
      }
    });
  if (!name) {
    throw new Error("Please fill the required data and try again.");
  }
  const query = `INSERT INTO secureFileUpload.File (Filename, Publickey, Email) 
  VALUES ('${name}', '${publicKey}', '${Email}' );`;
  try {
    database_connection.query(query, (err, result) => {
      if(result){
        fs.writeFile('./tempPrivateKey.pem', privateKey, { "flag": 'w+' }, err => {
          res.status(200).download("./tempPrivateKey.pem");
        });
      }
      else{
        console.log(err);
      }
    });
  } catch (error) {
    throw new Error(error.message);
  }
  } else {
    res.status(200).json("ok");
  }
});



app.get("/files", (req, res) => {

  const { Email } = req.query;

  database_connection.query(
    `SELECT Filename FROM File WHERE Email = ?;`,
    Email, (err, result) => {
      if(result){
        res.status(200).send({ files: result });
      }
      else if(err) {
        res.status(401).send({ message: "Files not found!" });
      }
    });
  
});

app.delete("/files", (req, res) => {

  const { Email, Filename } = req.query;
  fs.unlink("./uploads/"+Filename, (err, result) => {
    if(!err){
      database_connection.query(
        `DELETE FROM File WHERE Email = ? AND Filename = ?;`,
        [Email, Filename], (err, result) => {
          if(result){
            console.log(result);
            res.status(200).send({ message: 'File Deleted!' });
          }
          else if(err) {
            console.log(err);
            res.status(401).send({ message: `${err}` });
          }
        });
    }
    else{
      res.status(401).send({ message: "Error occured while deleting the file!" });
    }
  })
  
});



app.post("/verifykey", (req, res) => {
  const { Email, Filename } = req.query;
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  const Key = req.files.File.data.toString();
  database_connection.query(
    `SELECT Publickey FROM File WHERE Email = ? AND Filename = ?;`,
    [Email, Filename], (err, result) => {
      if(!err){ 
        var bytePrivateKey = forge.pki.privateKeyFromPem(Key); 
        // PEM to Byte format conversion
        var publicKey  = forge.pki.setRsaPublicKey(bytePrivateKey.n, bytePrivateKey.e)
        publicKey = forge.pki.publicKeyToPem(publicKey);
        // result[0].Publickey ---> public key from database
        // publicKey ---> newly calculated public key from given private key
        if( result[0].Publickey == publicKey ) {
          var cipher = aes256.createCipher(publicKey);
          fs.readFile("./uploads/" + Filename, (err, result) => {
            console.log("-----------------------------");
            console.log(result);
            console.log(result.toString("base64"));
            var plaintext = cipher.decrypt(result.toString("base64"));    
            console.log("here-");
            console.log(plaintext);
            const buffer = new Buffer(plaintext, "base64");
            fs.writeFile("./Temp." + Filename.split('.').pop(), plaintext, { "flag": 'w+' }, (err) => {
              res.status(200).download("./Temp." + Filename.split('.').pop());
            });
          });
        } 
      }
      else {
        res.status(401).send({ message: "Files not found!" });
      }
    });
});




app.listen(8080);




