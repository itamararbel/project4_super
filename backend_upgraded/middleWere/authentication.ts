import { client_error } from './../modal/client_error';
import { Request, Response, NextFunction } from "express";
import jwtHundler from "../util/jwtHundler";
import logger from '../util/errorsLogger';

const authentication = async ( request: Request, response: Response, next:NextFunction)=>{
    console.log (request.headers);
    console.log("here");
    const authorization = request.header("Authorization"); 
    console.log("here-"+authorization)
    console.log(authorization.split(" ")[1])
try{
    const isValid=await jwtHundler.checkToken(authorization.split(" ")[1]);
    console.log("isvalid " + isValid)
    isValid?  next(): next(new client_error(401, "you haven't done nothing in a long time please log again "));
}catch(err){
    logger.error(err.message)
}
}

export { 
    authentication
}