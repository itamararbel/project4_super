import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    product_name: {
        type: String,
        required: true
    },
    product_category : {
    type: String,
    required: true
},
product_price : {
    type: Number,
    required: true
},product_image_url : {
    type: String,
    required: true
},
   
})

module.exports = mongoose.model('productS', productSchema)