import cors from "cors";
import expressRateLimit from "express-rate-limit";
import express from "express";
import config from "./config";
import pageNotFound from "./middleWere/pageNotFound";
import { catchAll } from './middleWere/catchAll';
import fileUpload from "express-fileupload";
import authController from "./controllers/authController";
import sanitize from "./middleWere/sanitize";
import mongoose from "mongoose";
import cartsController from "./controllers/cartsController";
import productController from "./controllers/productController";
import { resolve } from "path";
import logger from "./util/errorsLogger";


const server = express();

const url = "mongodb+srv://root:yj6BCZtkAlyN6EEY@cluster0.jvnq4xm.mongodb.net/?retryWrites=true&w=majority"
mongoose.set('strictQuery', false)

// const execute = (sql:string ): Promise<any> =>{
//   return new Promise<any>((resolve, reject) => {
//        connection.query(sql, (err, result) =>{
//           if (err){
//               appendFileSync("errorsLog.txt", err.message,"utf-8");   
//               reject(err);
//               return 
//           }
//           resolve(result)
//        })
//   })
// }
const connection = ():Promise<any>=>{
  mongoose.connect(url);
  const db = mongoose.connection;
  return new Promise<any>((resolve:any,reject:any)=>{
    db.on('error', (err) => {
      if(err){
        logger.error(err)
        reject(err)
        return }   
        db.once('open', () => {
        console.log("connection started")})
        resolve()
    })})
  
 
// try {
 
// } catch (err) {
//   console.log("this is where i stack" + err)
  // next(err)
}
// server.use(fileUpload({
//   createParentPath: true
// }));
connection()

var corsOptions = {
  "origin": "*", //expose to all server around the world
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE", //expose which methods are allowed
  "preflightContinue": false,
  "optionsSuccessStatus": 204,
  "exposedHeaders": "Authorization" //expose the Authorization header
}
server.use(cors(corsOptions));
// server.use(express.static('./src/assets/'))
server.use(expressRateLimit({ windowMs: 1000, max: 5, message: "plz wait a while..." }))
server.use(sanitize);
server.use(express.json());
server.use("/api/auth", authController)
server.use("/api/carts", cartsController)
// server.use("/api/users", userController);
server.use("/api/products", productController);
server.use("*", pageNotFound);
server.use(catchAll)
server.listen(config.port, () => { console.log("listening on port" + config.port) })
console.log("this is where i stack");

