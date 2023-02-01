import { Response } from "express";

const catchAll = (err: any, response: Response)=>{
    console.log("are u here?"+err.massage)
    const statusCode = err? err.status : 500; 
    response.status(statusCode).send(err.massage);
}

export { 
    catchAll
}