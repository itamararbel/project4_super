import mongoose from "mongoose";
const  cartsProductS  = require("../modal/productSchema");

const productCartSchema = new mongoose.Schema({
    _id: {
        type:String,
        default: Math.random().toString()
    },
       

    idProduct: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true,
    },
    productPrice: {
        type: Number,
        required: true,
    },
    qty: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    }
})

const cartSchema = new mongoose.Schema({
    id_client: {
        type: String,
        required: true
    },
    created : {
    type: Date,
    required: true,
    default: Date.now()
},
    products : [productCartSchema],
    
}
)

module.exports = mongoose.model('cartS', cartSchema)