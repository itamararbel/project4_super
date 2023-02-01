import productModal from "../modal/productModal"
import logger from "../util/errorsLogger";
const productS = require("../modal/productSchema");

const getAllProducts = async (): Promise<productModal[]> => {

    try {
        const products = await productS.find();
        return products
    } catch (err) {
        return (err)

    }
}


const addProduct = async (newProduct: productModal): Promise<productModal> => {
    console.log(newProduct)
    const product = new productS(newProduct);
    try {
        newProduct = await product.save();
        return newProduct
    } catch (err) {
        console.log(err)
    }
}

const editProduct = async (editedProduct: productModal): Promise<string> => {
    console.log(editedProduct)
    let msg:string;
     productS.findByIdAndUpdate(editedProduct._id, editedProduct, (error, result) => {
        if (error) {
            console.log("some thing went wrong in update");
            logger.error(error);
            msg="some thing went wrong"
            return msg;
        } else {
            msg= "product updated"
            console.log("product updated")
            return msg;
        }
    })
    return msg
}

const searchInProduct= async(expression:string):Promise<productModal[]>=>{
   try {
   return productS.find({"product_name" :{$regex : expression}})
     }catch(err){
        logger.error(err);
     }
     
}


export default {
    addProduct, getAllProducts, editProduct,searchInProduct
}