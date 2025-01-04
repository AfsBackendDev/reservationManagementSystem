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

export const Space = mongoose.model('Space', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    capacity: {
        type: Number,
        required: true
    },
    availability: {
        type: [{
            date: {
                type: Date,
                required: true
            },
            start_HH: {
                type: String,
                required: true
            },
            start_MM: {
                type: String,
                required: true
            },
            end_HH: {
                type: String,
                required: true
            },
            end_MM: {
                type: String,
                required: true
            }
        }], 
        default: []
    }
}));