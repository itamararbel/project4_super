import mongoose from "mongoose";
import logger from "../util/errorsLogger";


const url = "mongodb+srv://root:yj6BCZtkAlyN6EEY@cluster0.jvnq4xm.mongodb.net/?retryWrites=true&w=majority"
mongoose.set('strictQuery', false)

const connection = (): Promise<any> => {
    mongoose.connect(url);
    const db = mongoose.connection;
    return new Promise<any>((resolve: any, reject: any) => {
      db.on('error', (err) => {
        if (err) {
          logger.error(err)
          reject(err)
          return
        }
        db.once('open', () => {
          console.log("connection started")
        })
        resolve()
      })
    })
  }

  export default connection;