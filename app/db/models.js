import mongoose from "mongoose";

export const User = mongoose.model('User', new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    second_name: {
        type: String,
        required: false
    },
    first_last_name: {
        type: String,
        required: true    
    },
    second_last_name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    administrator: {
        type: Boolean,
        default: false
    }
}));