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
    reservations: {
        type: [{
            reservationHolder: {
                type: String,
                required: true
            },
            reservationHolderEmail: {
                type: String,
                required: true
            },
            startDate: {
                type: Date,
                required: true
            },
            endDate: {
                type: Date,
                required: true
            }
        }], 
        default: []
    }
}));