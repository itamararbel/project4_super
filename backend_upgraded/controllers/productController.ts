import express, { NextFunction, Request, Response } from "express";
import { authentication } from "../middleWere/authentication";
import { isAdmin } from "../middleWere/isAdmin";
import authLogic from "../logic/auth-logic";
import logic_product from "../logic/logic_product";
import logger from "../util/errorsLogger";

const productController = express.Router();

productController.get("/test", async (request: Request, response: Response, next: NextFunction) => {
    response.status(200).json("test is working")
})


productController.get("/all", async (request: Request, response: Response, next: NextFunction) => {
    try {
        response.status(200).json(await logic_product.getAllProducts())
    } catch (err) {
        logger.error(err)
        next(err)
    }
})
productController.get("/name/:exp", async (request: Request, response: Response, next: NextFunction) => {
    const exp = request.params.exp;
    try {
        response.status(200).json(await logic_product.searchInProduct(exp))
    } catch (err) {
        logger.error(err)
        
        next(err)
    }

})


productController.post("/add", [authentication, isAdmin], async (request: Request, response: Response, next: NextFunction) => {
    const newProduct = request.body;
    try {
        response.set("Authorization", await authLogic.relog(request.header("Authorization").split(" ")[1]));
        response.status(201).json(logic_product.addProduct(newProduct));
    } catch (err) {
        logger.error(err)
        next(err);
    }
}
)


productController.put("/edit", [authentication, isAdmin], async (request: Request, response: Response, next: NextFunction) => {
    const body = request.body;
    try{
    response.set("Authorization", await authLogic.relog(request.header("Authorization").split(" ")[1]));
    response.status(201).json(await logic_product.editProduct(body))
    }catch(err){
        logger.error(err);
        next(err)
    }
}
)

export default productController;
