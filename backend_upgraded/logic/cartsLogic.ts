import cartModal from "../modal/cartModal";
import orderModal from "../modal/orderModal";
import logger from "../util/errorsLogger";

const cartS = require("../modal/cartSchema");
const orderSchema = require("../modal/orderSchema");




const createNewCart = async (user_id: string) => {
    console.log("logic" + user_id);
    const cart = new cartS({ id_client: user_id });
    return await cart.save()
}

const getAllCarts = async (user_id: string) => {
    try {
        const carts = await cartS.find({ id_client: user_id });
        return carts
    } catch (err) {
        return (err)
    }
}
const updateCart = async (cart: cartModal): Promise<cartModal|string> => {
    console.log(cart)
    cartS.findByIdAndUpdate( cart._id, cart, (error, result) => {
        if (error) {
            console.log("some thing went wrong in update")
            logger.error(error)
            return("some thing went wrong")
        } else {
            console.log("xxxx")
            return cart;
        }
    });
    return cart;
}

const postPurchase = async (order: orderModal) => {
    const newOrder = new orderSchema(order);
    return await newOrder.save()
}

const numberOFBuys = async():Promise<number>=>{
    return await orderSchema.count()
}

const deliveryAvailable= async(date:string):Promise<boolean>=>{
    date=date.split("T")[0];
    const number = await orderSchema.find({deliveryDate: {
        $gte: (new Date(date+"T00:00:00")),
        $lte: (new Date(date+"T23:59:59"))
      }})   
    const isAvailable = number.length<4? true:false;
    return isAvailable
}

export default {
    createNewCart,
    getAllCarts,
    updateCart,
    postPurchase,
    numberOFBuys,
    deliveryAvailable
}