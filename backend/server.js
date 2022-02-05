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
  var pair = keypair(); 
  var privateKey = pair.private;
  /* using only private part of the pair and generating a public key from it and then 
  storing the public key in the database and sending private to the client */
  var bytePrivateKey = forge.pki.privateKeyFromPem(privateKey); 
  // PEM to Byte format conversion
  var publicKey  = forge.pki.setRsaPublicKey(bytePrivateKey.n, bytePrivateKey.e)
  publicKey = forge.pki.publicKeyToPem(publicKey);
  var cipher = aes256.createCipher(publicKey);
  /* Encrypting data from the generated public key because AES256 is a symmetric key algorithm 
  so using public key for encryption and decryption */
  var encryptedPlainText = cipher.encrypt(data);
  const buffer = new Buffer(data, "base64"); // replace data -> encryptedPlainText
  // console.log(buffer.toString()); for real plaintext
  if (firstChunk && fs.existsSync("./uploads/" + name)) {
    fs.unlinkSync("./uploads/" + name);
  }
  fs.appendFileSync("./uploads/" + name, buffer);
  if (lastChunk) {
    const finalFilename = name;
    fs.renameSync("./uploads/" + name, "./uploads/" + finalFilename);
    if (!name) {
      throw new Error("Please fill the required data and try again.");
    }
    const query = `INSERT INTO secureFileUpload.File (Filename, Publickey, Email) 
  VALUES ('${name}', '${publicKey}', '${Email}' );`;
    try {
      database_connection.query(query, (err, result) => {
        if(result){
          fs.writeFile("tempPrivateKey.pem", privateKey, (err, result) => {
            if(err)
            {
              console.log(err);
            }
          });
        }
        else{
          console.log(err);
        }
      });
    } catch (error) {
      throw new Error(error.message);
    }
    res.status(200).download("./tempPrivateKey.pem");
  } else {
    res.status(200).json("ok");
  }
});

app.listen(8080);
