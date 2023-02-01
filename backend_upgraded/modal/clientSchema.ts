import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    user_name: {
        type: String,
        required: true
    },
    user_last_name : {
    type: String,
    required: true
},
user_mail : {
    type: String,
    required: true,
    unique:true
    
},user_password : {
    type: String,
    required: true
},
user_city : {
    type: String,
    required: true
},user_address : {
    type: String,
    required: true
},
   
})

module.exports = mongoose.model('userS', userSchema)