import mongoose from "mongoose";

const productCartSchema = new mongoose.Schema({
    idProduct: {
        type: String,
        required: true
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

module.exports = mongoose.model('cartsProductS', productCartSchema)