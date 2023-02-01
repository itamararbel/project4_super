import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
   
    idClient: {
        type: String,
        required: true
    },
    idCart : {
    type: String,
    required: true
},
totalPrice : {
    type: Number,
    required: true
},city : {
    type: String,
    required: true
}, address : {
    type: String,
    required: true
},
deliveryDate : {
    type: Date,
    required: true
}, orderDate : {
    type: Date,
    required: true
},
 creditDigit : {
    type: Number,
    required: true
},
   
})

module.exports = mongoose.model('ordersCommitted', orderSchema)