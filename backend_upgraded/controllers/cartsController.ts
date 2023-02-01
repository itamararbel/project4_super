import express, { NextFunction, Request, Response } from "express";
import { authentication } from "../middleWere/authentication";
import cartsLogic from "../logic/cartsLogic";
import jwtHundler from "../util/jwtHundler";
import orderModal from "../modal/orderModal";
import logger from "../util/errorsLogger";


const cartsController = express.Router();

cartsController.get("/create/:id", authentication, async (request: Request, response: Response, next: NextFunction) => {
    
    const id = request.params.id;
    let resp; 
    try{
        resp= await cartsLogic.createNewCart(id);
    }catch(err){
        logger.error(err);
    }
    response.status(200).json(resp)
})


cartsController.get("/all/:id", authentication, async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id
    let resp;
    try{
        resp=await cartsLogic.getAllCarts(id);
    } catch(err){
        logger.error(err);
    }
    
    response.status(200).json(resp)
})


cartsController.post("/save", authentication, async (request: Request, response: Response, next: NextFunction) => {
    const cart = request.body;
    response.status(201).json(await cartsLogic.updateCart(cart))
})

cartsController.post("/postBuy", authentication, async (request: Request, response: Response, next: NextFunction) => {
    const order = request.body;
    delete order._id
    if (jwtHundler.getUser(request.header("Authorization").split(" ")[1]).user.user_id === order.idClient) {
        let resp: orderModal
        console.log(order);
        try {
            resp = await cartsLogic.postPurchase(order)
            response.status(201).json(resp);
        } catch (err) {
            console.log(err);
        }

    } else {
        response.status(401).send("you need to log in again before committing the purchase")
    }
})

cartsController.get("/numberOFBuys/", async (request: Request, response: Response, next: NextFunction) => {
    let resp: number;
    try {
        resp = await cartsLogic.numberOFBuys()
    } catch (err) {
        next(err)
    }
    response.status(200).json(resp)
})

cartsController.get("/isAvailable/:date", authentication, async (request: Request, response: Response, next: NextFunction) => {
    const date = request.params.date;
    response.status(200).json(await cartsLogic.deliveryAvailable(date))
})


export default cartsController;