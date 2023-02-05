import express, { NextFunction, Request, Response } from "express";
import authLogic from "../logic/auth-logic";
import jwtHundler from "../util/jwtHundler";
import logger from "../util/errorsLogger";
import { authentication } from "../middleWere/authentication";

const authController = express.Router();

authController.get("/test", async (request: Request, response: Response, next: NextFunction) => {
    response.status(200).json("test is working")
})
authController.get("/isAvailable/:email", async (request: Request, response: Response, next: NextFunction) => {
    const email = request.params.email;

    let resp:boolean=null;
    try {
        resp = await authLogic.checkMail(email);
    } catch (err) {
        logger.error(err)
        next(err);

    }

    response.status(200).json(resp)
})

authController.get("/getOneUSer/:id", authentication, async (request: Request, response: Response, next: NextFunction) => {
    const authorization = request.header("Authorization").split(" ")[1];
    const id = request.params.id;
    if (jwtHundler.checkToken(authorization)) {
        try {
            response.set("Authorization", "Bearer " + await authLogic.relog(authorization));
            const resp = await authLogic.getUserByID(id)
            response.status(200).json(resp);
        } catch (err) {
            logger.error(err.message);
            next(err)
        }
    } else {
        response.status(400).json("can't get user info")
    }
}
)


authController.post("/log", async (request: Request, response: Response, next: NextFunction) => {
    const userCreds = (request.body);
    try {
        const token = await authLogic.checkCredentials(userCreds);
        response.set('Authorization', `Bearer ${token}`);
        response.status(200).json(token);
    } catch (err) {
        logger.error(err.message)
        response.status(401).json("user name and/or password are incorrect")
    }
}
)
authController.get("/reLog", async (request: Request, response: Response, next: NextFunction) => {
    const authorization = await request.header("Authorization").split(" ")[1];
    if (jwtHundler.checkToken(authorization)) {
        try {
            response.set("Authorization", "Bearer " + await authLogic.relog(authorization));
            response.status(204).json();
        } catch (err) {
            logger.error(err.message);
            next(err)
        }
    } else {
        response.status(400).json("token is expired plz log in")
    }
}
)

authController.post("/add", async (request: Request, response: Response, next: NextFunction) => {
    const body = request.body;
    let resp: string;
    try {
        resp = await authLogic.addNewUser(body, next)
        response.set("Authorization", "bearer " + resp)
        response.status(201).json(resp)
    }
    catch (err) {
        logger.error(err.message)
        next(err);
    }
}
)

export default authController;